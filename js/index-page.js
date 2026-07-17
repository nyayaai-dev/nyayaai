/**
 * Controller for the redesigned index.html (dark landing page). Populates every
 * data-driven section from real site data (LAWS_DB, ChatEngine) — no fabricated
 * stats, testimonials, or claims. See README.md "Homepage design" for what was
 * changed from the original Design Composer import and why.
 */
(function () {
  const root = document.getElementById("nyaLanding");
  if (!root) return; // not on the redesigned homepage

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---------- Scroll progress bar ----------
  const scrollBar = document.getElementById("scrollBar");
  if (scrollBar) {
    window.addEventListener("scroll", function () {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      scrollBar.style.width = (h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0) + "%";
    }, { passive: true });
  }

  // ---------- Cursor spotlight ----------
  const spotlight = document.getElementById("spotlight");
  if (spotlight) {
    window.addEventListener("mousemove", function (e) {
      spotlight.style.setProperty("--mx", e.clientX + "px");
      spotlight.style.setProperty("--my", e.clientY + "px");
    });
  }

  // ---------- Orb particles (decorative) ----------
  const orbWrap = document.getElementById("orbParticles");
  if (orbWrap) {
    let html = "";
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * 2 * Math.PI;
      const r = 150 + (i % 3) * 20;
      const x = Math.cos(angle) * r, y = Math.sin(angle) * r;
      const size = 4 + (i % 3) * 2;
      const color = i % 2 ? "var(--nya-accent-1)" : "var(--nya-accent-2)";
      html += '<div class="nya-orb-particle" style="left:calc(50% + ' + x + 'px);top:calc(50% + ' + y + 'px);width:' + size + "px;height:" + size + "px;background:" + color + ";box-shadow:0 0 12px " + color + ";animation:floatY " + (4 + i % 3) + "s ease-in-out infinite\"></div>";
    }
    orbWrap.innerHTML = html;
  }

  // ---------- Stats (real numbers, animated on scroll into view) ----------
  const statsGrid = document.getElementById("statsGrid");
  if (statsGrid && typeof LAWS_DB !== "undefined") {
    const targets = [LAWS_DB.categories.length, 24, 0, 0];
    const stats = [
      { label: "Practice Areas", suffix: "" },
      { label: "AI Availability", suffix: "/7" },
      { label: "Consultation Fee", prefix: "₹" },
      { label: "Human Gatekeepers", suffix: "" }
    ];
    statsGrid.innerHTML = stats.map(function (s, i) {
      return '<div class="nya-stat-card"><div class="nya-stat-num" data-target="' + targets[i] + '" data-prefix="' + (s.prefix || "") + '" data-suffix="' + (s.suffix || "") + '" id="statNum' + i + '">' + (s.prefix || "") + "0" + (s.suffix || "") + '</div><div class="nya-stat-lbl">' + s.label + "</div></div>";
    }).join("");

    let started = false;
    function animateCounters() {
      const els = statsGrid.querySelectorAll(".nya-stat-num");
      let frame = 0;
      const steps = 30;
      const iv = setInterval(function () {
        frame++;
        const t = Math.min(1, frame / steps);
        els.forEach(function (el) {
          const target = Number(el.dataset.target);
          el.textContent = el.dataset.prefix + Math.round(target * t) + el.dataset.suffix;
        });
        if (t >= 1) clearInterval(iv);
      }, 40);
    }
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !started) { started = true; animateCounters(); }
      }, { threshold: 0.3 });
      io.observe(statsGrid);
    } else {
      animateCounters();
    }
  }

  // ---------- Practice area chips ----------
  const chipCloud = document.getElementById("practiceChips");
  if (chipCloud && typeof LAWS_DB !== "undefined") {
    chipCloud.innerHTML = LAWS_DB.categories.map(function (c) {
      return '<a class="nya-chip" href="laws/' + c.id + '.html">' + c.icon + " " + escapeHtml(c.name) + "</a>";
    }).join("");
  }

  // ---------- Features (real, linking to real pages) ----------
  const featureGrid = document.getElementById("featureGrid");
  if (featureGrid) {
    const features = [
      { icon: "💬", title: "AI Legal Chat", desc: "Ask a question in plain language, get a cited answer from current Indian statutes — demo mode locally, or a live LLM if you connect a backend.", href: "chat.html" },
      { icon: "📄", title: "Document Intelligence", desc: "Upload a contract, NDA, or agreement (even a PDF or photo, via real OCR) — extract dates, payments, obligations, and risky clauses.", href: "documents.html" },
      { icon: "📝", title: "Smart Legal Forms", desc: "8 guided wizards that draft a real legal notice, consumer complaint, FIR guidance, and more from your actual answers.", href: "forms.html" },
      { icon: "💰", title: "Cost Calculator", desc: "Realistic lawyer, court, and government fee ranges for property, company registration, trademark filing, divorce, and more.", href: "costs.html" },
      { icon: "💡", title: "IP Toolkit", desc: "A trademark similarity checker, class finder, and patent/copyright guidance — genuine algorithms, not guesswork.", href: "ip-tools.html" },
      { icon: "🔔", title: "Smart Notifications", desc: "Track court dates, consultation reminders, and compliance deadlines — stored privately in your browser.", href: "notifications.html" }
    ];
    featureGrid.innerHTML = features.map(function (f) {
      return '<a class="nya-feature-card" href="' + f.href + '"><div class="nya-feature-icon">' + f.icon + "</div><h3>" + escapeHtml(f.title) + "</h3><p>" + escapeHtml(f.desc) + "</p></a>";
    }).join("");
  }

  // ---------- Why choose us (honest differentiators) ----------
  const whyGrid = document.getElementById("whyGrid");
  if (whyGrid) {
    const why = [
      { icon: "📚", title: "Cited Sources", desc: "Every answer references the exact Act and Section — not a vague summary." },
      { icon: "🔒", title: "Privacy-First", desc: "Document analysis, forms, and reminders process and store entirely in your browser — nothing uploaded." },
      { icon: "⚡", title: "Instant & Free", desc: "No sign-up, no consultation fee, no waiting — get an answer in seconds, any time." },
      { icon: "🤖", title: "Transparent AI", desc: "An honest status page shows exactly what runs locally vs. what needs a connected AI backend." },
      { icon: "🕐", title: "Always Available", desc: "A static site with no downtime — open it at 2am if that's when you're worrying about it." },
      { icon: "✨", title: "Built Entirely by AI", desc: "This entire platform — every feature, every line of code — was built through an AI coding conversation." }
    ];
    whyGrid.innerHTML = why.map(function (w) {
      return '<div class="nya-why-card"><div class="nya-why-icon" style="background:linear-gradient(135deg,var(--nya-accent-1),var(--nya-accent-2))">' + w.icon + "</div><h3>" + escapeHtml(w.title) + "</h3><p>" + escapeHtml(w.desc) + "</p></div>";
    }).join("");
  }

  // ---------- FAQ ----------
  const faqList = document.getElementById("faqList");
  if (faqList && typeof LAWS_DB !== "undefined") {
    const faqs = [
      { q: "Is NyayaAI a substitute for a lawyer?", a: "No. NyayaAI provides general legal information to help you understand your situation. For representation in court, contract negotiation, or advice specific to your facts, consult a licensed advocate." },
      { q: "Which laws does NyayaAI cover?", a: "All " + LAWS_DB.categories.length + " practice areas listed above — from the Constitution and criminal law (BNS/BNSS/BSA) to cyber, tax, and traffic law — see the full Practice Areas page for the complete list of Acts and provisions." },
      { q: "Is my data kept private?", a: "Nothing you type is sent anywhere unless you explicitly connect a live AI backend. Document analysis, Smart Forms, and Reminders run and store entirely in your browser's local storage — never uploaded." },
      { q: "Can I upload documents for review?", a: "Yes — Document Intelligence accepts pasted text, .txt, .pdf (exact text extraction), and .jpg/.png (real on-device OCR), and flags risky clauses, missing terms, and extracted dates/payments." },
      { q: "Does this cost anything?", a: "No. NyayaAI is entirely free to use, with no sign-up, subscription, or consultation fee." }
    ];
    faqList.innerHTML = faqs.map(function (f, i) {
      return '<div class="nya-faq-item" data-idx="' + i + '"><button class="nya-faq-q" type="button">' + escapeHtml(f.q) + '<span class="nya-faq-plus">+</span></button><div class="nya-faq-a"><p>' + escapeHtml(f.a) + "</p></div></div>";
    }).join("");
    faqList.querySelectorAll(".nya-faq-item").forEach(function (item) {
      item.querySelector(".nya-faq-q").addEventListener("click", function () {
        const wasOpen = item.classList.contains("open");
        faqList.querySelectorAll(".nya-faq-item").forEach(function (i) { i.classList.remove("open"); });
        if (!wasOpen) item.classList.add("open");
      });
    });
  }

  // ---------- Live demo chat widget (wired to the real ChatEngine, not a mock) ----------
  const demoLog = document.getElementById("demoLog");
  const demoInput = document.getElementById("demoInput");
  const demoSendBtn = document.getElementById("demoSendBtn");
  const demoPrompts = document.getElementById("demoPrompts");
  const demoStatus = document.getElementById("demoStatus");
  const demoStatusLabel = document.getElementById("demoStatusLabel");

  if (demoLog && demoInput && demoSendBtn && typeof ChatEngine !== "undefined") {
    let demoHistory = [];

    if (demoStatus) {
      demoStatus.textContent = ChatEngine.isLive
        ? "Powered by your connected AI backend."
        : "Demo mode · answers come from the local legal knowledge base (no LLM key configured).";
    }
    if (demoStatusLabel) demoStatusLabel.textContent = "NyayaAI Assistant" + (ChatEngine.isLive ? "" : " · Demo mode");

    function addDemoMessage(role, html) {
      const row = document.createElement("div");
      row.className = "nya-demo-row " + (role === "user" ? "user" : "ai");
      const bubble = document.createElement("div");
      bubble.className = "nya-demo-bubble " + (role === "user" ? "user" : "ai");
      bubble.innerHTML = html;
      row.appendChild(bubble);
      demoLog.appendChild(row);
      demoLog.scrollTop = demoLog.scrollHeight;
      if (role === "ai" && typeof window.speechSynthesis !== "undefined") {
        const speakBtn = document.createElement("button");
        speakBtn.type = "button";
        speakBtn.className = "speak-btn";
        speakBtn.textContent = "🔊";
        speakBtn.setAttribute("aria-label", "Read this answer aloud");
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

    addDemoMessage("ai", "Hi, I'm NyayaAI. Ask me about a contract clause, a BNS section, or describe your situation and I'll point you to the relevant law.");

    function addDemoTyping() {
      const row = document.createElement("div");
      row.className = "nya-demo-row ai";
      row.innerHTML = '<div class="nya-demo-typing"><span></span><span></span><span></span></div>';
      demoLog.appendChild(row);
      demoLog.scrollTop = demoLog.scrollHeight;
      return row;
    }

    async function sendDemoMessage(presetText) {
      const text = (typeof presetText === "string" ? presetText : demoInput.value).trim();
      if (!text) return;
      addDemoMessage("user", ChatEngine.escapeHtml(text));
      demoHistory.push({ role: "user", content: text });
      demoInput.value = "";
      const typingRow = addDemoTyping();
      const replyHtml = await ChatEngine.getReply(text, demoHistory);
      typingRow.remove();
      addDemoMessage("ai", replyHtml);
      demoHistory.push({ role: "assistant", content: text });
    }

    demoSendBtn.addEventListener("click", function () { sendDemoMessage(); });
    demoInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); sendDemoMessage(); }
    });

    if (demoPrompts) {
      const suggested = [
        "What's the difference between IPC and BNS?",
        "My landlord won't return my security deposit",
        "How do I file a consumer complaint?"
      ];
      demoPrompts.innerHTML = suggested.map(function (p) {
        return '<button type="button" class="nya-demo-prompt-btn">' + escapeHtml(p) + "</button>";
      }).join("");
      demoPrompts.querySelectorAll(".nya-demo-prompt-btn").forEach(function (btn) {
        btn.addEventListener("click", function () { sendDemoMessage(btn.textContent); });
      });
    }

    // Mic dictation — same honest caveat as chat.html: real Web Speech API, but
    // Chrome/Edge's implementation isn't purely on-device.
    const demoMicBtn = document.getElementById("demoMicBtn");
    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (demoMicBtn) {
      if (!SpeechRecognitionCtor) {
        demoMicBtn.style.display = "none";
      } else {
        const recognition = new SpeechRecognitionCtor();
        recognition.lang = "en-IN";
        recognition.interimResults = false;
        let listening = false;
        demoMicBtn.addEventListener("click", function () {
          if (listening) { recognition.stop(); return; }
          try { recognition.start(); listening = true; demoMicBtn.classList.add("listening"); } catch (err) { /* already running */ }
        });
        recognition.onresult = function (e) {
          demoInput.value = (demoInput.value ? demoInput.value + " " : "") + e.results[0][0].transcript;
          demoInput.focus();
        };
        recognition.onerror = recognition.onend = function () {
          listening = false;
          demoMicBtn.classList.remove("listening");
        };
      }
    }
  }
})();
