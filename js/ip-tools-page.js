/**
 * Controller for ip-tools.html — wires the tabs, the trademark similarity checker, the
 * trademark class finder, the patentability quick-check, and the renewal-reminder cross-link
 * to js/ip-tools-engine.js and js/notifications-engine.js.
 */
(function () {
  const tmResults = document.getElementById("tmResults");
  if (!tmResults) return; // not on ip-tools.html

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---------- Tabs ----------
  document.querySelectorAll(".doc-mode-tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      document.querySelectorAll(".doc-mode-tab").forEach(function (t) { t.classList.remove("active"); });
      tab.classList.add("active");
      document.querySelectorAll(".doc-mode-panel").forEach(function (p) { p.classList.remove("active"); });
      document.getElementById("panel-" + tab.dataset.mode).classList.add("active");
    });
  });

  // ---------- Populate class dropdown + full class table ----------
  const tmClassSelect = document.getElementById("tmClass");
  const allClassesBody = document.getElementById("allClassesBody");
  NICE_CLASSES.forEach(function (c) {
    tmClassSelect.insertAdjacentHTML("beforeend", '<option value="' + c.num + '">Class ' + c.num + " — " + escapeHtml(c.title) + "</option>");
    allClassesBody.insertAdjacentHTML("beforeend", "<tr><td>" + c.num + "</td><td>" + escapeHtml(c.title) + "</td></tr>");
  });

  // ---------- Trademark similarity checker ----------
  document.getElementById("tmCheckBtn").addEventListener("click", function () {
    const name = document.getElementById("tmName").value.trim();
    const classNum = document.getElementById("tmClass").value;
    if (!name) {
      tmResults.innerHTML = '<div class="alert"><div class="ico">✏️</div><p>Enter a proposed name first.</p></div>';
      return;
    }
    const matches = IPToolsEngine.checkTrademarkSimilarity(name, classNum);
    let html = '<div class="card" style="padding:28px">';
    if (matches.length === 0) {
      html += '<div class="alert"><div class="ico">✅</div><p>No close matches found against our seeded reference list for "' + escapeHtml(name) + '". That is <strong>not</strong> a clearance — it only means nothing in our small sample looked similar. Run the official IP India public trademark search before you rely on this.</p></div>';
    } else {
      html += "<h3>" + matches.length + ' potential match' + (matches.length === 1 ? "" : "es") + ' for "' + escapeHtml(name) + '"</h3>';
      html += '<div style="overflow-x:auto"><table class="simple"><thead><tr><th>Existing mark</th><th>Category</th><th>Classes</th><th>Similarity</th><th>Risk</th></tr></thead><tbody>';
      matches.forEach(function (m) {
        html += "<tr><td><strong>" + escapeHtml(m.mark) + "</strong>" + (m.phoneticMatch ? '<div class="small muted">Sounds similar</div>' : "") + "</td>" +
          "<td>" + escapeHtml(m.category) + "</td>" +
          "<td>" + m.classes.join(", ") + (m.sameClass ? "" : '<div class="small muted">(different class)</div>') + "</td>" +
          "<td>" + m.score + "%</td>" +
          '<td><span class="risk-badge risk-' + m.risk.toLowerCase() + '">' + m.risk + "</span></td></tr>";
      });
      html += "</tbody></table></div>";
    }
    html += '<div class="alert warn" style="margin-top:20px"><div class="ico">📌</div><p>This checks your name against a small seeded list of well-known marks only — it is not the official IP India Trade Marks Registry search, and a clean result here is not legal clearance. Always run the real search on the official portal, and have a trademark agent confirm before you file or invest in a brand.</p></div>';
    html += '<a href="forms.html" class="btn btn-ghost btn-sm" style="margin-top:16px">File a Trademark via Smart Forms →</a>';
    html += '<a href="costs.html" class="btn btn-ghost btn-sm" style="margin-top:16px;margin-left:10px">Estimate filing costs →</a>';
    html += "</div>";
    tmResults.innerHTML = html;
  });

  // ---------- Trademark class finder ----------
  document.getElementById("classFindBtn").addEventListener("click", function () {
    const desc = document.getElementById("classDescInput").value.trim();
    const classResults = document.getElementById("classResults");
    if (!desc) {
      classResults.innerHTML = '<div class="alert"><div class="ico">✏️</div><p>Describe your product or service first.</p></div>';
      return;
    }
    const matches = IPToolsEngine.findTrademarkClasses(desc);
    let html = '<div class="card" style="padding:28px">';
    if (matches.length === 0) {
      html += '<div class="alert"><div class="ico">🤔</div><p>Could not auto-detect a class from that description — browse the full classification table below, or <a href="chat.html?q=' + encodeURIComponent("Which trademark class covers: " + desc) + '" style="text-decoration:underline;color:var(--gold-400)">ask NyayaAI</a>.</p></div>';
    } else {
      html += "<h3>Likely class" + (matches.length > 1 ? "es" : "") + "</h3>";
      matches.forEach(function (m) {
        html += '<div class="doc-extract-item"><strong>Class ' + m.num + " — " + escapeHtml(m.title) + "</strong></div>";
      });
      html += '<div class="alert" style="margin-top:16px"><div class="ico">📌</div><p>Most businesses need more than one class if they sell goods and offer services (e.g. a clothing brand with an online store may need both Class 25 and Class 35). Confirm the exact class wording on the official IP India classification list before filing.</p></div>';
    }
    html += "</div>";
    classResults.innerHTML = html;
  });

  // ---------- Patentability quick-check ----------
  const patentCheckboxes = document.getElementById("patentCheckboxes");
  IPToolsEngine.PATENT_EXCLUSIONS.forEach(function (ex) {
    patentCheckboxes.insertAdjacentHTML("beforeend",
      '<label class="check-row"><input type="checkbox" data-exclusion="' + ex.id + '"> ' + escapeHtml(ex.label) + "</label>");
  });

  document.getElementById("patentCheckBtn").addEventListener("click", function () {
    const answers = {};
    patentCheckboxes.querySelectorAll("input[type=checkbox]").forEach(function (cb) {
      answers[cb.dataset.exclusion] = cb.checked;
    });
    const result = IPToolsEngine.checkPatentability(answers);
    const out = document.getElementById("patentResult");
    if (result.clear) {
      out.innerHTML = '<div class="alert"><div class="ico">✅</div><p>No obvious §3 exclusion triggered based on what you ticked. This says nothing about novelty, inventive step, or prior art — those need a real patent search and a patent agent\'s assessment.</p></div>';
    } else {
      let html = '<div class="alert warn"><div class="ico">⚠️</div><p>Based on what you ticked, this may run into the following statutory exclusion' + (result.triggered.length > 1 ? "s" : "") + ":</p></div>";
      result.triggered.forEach(function (ex) {
        html += '<div class="doc-flag"><strong>' + ex.cite + "</strong><p>" + escapeHtml(ex.note) + "</p></div>";
      });
      html += '<p class="small muted" style="margin-top:10px">An exclusion applying to part of an invention does not always rule out the whole thing — e.g. software with a genuine technical effect, or a device used in a treatment method, can still be patentable. Get a patent agent\'s opinion before deciding not to file.</p>';
      out.innerHTML = html;
    }
  });

  // ---------- Cross-link: 10-year renewal reminder ----------
  const renewalBtn = document.getElementById("tmRenewalReminderBtn");
  if (renewalBtn && typeof NotificationsEngine !== "undefined") {
    renewalBtn.addEventListener("click", function () {
      const d = new Date();
      d.setFullYear(d.getFullYear() + 10);
      const dateStr = d.toISOString().slice(0, 10);
      NotificationsEngine.addReminder({
        title: "Trademark renewal due (Form TM-R)",
        category: "Compliance Deadline",
        date: dateStr,
        notes: "Registered trademarks must be renewed every 10 years or they can be removed from the register.",
        source: "ip-tools"
      });
      renewalBtn.textContent = "✅ Reminder set for " + dateStr;
      renewalBtn.disabled = true;
    });
  }
})();
