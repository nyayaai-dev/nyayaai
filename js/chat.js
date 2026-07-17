/**
 * Controller for chat.html — wires the chat UI to js/chat-engine.js (ChatEngine),
 * plus mic dictation, text-to-speech, quick prompts, and the ?q= prefill param.
 */
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

  if (statusDot && statusText) {
    if (ChatEngine.isLive) {
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

  function addMessage(role, htmlContent) {
    const row = el("div", "msg-row " + (role === "user" ? "user" : "ai"));
    const avatar = el("div", "avatar " + (role === "user" ? "user" : "ai"), role === "user" ? "You" : "AI");
    const bubble = el("div", "bubble", htmlContent);
    row.appendChild(avatar);
    row.appendChild(bubble);
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
    if (role === "ai" && typeof window.speechSynthesis !== "undefined") {
      const speakBtn = el("button", "speak-btn", "🔊");
      speakBtn.type = "button";
      speakBtn.setAttribute("aria-label", "Read this answer aloud");
      speakBtn.title = "Read aloud — runs on your device, via your browser's text-to-speech";
      speakBtn.addEventListener("click", function () {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(bubble.innerText || bubble.textContent);
        utter.lang = "en-IN";
        window.speechSynthesis.speak(utter);
      });
      bubble.appendChild(speakBtn);
    }
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

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addMessage("user", ChatEngine.escapeHtml(text));
    history.push({ role: "user", content: text });
    input.value = "";
    input.style.height = "auto";

    const typingRow = addTyping();
    const delay = 500 + Math.random() * 500;
    const replyHtml = await ChatEngine.getReply(text, history);

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

  // ---------- Speech recognition (dictate) ----------
  // Uses the browser's built-in Web Speech API. In Chrome/Edge this is NOT purely on-device —
  // the browser vendor's own servers do the speech-to-text processing (the audio never touches
  // NyayaAI's code or any NyayaAI server, but it isn't private from the browser vendor either,
  // unlike the OCR/TTS features on this site). The mic button and its tooltip say this plainly.
  const micBtn = document.getElementById("micBtn");
  const micHint = document.getElementById("micHint");
  const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (micBtn) {
    if (!SpeechRecognitionCtor) {
      micBtn.style.display = "none";
    } else {
      const recognition = new SpeechRecognitionCtor();
      recognition.lang = "en-IN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      let listening = false;

      micBtn.addEventListener("click", function () {
        if (listening) { recognition.stop(); return; }
        try {
          recognition.start();
          listening = true;
          micBtn.classList.add("listening");
          if (micHint) micHint.style.display = "block";
        } catch (err) { /* recognition already running */ }
      });
      recognition.onresult = function (e) {
        const transcript = e.results[0][0].transcript;
        input.value = (input.value ? input.value + " " : "") + transcript;
        input.dispatchEvent(new Event("input"));
        input.focus();
      };
      recognition.onerror = function () {
        listening = false;
        micBtn.classList.remove("listening");
        if (micHint) micHint.style.display = "none";
      };
      recognition.onend = function () {
        listening = false;
        micBtn.classList.remove("listening");
        if (micHint) micHint.style.display = "none";
      };
    }
  }

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
