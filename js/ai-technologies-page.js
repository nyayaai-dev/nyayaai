/**
 * Controller for ai-technologies.html — an honest status catalog of every AI-adjacent
 * technology on the site. Content lives inline here (not js/data/) since it's specific
 * to this one presentation page, not shared knowledge-base data.
 */
(function () {
  const liveGrid = document.getElementById("liveGrid");
  if (!liveGrid) return; // not on ai-technologies.html

  const TECHNOLOGIES = [
    {
      status: "live",
      icon: "👁️",
      name: "OCR (Optical Character Recognition)",
      description: "Real on-device text extraction from photos/scans of documents, via a locally-vendored Tesseract.js — no cloud OCR API, nothing uploaded. Machine-read text is clearly labeled as approximate.",
      href: "documents.html", hrefLabel: "Try it on Documents →"
    },
    {
      status: "live",
      icon: "🎤",
      name: "Speech Recognition",
      description: "Dictate your question into the chat using your browser's built-in Web Speech API.",
      note: "Caveat: unlike the OCR/TTS on this site, Chrome/Edge's implementation sends audio to the browser vendor's own servers for processing — it doesn't touch NyayaAI's code or servers, but it isn't purely on-device either. The mic button says this too.",
      href: "chat.html", hrefLabel: "Try it in AI Consultation →"
    },
    {
      status: "live",
      icon: "🔊",
      name: "Text-to-Speech",
      description: "Have any AI Consultation answer read aloud, via your browser's built-in speech synthesis — genuinely on-device, no network call.",
      href: "chat.html", hrefLabel: "Try it in AI Consultation →"
    },
    {
      status: "live",
      icon: "🔀",
      name: "AI Document Comparison",
      description: "A real longest-common-subsequence (LCS) paragraph-level diff between two document versions — exact, not an approximation, and not an AI guess.",
      href: "documents.html", hrefLabel: "Try it on Documents →"
    },
    {
      status: "live",
      icon: "🏷️",
      name: "Named Entity Recognition (NER)",
      description: "Pattern- and list-based extraction of persons, organizations, defined parties (e.g. \"Landlord\"), and Indian locations from a document — not a trained NER model, but genuinely useful as a first pass.",
      href: "documents.html", hrefLabel: "Try it on Documents →"
    },
    {
      status: "live",
      icon: "🔍",
      name: "AI Classification",
      description: "Keyword-overlap scoring auto-detects a document's type (rental agreement, NDA, employment contract, etc.) or the right trademark class for a business description — the same approach used twice on this site, not a trained classifier.",
      href: "documents.html", hrefLabel: "Try \"🔍 Detect\" on Documents →"
    },
    {
      status: "gated",
      icon: "💬",
      name: "LLM-powered Legal Q&A",
      description: "The AI Consultation chat runs in demo mode by default: a local, IDF-weighted keyword-retrieval engine over the seeded legal knowledge base — not a general-purpose LLM. Set AI_CONFIG.apiEndpoint (js/ai-config.js) to a real backend and it becomes genuine LLM-powered Q&A, using the exact same chat UI.",
      href: "chat.html", hrefLabel: "See current (demo-mode) chat →"
    },
    {
      status: "gated",
      icon: "📚",
      name: "Retrieval-Augmented Generation (RAG)",
      description: "The \"retrieval\" half already runs locally and for real — chat.js scores every section of the legal knowledge base by relevance to your question using IDF word-weighting. The \"generation\" half (an LLM writing an answer from that retrieved context) needs a connected backend to exist — without one, the demo mode surfaces the best-matching sections directly instead.",
      href: "chat.html", hrefLabel: "See the retrieval engine in action →"
    },
    {
      status: "gated",
      icon: "🧠",
      name: "Embeddings for Semantic Search",
      description: "True semantic search needs vector embeddings from a trained model — that requires either an embeddings API call or a large local model, neither of which this site ships. What runs today instead is classical IDF/keyword scoring (the same engine behind chat and the site search) — related, genuinely useful, but not deep-learning embeddings. Labeled as such rather than overstated.",
      href: null
    },
    {
      status: "gated",
      icon: "📝",
      name: "AI Summarization",
      description: "The \"Summarize\" / \"Explain every paragraph\" / \"Suggest improvements\" buttons on Documents are fully wired up and ready — they just show an honest \"no AI backend connected\" message until AI_CONFIG.apiEndpoint is set, instead of faking a summary.",
      href: "documents.html", hrefLabel: "See the gated buttons →"
    },
    {
      status: "skipped",
      icon: "🌐",
      name: "AI Translation",
      description: "Not built. NyayaAI briefly shipped a local UI-chrome-only translator (nav/buttons in 8 languages, legal content staying English) and then removed it entirely at request — the site is English-only by design for now. Real translation of legal content would need either a connected translation API or a professionally reviewed per-language dataset — machine-translating legal specifics without review risks getting them wrong.",
      href: null
    }
  ];

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function card(t) {
    const badge = t.status === "live"
      ? '<span class="pill green">✅ Live &amp; local</span>'
      : t.status === "gated"
        ? '<span class="pill red">🔌 Needs a backend</span>'
        : '<span class="pill">⛔ Not built</span>';
    let html = '<div class="card" style="padding:26px">' +
      '<div class="badge-row">' + badge + "</div>" +
      "<h3>" + t.icon + " " + escapeHtml(t.name) + "</h3>" +
      "<p>" + escapeHtml(t.description) + "</p>";
    if (t.note) html += '<p class="small muted" style="margin-top:8px">' + escapeHtml(t.note) + "</p>";
    if (t.href) html += '<a href="' + t.href + '" class="pill gold" style="margin-top:14px">' + escapeHtml(t.hrefLabel) + "</a>";
    html += "</div>";
    return html;
  }

  const liveHtml = TECHNOLOGIES.filter(function (t) { return t.status === "live"; }).map(card).join("");
  const gatedHtml = TECHNOLOGIES.filter(function (t) { return t.status !== "live"; }).map(card).join("");

  liveGrid.innerHTML = liveHtml;
  document.getElementById("gatedGrid").innerHTML = gatedHtml;
})();
