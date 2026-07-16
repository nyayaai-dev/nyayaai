// Shared behavior across all pages: nav, injected links, search, and the entry disclaimer.
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const inLawsDir = window.location.pathname.indexOf("/laws/") !== -1;
    const p = function (rootRelativePath) { return inLawsDir ? "../" + rootRelativePath : rootRelativePath; };

    // Each step runs independently — if one throws (e.g. localStorage blocked under a
    // locked-down file:// context), it shouldn't take the rest of the page's behavior with it.
    [setupMobileNav, injectNavLinks, injectFooterLinks, highlightActiveNav, setFooterYear, injectSearch, injectNotificationBell, injectConsentModal]
      .forEach(function (fn) {
        try { fn(); } catch (err) { console.error("[NyayaAI]", fn.name, "failed:", err); }
      });

    function setupMobileNav() {
      const toggle = document.querySelector(".navtoggle");
      const links = document.querySelector(".navlinks");
      if (toggle && links) {
        toggle.addEventListener("click", function () { links.classList.toggle("open"); });
      }
    }

    function setFooterYear() {
      const y = document.querySelector("[data-year]");
      if (y) y.textContent = new Date().getFullYear();
    }

    function highlightActiveNav() {
      const path = window.location.pathname.split("/").pop() || "index.html";
      document.querySelectorAll(".navlinks a[data-nav]").forEach(function (a) {
        if (a.getAttribute("data-nav") === path) a.classList.add("active");
      });
    }

    // Documents/Forms/Insights aren't hand-written into every page's nav markup —
    // inject them once here so every page (existing or future) picks them up
    // automatically without per-file edits. Each is inserted right before an
    // "anchor" link already on the page, so ordering stays consistent everywhere.
    function injectNavLinks() {
      const nav = document.querySelector(".navlinks");
      if (!nav) return;

      const inserts = [
        { navKey: "documents.html", text: "Documents", beforeKey: "laws.html" },
        { navKey: "forms.html", text: "Forms", beforeKey: "laws.html" },
        { navKey: "costs.html", text: "Costs", beforeKey: "laws.html" },
        { navKey: "notifications.html", text: "Reminders", beforeKey: "laws.html" },
        { navKey: "insights.html", text: "Insights", beforeKey: "about.html" }
      ];

      inserts.forEach(function (item) {
        if (nav.querySelector('[data-nav="' + item.navKey + '"]')) return;
        const anchor = Array.from(nav.querySelectorAll("a")).find(function (a) {
          return new RegExp("(^|/)" + item.beforeKey.replace(".", "\\.") + "$").test(a.getAttribute("href") || "");
        });
        const link = document.createElement("a");
        link.href = p(item.navKey);
        link.setAttribute("data-nav", item.navKey);
        link.textContent = item.text;
        if (anchor) nav.insertBefore(link, anchor);
        else nav.appendChild(link);
      });
    }

    // Same idea for Documents/Forms/Insights/FAQ/Contact — appended to whatever
    // footer structure the page has, instead of requiring every page to hand-author
    // the links. Each link is checked independently so adding a new one later
    // doesn't get skipped just because older links are already present.
    function injectFooterLinks() {
      const platformList = document.querySelector('.footer-grid a[href$="about.html"]');
      if (platformList) {
        const ul = platformList.closest("ul");
        if (ul) {
          const wanted = [
            ["documents.html", "Document Intelligence"],
            ["forms.html", "Smart Legal Forms"],
            ["costs.html", "Cost Calculator"],
            ["notifications.html", "Smart Notifications"],
            ["insights.html", "Insights &amp; Guides"],
            ["faq.html", "FAQ"],
            ["contact.html", "Contact"]
          ];
          wanted.forEach(function (pair) {
            if (!ul.querySelector('a[href$="' + pair[0] + '"]')) {
              ul.insertAdjacentHTML("beforeend", '<li><a href="' + p(pair[0]) + '">' + pair[1] + "</a></li>");
            }
          });
        }
        return;
      }
      const bottom = document.querySelector(".footer-bottom");
      if (bottom) {
        const disclaimerSpan = Array.from(bottom.querySelectorAll("span")).find(function (s) {
          return s.querySelector('a[href$="disclaimer.html"]');
        });
        if (disclaimerSpan) {
          const wanted = [["documents.html", "Documents"], ["forms.html", "Forms"], ["costs.html", "Costs"], ["notifications.html", "Reminders"], ["faq.html", "FAQ"], ["contact.html", "Contact"]];
          wanted.forEach(function (pair) {
            if (!bottom.querySelector('a[href$="' + pair[0] + '"]')) {
              disclaimerSpan.insertAdjacentHTML("beforeend", ' · <a href="' + p(pair[0]) + '">' + pair[1] + "</a>");
            }
          });
        }
      }
    }

    // ---------- Site search ----------
    function injectSearch() {
      if (typeof LAWS_DB === "undefined") return;
      const navCta = document.querySelector(".nav-cta");
      if (!navCta || navCta.querySelector(".search-trigger")) return;

      const trigger = document.createElement("button");
      trigger.className = "search-trigger";
      trigger.type = "button";
      trigger.innerHTML = '🔍 <span class="search-label">Search</span> <span class="kbd">/</span>';
      navCta.insertBefore(trigger, navCta.firstChild);

      let overlay = null;

      function buildIndex() {
        const items = [];
        LAWS_DB.categories.forEach(function (cat) {
          items.push({ type: "Practice Area", title: cat.name, sub: cat.tagline, href: p("laws/" + cat.id + ".html") });
          cat.sections.forEach(function (s) {
            items.push({ type: "Provision", title: s.ref + " — " + s.title, sub: cat.name, href: p("laws/" + cat.id + ".html") + "#" + s.id });
          });
        });
        if (typeof NEWS_DB !== "undefined") {
          NEWS_DB.forEach(function (n) {
            items.push({ type: "News", title: n.title, sub: n.source, href: p("news.html") + "#" + n.id });
          });
        }
        if (typeof INSIGHTS_DB !== "undefined") {
          INSIGHTS_DB.forEach(function (g) {
            items.push({ type: "Guide", title: g.title, sub: g.dek.slice(0, 70) + "…", href: p("insights.html") + "#" + g.id });
          });
        }
        items.push({ type: "Tool", title: "AI Document Intelligence", sub: "Analyze contracts, NDAs, rental agreements & more", href: p("documents.html") });
        if (typeof DOCUMENT_TYPES !== "undefined") {
          DOCUMENT_TYPES.forEach(function (dt) {
            items.push({ type: "Tool", title: "Analyze a " + dt.name, sub: "Dates, payments, risky clauses, missing clauses, comparison", href: p("documents.html") });
          });
        }
        if (typeof FORMS_DATA !== "undefined") {
          FORMS_DATA.forEach(function (f) {
            items.push({ type: "Form", title: f.name + " (Smart Form)", sub: f.tagline, href: p("forms.html") });
          });
        }
        if (typeof COSTS_DATA !== "undefined") {
          COSTS_DATA.forEach(function (c) {
            items.push({ type: "Cost estimate", title: c.name + " — cost estimate", sub: c.tagline, href: p("costs.html") });
          });
        }
        items.push({ type: "Tool", title: "Smart Notifications — Reminders", sub: "Court dates, consultation reminders, document expiry, compliance deadlines", href: p("notifications.html") });
        return items;
      }
      const INDEX = buildIndex();

      function escapeHtml(str) {
        return str.replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
      }

      function openSearch() {
        if (overlay) return;
        overlay = document.createElement("div");
        overlay.className = "nyaya-overlay";
        overlay.innerHTML =
          '<div class="nyaya-modal search-modal">' +
          '<div class="search-input-row"><span>🔍</span><input type="text" placeholder="Search practice areas, provisions, news, guides…" id="siteSearchInput"><button class="search-close" type="button" aria-label="Close">✕</button></div>' +
          '<div class="search-results" id="siteSearchResults"></div>' +
          "</div>";
        document.body.appendChild(overlay);
        const input = overlay.querySelector("#siteSearchInput");
        const results = overlay.querySelector("#siteSearchResults");

        function render(query) {
          const q = query.trim().toLowerCase();
          if (q.length < 2) {
            results.innerHTML = '<div class="search-empty">Type at least 2 characters — or <a href="' + p("chat.html") + '">skip straight to AI Consultation →</a></div>';
            return;
          }
          const matches = INDEX.filter(function (item) {
            return item.title.toLowerCase().indexOf(q) !== -1 || (item.sub && item.sub.toLowerCase().indexOf(q) !== -1);
          }).slice(0, 10);

          if (matches.length === 0) {
            results.innerHTML = '<div class="search-empty">No matches in the knowledge base yet.<br><a href="' + p("chat.html") + "?q=" + encodeURIComponent(query) + '">Ask NyayaAI directly about "' + escapeHtml(query) + '" →</a></div>';
            return;
          }
          results.innerHTML = matches.map(function (item) {
            return '<a class="search-result" href="' + item.href + '"><span class="srtype">' + item.type + '</span><span class="srtext"><strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(item.sub || "") + "</span></span></a>";
          }).join("");
        }

        render("");
        input.addEventListener("input", function () { render(input.value); });
        input.focus();

        function close() { if (overlay) { overlay.remove(); overlay = null; } }
        overlay.querySelector(".search-close").addEventListener("click", close);
        overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
        document.addEventListener("keydown", function escHandler(e) {
          if (e.key === "Escape") { close(); document.removeEventListener("keydown", escHandler); }
        });
      }

      trigger.addEventListener("click", openSearch);
      document.addEventListener("keydown", function (e) {
        if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
          e.preventDefault();
          openSearch();
        }
      });
    }

    // Bell icon showing a live count of overdue/due-soon reminders (js/notifications-engine.js).
    // Also fires a real browser Notification for anything due today, on every page — not just
    // notifications.html — since that only works while some NyayaAI tab happens to be open anyway.
    function injectNotificationBell() {
      if (typeof NotificationsEngine === "undefined") return;
      const navCta = document.querySelector(".nav-cta");
      if (!navCta || navCta.querySelector(".notif-bell")) return;

      NotificationsEngine.checkAndNotify();

      const count = NotificationsEngine.dueSoonCount();
      const bell = document.createElement("a");
      bell.className = "notif-bell";
      bell.href = p("notifications.html");
      bell.setAttribute("aria-label", "Reminders");
      bell.innerHTML = "🔔" + (count > 0 ? '<span class="notif-badge">' + count + "</span>" : "");
      navCta.insertBefore(bell, navCta.firstChild);
    }

    // Wrapped because some browsers throw when localStorage is accessed under a restricted
    // file:// origin, or with storage disabled entirely — this should never be fatal.
    function safeStorage(action, key, value) {
      try {
        if (action === "get") return window.localStorage.getItem(key);
        window.localStorage.setItem(key, value);
      } catch (err) { return null; }
    }

    // ---------- Entry disclaimer (standard convention on Indian legal/advocate websites) ----------
    function injectConsentModal() {
      const KEY = "nyayaai_consent_seen_v1";
      if (safeStorage("get", KEY)) return;

      const overlay = document.createElement("div");
      overlay.className = "nyaya-overlay center-modal";
      overlay.innerHTML =
        '<div class="nyaya-modal consent-modal">' +
        "<h3>Before you continue</h3>" +
        "<p>NyayaAI is an AI-operated legal information platform, not a law firm — nothing on this site is an advertisement or solicitation of legal work. You're accessing this voluntarily, for general information, and no advocate-client relationship is created by using it.</p>" +
        '<div class="actions"><button class="btn btn-primary" id="consentAgree">I understand — continue</button><a href="' + p("disclaimer.html") + '" class="small" style="color:var(--ink-400);text-decoration:underline">Read the full disclaimer</a></div>' +
        "</div>";
      document.body.appendChild(overlay);

      function dismiss() {
        safeStorage("set", KEY, "1");
        overlay.remove();
      }
      overlay.querySelector("#consentAgree").addEventListener("click", dismiss);
      overlay.addEventListener("click", function (e) { if (e.target === overlay) dismiss(); });
      document.addEventListener("keydown", function escHandler(e) {
        if (e.key === "Escape") { dismiss(); document.removeEventListener("keydown", escHandler); }
      });
    }
  });
})();
