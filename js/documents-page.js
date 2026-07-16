/**
 * Controller for documents.html — wires the upload/paste UI to js/doc-analysis.js,
 * renders results, handles the AI-gated deep-analysis buttons, document comparison,
 * and PDF report generation (via the browser's own print-to-PDF, no library needed).
 */
(function () {
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Best-effort parse of an extracted date string ("1st August 2026", "01/08/2026",
  // etc.) into an ISO YYYY-MM-DD, so it can be saved as a reminder. DD/MM/YYYY is
  // handled explicitly since JS's native Date parsing assumes MM/DD/YYYY for slash
  // dates, which would silently misread Indian-format dates.
  function parseExtractedDate(str) {
    const cleaned = str.replace(/(\d+)(st|nd|rd|th)/gi, "$1").trim();
    const slashMatch = cleaned.match(/^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{2,4})$/);
    if (slashMatch) {
      let [, d, m, y] = slashMatch;
      if (y.length === 2) y = "20" + y;
      const iso = y + "-" + m.padStart(2, "0") + "-" + d.padStart(2, "0");
      return isNaN(new Date(iso).getTime()) ? null : iso;
    }
    const parsed = new Date(cleaned);
    if (isNaN(parsed.getTime())) return null;
    return parsed.getFullYear() + "-" + String(parsed.getMonth() + 1).padStart(2, "0") + "-" + String(parsed.getDate()).padStart(2, "0");
  }

  const docTypeSelect = document.getElementById("docType");
  if (!docTypeSelect) return; // not on documents.html

  DOCUMENT_TYPES.forEach(function (dt) {
    const opt = document.createElement("option");
    opt.value = dt.id;
    opt.textContent = dt.name;
    docTypeSelect.appendChild(opt);
  });

  // ---------- Mode tabs ----------
  document.querySelectorAll(".doc-mode-tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      document.querySelectorAll(".doc-mode-tab").forEach(function (t) { t.classList.remove("active"); });
      document.querySelectorAll(".doc-mode-panel").forEach(function (p) { p.classList.remove("active"); });
      tab.classList.add("active");
      document.getElementById("panel-" + tab.dataset.mode).classList.add("active");
    });
  });

  // ---------- File upload (.txt) ----------
  const docFile = document.getElementById("docFile");
  const docText = document.getElementById("docText");
  docFile.addEventListener("change", function () {
    const file = docFile.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) { docText.value = e.target.result; };
    reader.readAsText(file);
  });

  // ---------- "Why .txt only" note ----------
  const whyLink = document.getElementById("whyTxtLink");
  if (whyLink) {
    whyLink.addEventListener("click", function (e) {
      e.preventDefault();
      if (whyLink.dataset.expanded) return;
      whyLink.dataset.expanded = "1";
      whyLink.insertAdjacentHTML("afterend",
        ' <span class="small muted">— reading PDF/DOCX text reliably in-browser needs a fairly heavy parsing library; supporting it is on the roadmap. For now, open your document, select all, copy, and paste the text above.</span>');
    });
  }

  // ---------- Sample document ----------
  const SAMPLE_RENTAL_AGREEMENT =
    "RENTAL AGREEMENT\n\n" +
    "This Rental Agreement is made on 1st August 2026 between Mr. Ramesh Kumar (\"Landlord\") and Ms. Ananya Sharma (\"Tenant\").\n\n" +
    "1. Premises: The Landlord agrees to let out the residential premises situated at Flat No. 402, Sunshine Apartments, Bengaluru, to the Tenant.\n\n" +
    "2. Rent: The Tenant shall pay a monthly rent of Rs. 25,000 payable in advance on or before the 5th of every month.\n\n" +
    "3. Security Deposit: The Tenant has paid a security deposit of Rs. 1,50,000, which is refundable at the sole discretion of the Landlord upon vacating the premises, subject to deductions for damages.\n\n" +
    "4. Term: This agreement is for a period of 11 months commencing from 1st August 2026 and shall automatically renew for a further term of 11 months unless terminated by either party.\n\n" +
    "5. Termination: Either party may terminate this agreement by giving one month's written notice.\n\n" +
    "6. Maintenance: The Tenant shall be responsible for minor repairs, and the Landlord shall be responsible for major structural repairs.\n\n" +
    "7. Restrictions: The Tenant shall not sublet the premises without the prior written consent of the Landlord, and any breach of this clause shall result in forfeiture of the security deposit.\n\n" +
    "8. The Landlord may enter the premises for inspection without prior notice at any reasonable time.\n\n" +
    "IN WITNESS WHEREOF the parties have signed this agreement on the date first written above.";

  document.getElementById("loadSampleBtn").addEventListener("click", function () {
    docText.value = SAMPLE_RENTAL_AGREEMENT;
    docTypeSelect.value = "rental";
  });

  // ---------- Analyze ----------
  let lastAnalysis = null;

  document.getElementById("analyzeBtn").addEventListener("click", function () {
    const text = docText.value.trim();
    if (!text) { docText.focus(); return; }
    const docTypeId = docTypeSelect.value;
    const docTypeName = DOCUMENT_TYPES.find(function (d) { return d.id === docTypeId; }).name;

    const stats = DocAnalysis.stats(text);
    const dates = DocAnalysis.extractDates(text);
    const payments = DocAnalysis.extractPayments(text);
    const obligations = DocAnalysis.extractObligations(text);
    const outline = DocAnalysis.detectClauseOutline(text);
    const risky = DocAnalysis.detectRiskyPhrases(text);
    const missing = DocAnalysis.detectMissingClauses(text, docTypeId);
    const summary = DocAnalysis.buildExecutiveSummary(text, docTypeId);

    lastAnalysis = { text: text, docTypeName: docTypeName, stats: stats, dates: dates, payments: payments, obligations: obligations, outline: outline, risky: risky, missing: missing, summary: summary };

    document.getElementById("resultDocType").textContent = docTypeName;
    document.getElementById("resultStats").textContent = stats.words + " words · " + stats.paragraphs + " paragraphs";

    document.getElementById("execSummaryBody").innerHTML =
      "<p>This " + escapeHtml(docTypeName) + " is " + stats.words + " words across " + stats.paragraphs + " paragraphs. " +
      "It contains " + summary.dateCount + " date reference" + (summary.dateCount === 1 ? "" : "s") +
      (summary.firstDates.length ? " (including " + summary.firstDates.map(escapeHtml).join(", ") + ")" : "") + ", " +
      summary.paymentCount + " payment-related mention" + (summary.paymentCount === 1 ? "" : "s") + ", and " +
      summary.obligationCount + " sentence" + (summary.obligationCount === 1 ? "" : "s") + " using obligation language (\"shall,\" \"must,\" \"agrees to,\" etc.).</p>" +
      "<p>" + (summary.riskyCount
        ? summary.riskyCount + " clause pattern" + (summary.riskyCount === 1 ? "" : "s") + " commonly worth a closer look " + (summary.riskyCount === 1 ? "was" : "were") + " flagged: " + escapeHtml(summary.riskyLabels.join(", ")) + "."
        : "No commonly-flagged risky phrases from our checklist were detected — that doesn't guarantee the document is risk-free, just that none of our specific patterns matched.") + "</p>" +
      "<p>Of " + (summary.presentCount + summary.missingCount) + " commonly expected clauses for a " + escapeHtml(docTypeName) + ", " + summary.presentCount + " were detected and " + summary.missingCount +
      (summary.missingCount ? " appear to be missing: " + escapeHtml(summary.missingLabels.join(", ")) + "." : " are missing — a good sign, though always verify manually.") + "</p>";

    document.getElementById("riskyResults").innerHTML = risky.length
      ? risky.map(function (r) {
          return '<div class="doc-flag"><strong>' + escapeHtml(r.label) + '</strong><p class="small">' + escapeHtml(r.explanation) + '</p>' +
            r.occurrences.map(function (o) { return '<p class="small muted doc-quote">"' + escapeHtml(o) + '"</p>'; }).join("") + "</div>";
        }).join("")
      : '<p class="small muted">No flagged phrases found from our checklist.</p>';

    document.getElementById("missingResults").innerHTML =
      '<p class="small muted" style="margin-bottom:10px">Checked against commonly expected clauses for this document type — always verify manually.</p>' +
      missing.present.map(function (p) { return '<div class="doc-checklist-item present">✓ ' + escapeHtml(p) + "</div>"; }).join("") +
      missing.missing.map(function (p) { return '<div class="doc-checklist-item missing">⚠ ' + escapeHtml(p) + " — not detected</div>"; }).join("");

    document.getElementById("datesResults").innerHTML = dates.length
      ? dates.map(function (d, i) {
          const iso = parseExtractedDate(d.date);
          return '<div class="doc-extract-item"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px">' +
            "<strong>" + escapeHtml(d.date) + "</strong>" +
            (iso && typeof NotificationsEngine !== "undefined" ? '<button class="btn btn-ghost btn-sm remind-date-btn" data-iso="' + iso + '" data-label="' + escapeHtml(d.date) + '" data-idx="' + i + '">🔔 Remind me</button>' : "") +
            '</div><p class="small muted doc-quote">"' + escapeHtml(d.context) + '"</p></div>';
        }).join("")
      : '<p class="small muted">No dates detected.</p>';
    document.querySelectorAll(".remind-date-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        NotificationsEngine.addReminder({
          title: docTypeName + " — " + btn.dataset.label,
          category: "Document Expiry",
          date: btn.dataset.iso,
          notes: "Found by Document Intelligence in a " + docTypeName.toLowerCase() + ".",
          source: "document-intelligence"
        });
        btn.textContent = "✓ Reminder set";
        btn.disabled = true;
      });
    });
    if (typeof NotificationsEngine !== "undefined") NotificationsEngine.recordToolUsage("document-intelligence", { docType: docTypeName });

    document.getElementById("paymentsResults").innerHTML = payments.length
      ? payments.map(function (p) { return '<div class="doc-extract-item">' + (p.amount ? "<strong>" + escapeHtml(p.amount) + "</strong>" : "") + '<p class="small muted doc-quote">"' + escapeHtml(p.context) + '"</p></div>'; }).join("")
      : '<p class="small muted">No payment terms detected.</p>';

    document.getElementById("obligationsResults").innerHTML = obligations.length
      ? obligations.map(function (o) { return '<p class="small doc-quote">"' + escapeHtml(o) + '"</p>'; }).join("")
      : '<p class="small muted">No obligation-language sentences detected.</p>';

    document.getElementById("outlineResults").innerHTML = outline.length
      ? outline.map(function (o) { return '<p class="small">' + escapeHtml(o) + "</p>"; }).join("")
      : '<p class="small muted">No numbered/lettered clause headings detected — the document may not use a standard clause structure.</p>';

    document.getElementById("aiTaskResult").innerHTML = "";
    document.getElementById("analyzeResults").style.display = "block";
    document.getElementById("analyzeResults").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // ---------- AI-gated deep analysis ----------
  const isLive = !!AI_CONFIG.apiEndpoint;
  const aiStatusPill = document.getElementById("aiStatusPill");
  if (aiStatusPill) aiStatusPill.textContent = isLive ? "Live AI · connected" : "Demo mode · no AI backend connected";

  const TASK_PROMPTS = {
    summarize: "Summarize this document in plain language, in under 200 words, covering what it is, who the parties are, and the key terms.",
    explain: "Go through this document and explain each numbered clause or paragraph in one or two plain-language sentences.",
    improve: "Review this document and suggest specific improvements — clauses that are one-sided, vague, missing, or unusually risky for the party receiving it, with a brief reason for each suggestion."
  };

  document.querySelectorAll(".ai-task-btn").forEach(function (btn) {
    btn.addEventListener("click", async function () {
      if (!lastAnalysis) return;
      const task = btn.dataset.task;
      const resultBox = document.getElementById("aiTaskResult");

      if (!isLive) {
        resultBox.innerHTML =
          '<div class="alert" style="margin-top:14px"><div class="ico">🔌</div><p><strong>No AI backend connected.</strong> This feature (' + escapeHtml(TASK_PROMPTS[task].split(".")[0]) +
          ') needs a real language model to actually read and reason about your document — the extraction features above already work fully without one, but summarizing prose, explaining each paragraph, and suggesting improvements need genuine language understanding we won\'t fake. ' +
          'See <code>js/ai-config.js</code> and <code>server/chat-proxy-example.js</code> for how to connect one.</p></div>';
        return;
      }

      resultBox.innerHTML = '<div class="typing" style="margin-top:14px"><span></span><span></span><span></span></div>';
      try {
        const res = await fetch(AI_CONFIG.apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system: AI_CONFIG.documentSystemPrompt,
            messages: [{ role: "user", content: TASK_PROMPTS[task] + "\n\nDocument type: " + lastAnalysis.docTypeName + "\n\nDocument text:\n" + lastAnalysis.text }]
          })
        });
        if (!res.ok) throw new Error("Backend error " + res.status);
        const data = await res.json();
        resultBox.innerHTML = '<div class="card" style="margin-top:14px;background:var(--navy-900)"><p style="white-space:pre-wrap">' + escapeHtml(data.reply || "") + "</p></div>";
      } catch (err) {
        resultBox.innerHTML = '<div class="alert" style="margin-top:14px"><div class="ico">⚠️</div><p>Couldn\'t reach the AI backend (' + escapeHtml(err.message) + ").</p></div>";
      }
    });
  });

  // ---------- Compare mode ----------
  document.getElementById("compareBtn").addEventListener("click", function () {
    const a = document.getElementById("docTextA").value.trim();
    const b = document.getElementById("docTextB").value.trim();
    if (!a || !b) return;
    const diff = DocAnalysis.diffDocuments(a, b);
    const out = document.getElementById("diffOutput");
    out.innerHTML = diff.map(function (d) {
      if (d.type === "same") return '<p class="diff-same">' + escapeHtml(d.text) + "</p>";
      if (d.type === "removed") return '<p class="diff-removed">− ' + escapeHtml(d.text) + "</p>";
      return '<p class="diff-added">+ ' + escapeHtml(d.text) + "</p>";
    }).join("");
    document.getElementById("compareResults").style.display = "block";
    document.getElementById("compareResults").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // ---------- PDF report (native browser print) ----------
  document.getElementById("generateReportBtn").addEventListener("click", function () {
    if (!lastAnalysis) return;
    const a = lastAnalysis;
    const area = document.getElementById("printReportArea");
    area.innerHTML =
      "<h1>NyayaAI Document Report</h1>" +
      "<p class='muted'>Generated " + new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) + " · " + escapeHtml(a.docTypeName) + " · " + a.stats.words + " words</p>" +
      "<h2>Executive Summary</h2>" + document.getElementById("execSummaryBody").innerHTML +
      "<h2>Risky Sections (" + a.risky.length + ")</h2>" + (document.getElementById("riskyResults").innerHTML || "<p>None flagged.</p>") +
      "<h2>Missing Clauses Check</h2>" + document.getElementById("missingResults").innerHTML +
      "<h2>Extracted Dates (" + a.dates.length + ")</h2>" + (document.getElementById("datesResults").innerHTML || "<p>None found.</p>") +
      "<h2>Payment Terms (" + a.payments.length + ")</h2>" + (document.getElementById("paymentsResults").innerHTML || "<p>None found.</p>") +
      "<h2>Obligations Found (" + a.obligations.length + ")</h2>" + (document.getElementById("obligationsResults").innerHTML || "<p>None found.</p>") +
      "<h2>Clause Outline</h2>" + (document.getElementById("outlineResults").innerHTML || "<p>None detected.</p>") +
      "<p class='muted' style='margin-top:30px;font-size:.8rem'>Generated by NyayaAI's local document analysis — not a substitute for review by a licensed advocate. Verify every finding against the original document.</p>";
    area.style.display = "block";
    window.print();
    area.style.display = "none";
  });
})();
