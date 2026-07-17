/**
 * NyayaAI Chat Engine — pure retrieval/reply logic, no DOM.
 * ---------------------------------------------------------------
 * If AI_CONFIG.apiEndpoint (js/ai-config.js) is set, messages are POSTed to that
 * backend (expected to proxy to an LLM such as Claude/GPT and return {reply: "..."})
 * — see server/chat-proxy-example.js and README.md for how to stand one up.
 *
 * Until a backend is configured, replies come from DEMO MODE: a local, keyword-based
 * retrieval engine over js/data/laws-data.js. It is NOT a general-purpose LLM — it only
 * surfaces matching statute/article summaries from the seeded knowledge base.
 *
 * Shared by js/chat.js (chat.html) and js/index-page.js (homepage demo widget) so both
 * chat surfaces answer identically instead of drifting apart over time.
 */
const ChatEngine = (function () {
  const DISCLAIMER_LINE =
    "This is general legal information based on current Indian statutes, not a personalised legal opinion. " +
    "For representation in court, contract negotiation, or advice specific to your facts, please also consult a licensed advocate.";

  const isLive = !!AI_CONFIG.apiEndpoint;

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---------- Demo-mode retrieval engine ----------
  const STOPWORDS = new Set(["the","a","an","is","are","of","to","in","for","and","or","what","how","do","i","my","me","can","you","about","on","with","this","that","it","please","tell","explain","help","india","indian","under","by","from","as","at","into","than","was","were","be","been","if","when","new","will","not","applies","apply","applied"]);

  function tokenize(str) {
    return str.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(function (w) { return w && !STOPWORDS.has(w); });
  }

  // Document-frequency map: how many sections each word appears in, across the whole
  // knowledge base. Built once. Lets scoreText tell a distinctive word (e.g. "cyberbullying,"
  // in one section) from a generic one (e.g. "online," scattered across many) — without this,
  // a query could get outranked by an unrelated section that happens to share two common words.
  const WORD_DOC_FREQ = (function () {
    const df = {};
    let sectionCount = 0;
    if (typeof LAWS_DB !== "undefined") {
      LAWS_DB.categories.forEach(function (cat) {
        cat.sections.forEach(function (s) {
          sectionCount++;
          const words = new Set((s.title + " " + s.body).toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean));
          words.forEach(function (w) { df[w] = (df[w] || 0) + 1; });
        });
      });
    }
    return { counts: df, total: sectionCount || 1 };
  })();

  function idfWeight(word) {
    const df = WORD_DOC_FREQ.counts[word];
    const total = WORD_DOC_FREQ.total;
    // If the query word never appears verbatim anywhere in the corpus, any "match" scoreText
    // found for it was necessarily a fuzzy prefix collision (e.g. "shared" ~ "shareholders") —
    // that deserves low confidence, not the maximum rarity boost a genuinely rare real word gets.
    if (df === undefined) return 0.5;
    if (df === 1) return 3;
    if (df <= 3) return 2;
    if (df <= total * 0.25) return 1;
    return 0.4; // appears in a quarter+ of all sections — too generic to be a good discriminator
  }

  // Plain word-overlap score — used for prose (category name/summary, section title/body).
  // Matches on a shared word-prefix (light stemming) rather than raw substring, so query
  // words like "register"/"company" also match text words like "registration"/"companies".
  function scoreText(tokens, text) {
    const textWords = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
    let score = 0;
    tokens.forEach(function (tok) {
      if (/^\d+$/.test(tok)) return; // bare numbers are handled by scoreSection's exact ref-number match instead
      const matched = textWords.some(function (w) {
        const minLen = Math.min(tok.length, w.length);
        if (minLen < 4) return tok === w;
        const prefixLen = Math.min(minLen, 5);
        return tok.slice(0, prefixLen) === w.slice(0, prefixLen);
      });
      if (matched) score += (tok.length > 4 ? 2 : 1) * idfWeight(tok);
    });
    return score;
  }

  // Section-aware score: rewards an exact Article/Section number match and an exact ref
  // phrase match far more than incidental word overlap in the body text, so "Article 21"
  // beats a section whose body merely happens to contain the word "constitution".
  function scoreSection(tokens, queryLower, section) {
    let score = scoreText(tokens, section.title + " " + section.body);

    const refLower = section.ref.toLowerCase();
    if (queryLower.indexOf(refLower) !== -1) score += 25; // e.g. query contains "article 21" verbatim

    const refNumberMatch = section.ref.match(/(\d+[A-Za-z]?)/);
    if (refNumberMatch) {
      const refNumber = refNumberMatch[1].toLowerCase();
      const hasExactNumberToken = tokens.some(function (tok) { return tok === refNumber; });
      if (hasExactNumberToken) score += 15;
    }

    return score;
  }

  function findAnswer(query) {
    const tokens = tokenize(query);
    const queryLower = query.toLowerCase();
    if (tokens.length === 0) return null;

    let best = { category: null, score: 0, sections: [] };

    LAWS_DB.categories.forEach(function (cat) {
      let catScore = scoreText(tokens, cat.name + " " + cat.tagline + " " + cat.summary);
      const sectionScores = cat.sections.map(function (s) {
        return { section: s, score: scoreSection(tokens, queryLower, s) };
      }).sort(function (a, b) { return b.score - a.score; });

      const topSectionScore = sectionScores.length ? sectionScores[0].score : 0;
      // Section-level matches (specific provisions) are weighted well above category-name
      // overlap, so a generic shared word (e.g. "security") in one category's name can't
      // outrank a more specific match in another category's actual provisions.
      const total = topSectionScore * 3 + catScore;

      if (total > best.score) {
        best = {
          category: cat,
          score: total,
          sections: sectionScores.filter(function (s) { return s.score > 0; }).slice(0, 3).map(function (s) { return s.section; })
        };
      }
    });

    if (best.score === 0 || !best.category) return null;
    return best;
  }

  function formatAnswer(match) {
    const cat = match.category;
    let html = "";

    if (match.sections.length > 0) {
      html += "<p>Based on <strong>" + escapeHtml(cat.name) + "</strong>, here's what's relevant:</p><ul>";
      match.sections.forEach(function (s) {
        html += "<li><strong>" + escapeHtml(s.ref) + " — " + escapeHtml(s.title) + "</strong><br>" + escapeHtml(s.body) + "</li>";
      });
      html += "</ul>";
    } else {
      html += "<p>Here's an overview of <strong>" + escapeHtml(cat.name) + "</strong>: " + escapeHtml(cat.summary) + "</p>";
    }

    if (cat.recentUpdates && cat.recentUpdates.length) {
      html += '<p style="margin-top:10px"><strong>Current status:</strong> ' + escapeHtml(cat.recentUpdates[0]) + "</p>";
    }

    html += '<span class="cite">Sources: ' + cat.keyActs.slice(0, 3).map(function (a) { return escapeHtml(a.name + " (" + a.year + ")"); }).join(", ") +
      '. Full category: <a href="laws/' + cat.id + '.html" style="color:inherit;text-decoration:underline">' + escapeHtml(cat.name) + " →</a><br>" +
      escapeHtml(DISCLAIMER_LINE) + "</span>";

    return html;
  }

  function fallbackAnswer(query) {
    const greetWords = ["hi", "hello", "hey", "namaste"];
    const tokens = tokenize(query);
    if (tokens.length === 0 || tokens.some(function (t) { return greetWords.indexOf(t) !== -1; })) {
      return "<p>Namaste! I'm NyayaAI. Ask me about any area of Indian law — for example: <em>\"What is the punishment for cheating under BNS?\"</em> or <em>\"What is Article 21?\"</em> or <em>\"How does GST input tax credit work?\"</em></p>";
    }
    const cats = LAWS_DB.categories.map(function (c) { return c.icon + " " + c.name; }).join(" · ");
    return "<p>I couldn't find a close match in the current knowledge base for that. I currently cover: " + escapeHtml(cats) +
      ".</p><p>Try rephrasing with a specific act, section, or situation (e.g. \"my landlord won't return my deposit\", \"maternity leave rules\", \"how to file an FIR\").</p><span class=\"cite\">" + escapeHtml(DISCLAIMER_LINE) + "</span>";
  }

  async function getReply(query, history) {
    history = history || [];
    if (isLive) {
      try {
        const res = await fetch(AI_CONFIG.apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ system: AI_CONFIG.chatSystemPrompt, messages: history.concat([{ role: "user", content: query }]) })
        });
        if (!res.ok) throw new Error("Backend error " + res.status);
        const data = await res.json();
        return escapeHtml(data.reply || "").replace(/\n/g, "<br>");
      } catch (err) {
        return "<p>⚠️ Couldn't reach the live AI backend (" + escapeHtml(err.message) + "). Falling back to demo mode.</p>" + (findAnswer(query) ? formatAnswer(findAnswer(query)) : fallbackAnswer(query));
      }
    }
    const match = findAnswer(query);
    return match ? formatAnswer(match) : fallbackAnswer(query);
  }

  return {
    isLive: isLive,
    DISCLAIMER_LINE: DISCLAIMER_LINE,
    escapeHtml: escapeHtml,
    findAnswer: findAnswer,
    formatAnswer: formatAnswer,
    fallbackAnswer: fallbackAnswer,
    getReply: getReply
  };
})();
