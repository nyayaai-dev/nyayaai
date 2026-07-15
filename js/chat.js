/**
 * NyayaAI Chat Engine
 * ---------------------------------------------------------------
 * If CHAT_CONFIG.apiEndpoint is set, messages are POSTed to that backend
 * (expected to proxy to an LLM such as Claude/GPT and return {reply: "..."})
 * — see server/chat-proxy-example.js and README.md for how to stand one up.
 *
 * Until a backend is configured, the assistant runs in DEMO MODE: a local,
 * keyword-based retrieval engine over js/data/laws-data.js. It is NOT a
 * general-purpose LLM — it only surfaces matching statute/article summaries
 * from the seeded knowledge base, so answers are limited to that content.
 */
const CHAT_CONFIG = {
  apiEndpoint: "", // e.g. "https://your-backend.example.com/api/chat" — leave empty for demo mode
  systemPrompt:
    "You are NyayaAI, an AI legal information assistant for Indian law. Answer using current Indian statutes " +
    "(BNS/BNSS/BSA, Constitution, Companies Act, Labour Codes, DPDP Act, etc). Always cite the specific " +
    "Act/Section/Article. Always include a disclaimer that this is legal information, not a substitute for a " +
    "licensed advocate, especially for court representation, filings, or jurisdiction-specific strategy."
};

const DISCLAIMER_LINE =
  "This is general legal information based on current Indian statutes, not a personalised legal opinion. " +
  "For representation in court, contract negotiation, or advice specific to your facts, please also consult a licensed advocate.";

(function () {
  const chipWrap = document.getElementById("areaChips");
  if (chipWrap && typeof LAWS_DB !== "undefined") {
    LAWS_DB.categories.forEach(function (c) {
      const chip = document.createElement("span");
      chip.className = "area-chip";
      chip.textContent = c.icon + " " + c.name;
      chip.dataset.prompt = "Tell me about " + c.name + " in India";
      chipWrap.appendChild(chip);
    });
  }
})();

(function () {
  const log = document.getElementById("chatLog");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  const statusDot = document.getElementById("statusDot");
  const statusText = document.getElementById("statusText");

  if (!log || !form || !input) return;

  const isLive = !!CHAT_CONFIG.apiEndpoint;
  if (statusDot && statusText) {
    if (isLive) {
      statusDot.classList.remove("demo");
      statusText.textContent = "Live AI · connected";
    } else {
      statusDot.classList.add("demo");
      statusText.textContent = "Demo mode · local knowledge base (no LLM key configured)";
    }
  }

  let history = [];

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function addMessage(role, htmlContent) {
    const row = el("div", "msg-row " + (role === "user" ? "user" : "ai"));
    const avatar = el("div", "avatar " + (role === "user" ? "user" : "ai"), role === "user" ? "You" : "AI");
    const bubble = el("div", "bubble", htmlContent);
    row.appendChild(avatar);
    row.appendChild(bubble);
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
    return bubble;
  }

  function addTyping() {
    const row = el("div", "msg-row ai");
    const avatar = el("div", "avatar ai", "AI");
    const bubble = el("div", "bubble", '<div class="typing"><span></span><span></span><span></span></div>');
    row.appendChild(avatar);
    row.appendChild(bubble);
    row.dataset.typing = "1";
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
    return row;
  }

  // ---------- Demo-mode retrieval engine ----------
  const STOPWORDS = new Set(["the","a","an","is","are","of","to","in","for","and","or","what","how","do","i","my","me","can","you","about","on","with","this","that","it","please","tell","explain","help","india","indian","under","by","from","as","at","into","than","was","were","be","been","if","when","new","will","not"]);

  function tokenize(str) {
    return str.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(function (w) { return w && !STOPWORDS.has(w); });
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
      if (matched) score += tok.length > 4 ? 2 : 1;
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

  function formatAnswer(match, query) {
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

  async function getReply(query) {
    if (isLive) {
      try {
        const res = await fetch(CHAT_CONFIG.apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ system: CHAT_CONFIG.systemPrompt, messages: history.concat([{ role: "user", content: query }]) })
        });
        if (!res.ok) throw new Error("Backend error " + res.status);
        const data = await res.json();
        return escapeHtml(data.reply || "").replace(/\n/g, "<br>");
      } catch (err) {
        return "<p>⚠️ Couldn't reach the live AI backend (" + escapeHtml(err.message) + "). Falling back to demo mode.</p>" + (findAnswer(query) ? formatAnswer(findAnswer(query), query) : fallbackAnswer(query));
      }
    }
    const match = findAnswer(query);
    return match ? formatAnswer(match, query) : fallbackAnswer(query);
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addMessage("user", escapeHtml(text));
    history.push({ role: "user", content: text });
    input.value = "";
    input.style.height = "auto";

    const typingRow = addTyping();
    const delay = 500 + Math.random() * 500;
    const replyHtml = await getReply(text);

    setTimeout(function () {
      typingRow.remove();
      addMessage("ai", replyHtml);
      history.push({ role: "assistant", content: text });
    }, delay);
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });
  input.addEventListener("input", function () {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 120) + "px";
  });

  document.querySelectorAll(".quick-prompt, .area-chip[data-prompt]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      input.value = btn.dataset.prompt || btn.textContent.trim();
      form.requestSubmit();
    });
  });

  // Prefill from ?q= param (used by "Ask AI about this" links on category pages)
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");
  if (q) {
    input.value = q;
    setTimeout(function () { form.requestSubmit(); }, 300);
  }
})();
