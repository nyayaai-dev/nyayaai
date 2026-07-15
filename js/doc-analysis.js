/**
 * NyayaAI Document Intelligence — local analysis engine.
 * Everything here runs entirely in the browser on the actual text you provide — no
 * server, no AI call, nothing fabricated. It's pattern/heuristic-based (dates, money
 * amounts, obligation language, a curated risky-phrase list, a per-document-type
 * "commonly expected clause" checklist, and a real paragraph-level diff) — genuinely
 * useful for a first pass, but not a substitute for a licensed advocate's review.
 */
const DocAnalysis = (function () {
  function splitParagraphs(text) {
    return text
      .split(/\r?\n\s*\r?\n|\r?\n(?=\s*(?:\d+[\.\)]|\([a-zA-Z0-9]+\)|[A-Z][A-Z\s]{3,}))/)
      .map(function (p) { return p.trim(); })
      .filter(Boolean);
  }

  function splitLines(text) {
    return text.split(/\r?\n/).map(function (l) { return l.trim(); }).filter(Boolean);
  }

  function splitSentences(text) {
    // Avoids lookbehind assertions (still unsupported in some older browser engines)
    // in favour of a simple "chunks ending in . ! or ?" match.
    const matches = text.replace(/\s+/g, " ").match(/[^.!?]+[.!?]+/g) || [];
    return matches.map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 8; });
  }

  function context(text, index, matchLength, span) {
    span = span || 90;
    const start = Math.max(0, index - span);
    const end = Math.min(text.length, index + matchLength + span);
    let snippet = text.slice(start, end).replace(/\s+/g, " ").trim();
    if (start > 0) snippet = "…" + snippet;
    if (end < text.length) snippet = snippet + "…";
    return snippet;
  }

  // ---------- Dates ----------
  const DATE_REGEX = new RegExp(
    "\\b(" +
    "\\d{1,2}(?:st|nd|rd|th)?[\\s./-]+(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[\\s,./-]+\\d{2,4}" +
    "|(?:January|February|March|April|May|June|July|August|September|October|November|December)\\s+\\d{1,2}(?:st|nd|rd|th)?,?\\s+\\d{2,4}" +
    "|\\d{1,2}[./-]\\d{1,2}[./-]\\d{2,4}" +
    ")\\b", "gi"
  );

  function extractDates(text) {
    const results = [];
    const seen = new Set();
    let m;
    DATE_REGEX.lastIndex = 0;
    while ((m = DATE_REGEX.exec(text)) !== null) {
      const key = m[0].toLowerCase();
      if (seen.has(key + m.index)) continue;
      seen.add(key + m.index);
      results.push({ date: m[0], context: context(text, m.index, m[0].length) });
    }
    return results;
  }

  // ---------- Payment terms ----------
  // \b before the currency marker matters: without it "rs" matches inside ordinary
  // words like "repairs" or "years", producing garbage results.
  const CURRENCY_REGEX = /(?:₹|\brs\.?|\binr\b)\s?[\d,]+(?:\.\d+)?(?:\s?(?:lakh|lakhs|crore|crores|thousand))?/gi;

  function extractPayments(text) {
    const results = [];
    let m;
    CURRENCY_REGEX.lastIndex = 0;
    while ((m = CURRENCY_REGEX.exec(text)) !== null) {
      results.push({ amount: m[0].trim(), context: context(text, m.index, m[0].length) });
    }
    if (results.length === 0) {
      // Fall back to keyword sentences if no explicit currency amount is found.
      const kwRegex = new RegExp("\\b(" + PAYMENT_KEYWORDS.join("|") + ")\\b", "i");
      splitSentences(text).forEach(function (s) {
        if (kwRegex.test(s)) results.push({ amount: null, context: s });
      });
    }
    return results.slice(0, 25);
  }

  // ---------- Obligations ----------
  function extractObligations(text) {
    const kwRegex = new RegExp("\\b(" + OBLIGATION_KEYWORDS.map(function (k) { return k.replace(/\s+/g, "\\s+"); }).join("|") + ")\\b", "i");
    const sentences = splitSentences(text);
    const results = [];
    sentences.forEach(function (s) {
      if (kwRegex.test(s) && s.length < 400) results.push(s);
    });
    return results.slice(0, 40);
  }

  // ---------- Clause outline ----------
  const CLAUSE_LINE_REGEX = /^(\d{1,2}(?:\.\d{1,2})*[\.\)]|\([a-zA-Z0-9]+\)|Article\s+\d+|Clause\s+\d+|Section\s+\d+|WHEREAS|NOW THEREFORE|IN WITNESS WHEREOF)/i;

  function detectClauseOutline(text) {
    const lines = splitLines(text);
    const clauses = [];
    lines.forEach(function (line) {
      if (CLAUSE_LINE_REGEX.test(line) && line.length < 200) {
        clauses.push(line);
      }
    });
    return clauses.slice(0, 60);
  }

  // ---------- Risky phrases ----------
  function detectRiskyPhrases(text) {
    const found = [];
    RISKY_PHRASES.forEach(function (rp) {
      const re = new RegExp(rp.pattern, "gi");
      const occurrences = [];
      let m;
      while ((m = re.exec(text)) !== null) {
        occurrences.push(context(text, m.index, m[0].length));
        if (occurrences.length >= 3) break; // cap examples per phrase
      }
      if (occurrences.length) {
        found.push({ label: rp.label, explanation: rp.explanation, occurrences: occurrences });
      }
    });
    return found;
  }

  // ---------- Missing clauses ----------
  function detectMissingClauses(text, docTypeId) {
    const docType = DOCUMENT_TYPES.find(function (d) { return d.id === docTypeId; }) || DOCUMENT_TYPES[0];
    const lower = text.toLowerCase();
    const present = [];
    const missing = [];
    docType.checklist.forEach(function (item) {
      const hit = item.hints.some(function (hint) {
        try { return new RegExp(hint, "i").test(lower); } catch (e) { return lower.indexOf(hint) !== -1; }
      });
      (hit ? present : missing).push(item.label);
    });
    return { docTypeName: docType.name, present: present, missing: missing };
  }

  // ---------- Word/paragraph stats ----------
  function stats(text) {
    const words = text.trim().split(/\s+/).filter(Boolean);
    return { words: words.length, paragraphs: splitParagraphs(text).length, characters: text.length };
  }

  // ---------- Paragraph-level diff (LCS-based, genuinely computed, no AI) ----------
  function diffDocuments(textA, textB) {
    const a = splitParagraphs(textA);
    const b = splitParagraphs(textB);
    const n = a.length, m = b.length;
    const dp = Array.from({ length: n + 1 }, function () { return new Array(m + 1).fill(0); });
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
    const result = [];
    let i = 0, j = 0;
    while (i < n && j < m) {
      if (a[i] === b[j]) { result.push({ type: "same", text: a[i] }); i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) { result.push({ type: "removed", text: a[i] }); i++; }
      else { result.push({ type: "added", text: b[j] }); j++; }
    }
    while (i < n) { result.push({ type: "removed", text: a[i] }); i++; }
    while (j < m) { result.push({ type: "added", text: b[j] }); j++; }
    return result;
  }

  // ---------- Composite executive summary (built from the real extracted data above) ----------
  function buildExecutiveSummary(text, docTypeId) {
    const s = stats(text);
    const dates = extractDates(text);
    const payments = extractPayments(text);
    const obligations = extractObligations(text);
    const risky = detectRiskyPhrases(text);
    const missing = detectMissingClauses(text, docTypeId);
    return {
      stats: s,
      dateCount: dates.length,
      firstDates: dates.slice(0, 3).map(function (d) { return d.date; }),
      paymentCount: payments.length,
      obligationCount: obligations.length,
      riskyCount: risky.length,
      riskyLabels: risky.map(function (r) { return r.label; }),
      docTypeName: missing.docTypeName,
      presentCount: missing.present.length,
      missingCount: missing.missing.length,
      missingLabels: missing.missing
    };
  }

  return {
    splitParagraphs: splitParagraphs,
    splitSentences: splitSentences,
    extractDates: extractDates,
    extractPayments: extractPayments,
    extractObligations: extractObligations,
    detectClauseOutline: detectClauseOutline,
    detectRiskyPhrases: detectRiskyPhrases,
    detectMissingClauses: detectMissingClauses,
    stats: stats,
    diffDocuments: diffDocuments,
    buildExecutiveSummary: buildExecutiveSummary
  };
})();
