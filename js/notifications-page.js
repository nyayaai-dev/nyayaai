/**
 * Controller for notifications.html — permission UI, add-reminder form,
 * quick-add compliance deadlines, recommendations panel, and the upcoming list.
 */
(function () {
  const upcomingListEl = document.getElementById("upcomingList");
  if (!upcomingListEl) return; // not on notifications.html

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---------- Permission banner ----------
  function renderPermission() {
    const statusEl = document.getElementById("permissionStatus");
    const btn = document.getElementById("enableNotifsBtn");
    if (!NotificationsEngine.notificationsSupported()) {
      statusEl.textContent = "Your browser doesn't support notifications — reminders will still show on this page whenever you visit.";
      btn.style.display = "none";
      return;
    }
    const state = NotificationsEngine.permissionState();
    if (state === "granted") {
      statusEl.textContent = "Enabled — you'll get a browser notification for anything due today, while NyayaAI is open.";
      btn.style.display = "none";
    } else if (state === "denied") {
      statusEl.textContent = "Blocked in your browser settings. You can still track reminders here — just re-enable notifications for this site in your browser settings if you change your mind.";
      btn.style.display = "none";
    } else {
      statusEl.textContent = "Not enabled yet — turn this on to get a browser notification for anything due today, while NyayaAI is open in a tab.";
      btn.style.display = "inline-flex";
    }
  }
  document.getElementById("enableNotifsBtn").addEventListener("click", function () {
    NotificationsEngine.requestPermission().then(renderPermission);
  });

  // ---------- Add reminder ----------
  document.getElementById("addReminderBtn").addEventListener("click", function () {
    const title = document.getElementById("rTitle").value.trim();
    const date = document.getElementById("rDate").value;
    if (!title || !date) { document.getElementById(!title ? "rTitle" : "rDate").focus(); return; }
    NotificationsEngine.addReminder({
      title: title,
      category: document.getElementById("rCategory").value,
      date: date,
      notes: document.getElementById("rNotes").value.trim(),
      source: "manual"
    });
    document.getElementById("rTitle").value = "";
    document.getElementById("rNotes").value = "";
    renderAll();
  });

  // ---------- Quick-add compliance deadlines ----------
  function renderComplianceQuickAdd() {
    const el = document.getElementById("complianceQuickAdd");
    el.innerHTML = COMPLIANCE_DEADLINES.map(function (c) {
      const next = NotificationsEngine.nextOccurrence(c.dates);
      return '<div class="reminder-row"><div><strong>' + escapeHtml(c.name) + "</strong><div class=\"small muted\">" + next + "</div></div>" +
        '<button class="btn btn-ghost btn-sm quick-add-btn" data-id="' + c.id + '" data-date="' + next + '">+ Add</button></div>';
    }).join("");
    el.querySelectorAll(".quick-add-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const c = COMPLIANCE_DEADLINES.find(function (d) { return d.id === btn.dataset.id; });
        NotificationsEngine.addReminder({ title: c.name, category: "Compliance Deadline", date: btn.dataset.date, notes: c.note, source: "compliance-template" });
        renderAll();
      });
    });
  }

  // ---------- Recommendations ----------
  function renderRecommendations() {
    const el = document.getElementById("recommendationsList");
    const recs = NotificationsEngine.getRecommendations();
    if (recs.length === 0) {
      el.innerHTML = '<p class="small muted">Nothing to flag right now — add a few reminders and recommendations will show up here.</p>';
      return;
    }
    el.innerHTML = recs.map(function (r) {
      return '<div class="reminder-row" data-rec-key="' + escapeHtml(r.key) + '"><p class="small" style="margin:0">' + escapeHtml(r.text) + "</p>" +
        '<div style="display:flex;gap:8px;flex-shrink:0">' +
        (r.action ? '<button class="btn btn-ghost btn-sm rec-add-btn">+ Add</button>' : "") +
        '<button class="btn btn-ghost btn-sm rec-dismiss-btn">Dismiss</button></div></div>';
    }).join("");
    el.querySelectorAll(".rec-add-btn").forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        const rec = recs[i];
        NotificationsEngine.addReminder(Object.assign({ source: "ai-recommendation" }, rec.action));
        NotificationsEngine.dismissRecommendation(rec.key);
        renderAll();
      });
    });
    el.querySelectorAll(".rec-dismiss-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const key = btn.closest("[data-rec-key]").dataset.recKey;
        NotificationsEngine.dismissRecommendation(key);
        renderAll();
      });
    });
  }

  // ---------- Upcoming list ----------
  const URGENCY_LABEL = { overdue: "Overdue", today: "Today", soon: "This week", upcoming: "Later" };
  function renderUpcoming() {
    const items = NotificationsEngine.listUpcoming();
    if (items.length === 0) {
      upcomingListEl.innerHTML = '<p class="muted">No reminders yet — add one above, or quick-add a compliance deadline.</p>';
      return;
    }
    const groups = { overdue: [], today: [], soon: [], upcoming: [] };
    items.forEach(function (r) { groups[r.urgency].push(r); });

    let html = "";
    ["overdue", "today", "soon", "upcoming"].forEach(function (key) {
      if (groups[key].length === 0) return;
      html += '<h4 style="font-size:.78rem;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-400);margin:20px 0 10px">' + URGENCY_LABEL[key] + "</h4>";
      groups[key].forEach(function (r) {
        html += '<div class="reminder-row urgency-' + r.urgency + '">' +
          '<div><span class="pill">' + escapeHtml(r.category) + "</span> <strong>" + escapeHtml(r.title) + "</strong>" +
          '<div class="small muted">' + r.date + (r.notes ? " — " + escapeHtml(r.notes) : "") + "</div></div>" +
          '<button class="btn btn-ghost btn-sm reminder-delete-btn" data-id="' + r.id + '">Delete</button>' +
          "</div>";
      });
    });
    upcomingListEl.innerHTML = html;
    upcomingListEl.querySelectorAll(".reminder-delete-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        NotificationsEngine.deleteReminder(btn.dataset.id);
        renderAll();
      });
    });
  }

  function renderAll() {
    renderPermission();
    renderComplianceQuickAdd();
    renderRecommendations();
    renderUpcoming();
  }

  renderAll();
  NotificationsEngine.checkAndNotify();
})();
