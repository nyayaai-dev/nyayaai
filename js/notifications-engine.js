/**
 * NyayaAI Smart Notifications — local reminders engine.
 * IMPORTANT — what this actually is: there is no server behind this site, so there
 * is no real push-notification service. Reminders are stored in this browser's
 * localStorage only (private to this device/browser), and a real browser
 * Notification only fires while NyayaAI is open in a tab and you've granted
 * permission — this is a local reminders list with an on-page alert, not a
 * background push service. That's stated plainly in the UI too, not hidden here.
 */
const NotificationsEngine = (function () {
  const STORE_KEY = "nyayaai_reminders_v1";
  const USAGE_KEY = "nyayaai_tool_usage_v1";

  function safeGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* storage unavailable — reminders just won't persist */ }
  }

  function loadAll() {
    try {
      const raw = safeGet(STORE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
  function saveAll(list) {
    safeSet(STORE_KEY, JSON.stringify(list));
  }

  function uid() {
    return "r" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function addReminder(fields) {
    const list = loadAll();
    const reminder = {
      id: uid(),
      title: fields.title,
      category: fields.category, // "Court Reminder" | "Consultation Reminder" | "Document Expiry" | "Compliance Deadline"
      date: fields.date, // "YYYY-MM-DD"
      notes: fields.notes || "",
      source: fields.source || "manual",
      createdAt: Date.now(),
      notifiedOn: null
    };
    list.push(reminder);
    saveAll(list);
    return reminder;
  }

  function deleteReminder(id) {
    saveAll(loadAll().filter(function (r) { return r.id !== id; }));
  }

  function todayStr() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function daysUntil(dateStr) {
    const today = new Date(todayStr() + "T00:00:00");
    const target = new Date(dateStr + "T00:00:00");
    return Math.round((target - today) / 86400000);
  }

  function urgencyOf(dateStr) {
    const d = daysUntil(dateStr);
    if (d < 0) return "overdue";
    if (d === 0) return "today";
    if (d <= 7) return "soon";
    return "upcoming";
  }

  function listUpcoming() {
    return loadAll()
      .map(function (r) { return Object.assign({}, r, { daysUntil: daysUntil(r.date), urgency: urgencyOf(r.date) }); })
      .sort(function (a, b) { return a.date.localeCompare(b.date); });
  }

  // ---------- Browser Notification API (works only while this site is open) ----------
  function notificationsSupported() {
    return typeof window !== "undefined" && "Notification" in window;
  }
  function permissionState() {
    return notificationsSupported() ? Notification.permission : "unsupported";
  }
  function requestPermission() {
    if (!notificationsSupported()) return Promise.resolve("unsupported");
    return Notification.requestPermission();
  }

  // Fires a real Notification for anything due today that hasn't already been
  // notified today, and marks it so it doesn't repeat every page load.
  function checkAndNotify() {
    if (!notificationsSupported() || Notification.permission !== "granted") return;
    const today = todayStr();
    const list = loadAll();
    let changed = false;
    list.forEach(function (r) {
      if (r.date === today && r.notifiedOn !== today) {
        try {
          new Notification("NyayaAI reminder: " + r.title, { body: r.category + (r.notes ? " — " + r.notes : "") });
        } catch (e) { /* some browsers restrict Notification construction in certain contexts — fail silently */ }
        r.notifiedOn = today;
        changed = true;
      }
    });
    if (changed) saveAll(list);
  }

  function dueSoonCount() {
    return listUpcoming().filter(function (r) { return r.urgency === "overdue" || r.urgency === "today" || r.urgency === "soon"; }).length;
  }

  // ---------- Compliance deadline "next occurrence" ----------
  function nextOccurrence(dates) {
    const now = new Date(todayStr() + "T00:00:00");
    const thisYear = now.getFullYear();
    const candidates = [];
    [thisYear, thisYear + 1].forEach(function (year) {
      dates.forEach(function (md) {
        const d = new Date(year, md.month - 1, md.day);
        if (d >= now) candidates.push(d);
      });
    });
    candidates.sort(function (a, b) { return a - b; });
    const next = candidates[0];
    return next.getFullYear() + "-" + String(next.getMonth() + 1).padStart(2, "0") + "-" + String(next.getDate()).padStart(2, "0");
  }

  // ---------- Tool-usage tracking (feeds "AI recommendations") ----------
  function recordToolUsage(toolKey, meta) {
    let usage = {};
    try { usage = JSON.parse(safeGet(USAGE_KEY) || "{}"); } catch (e) { usage = {}; }
    usage[toolKey] = Object.assign({ lastUsed: Date.now() }, meta || {});
    safeSet(USAGE_KEY, JSON.stringify(usage));
  }
  function getToolUsage() {
    try { return JSON.parse(safeGet(USAGE_KEY) || "{}"); } catch (e) { return {}; }
  }

  // Recommendations a user has already acted on or dismissed shouldn't keep
  // resurfacing — tracked by a stable key per recommendation, separate from the
  // reminder list itself so dismissing a suggestion doesn't touch real reminders.
  const DISMISSED_KEY = "nyayaai_dismissed_recs_v1";
  function getDismissed() {
    try { return JSON.parse(safeGet(DISMISSED_KEY) || "[]"); } catch (e) { return []; }
  }
  function dismissRecommendation(key) {
    const d = getDismissed();
    if (d.indexOf(key) === -1) { d.push(key); safeSet(DISMISSED_KEY, JSON.stringify(d)); }
  }

  // Rule-based suggestions — not AI-generated text, but genuine logic derived from
  // real reminder state and real tool usage, in the same spirit as the site's other
  // "Smart" features (Smart Forms, Legal Cost Calculator), which are also
  // deterministic rather than model-generated.
  function getRecommendations() {
    const recs = [];
    const upcoming = listUpcoming();
    const usage = getToolUsage();
    const dismissed = getDismissed();

    upcoming.forEach(function (r) {
      const key = "expiry-followup-" + r.id;
      if (dismissed.indexOf(key) !== -1) return;
      if (r.category === "Document Expiry" && (r.urgency === "soon" || r.urgency === "upcoming") && r.daysUntil <= 30) {
        const hasFollowUp = upcoming.some(function (o) { return o.id !== r.id && o.category === "Consultation Reminder" && Math.abs(daysUntil(o.date) - r.daysUntil) <= 14; });
        if (!hasFollowUp) {
          recs.push({
            key: key,
            text: '"' + r.title + '" expires in ' + r.daysUntil + " day(s) — consider a Consultation Reminder now, so you have time to renew or renegotiate before it lapses.",
            action: { category: "Consultation Reminder", title: "Review before " + r.title + " expires", date: r.date }
          });
        }
      }
    });

    if (usage["document-intelligence"] && !upcoming.some(function (r) { return r.source === "document-intelligence"; }) && dismissed.indexOf("try-doc-intel-reminders") === -1) {
      recs.push({ key: "try-doc-intel-reminders", text: "You've used Document Intelligence but haven't saved any reminders from it yet — dates it extracts (lease end, contract renewal, etc.) can be added with one click from the results page.", action: null });
    }
    if (usage["legal-notice"] && !upcoming.some(function (r) { return r.source === "legal-notice"; }) && dismissed.indexOf("try-notice-followup") === -1) {
      recs.push({ key: "try-notice-followup", text: "You generated a legal notice — a reminder to follow up after the response deadline passes is usually worth setting.", action: null });
    }
    if (upcoming.filter(function (r) { return r.category === "Compliance Deadline"; }).length === 0 && dismissed.indexOf("try-compliance") === -1) {
      recs.push({ key: "try-compliance", text: "No compliance deadlines tracked yet — if you run a business or file GST/ITR, the quick-add list below covers the common recurring ones.", action: null });
    }
    return recs.slice(0, 4);
  }

  return {
    addReminder: addReminder,
    deleteReminder: deleteReminder,
    listUpcoming: listUpcoming,
    urgencyOf: urgencyOf,
    daysUntil: daysUntil,
    todayStr: todayStr,
    notificationsSupported: notificationsSupported,
    permissionState: permissionState,
    requestPermission: requestPermission,
    checkAndNotify: checkAndNotify,
    dueSoonCount: dueSoonCount,
    nextOccurrence: nextOccurrence,
    recordToolUsage: recordToolUsage,
    getToolUsage: getToolUsage,
    getRecommendations: getRecommendations,
    dismissRecommendation: dismissRecommendation
  };
})();
