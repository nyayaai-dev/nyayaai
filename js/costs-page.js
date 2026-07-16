/**
 * Controller for costs.html — renders the matter picker, the inline input form for
 * whichever matter is selected, and the calculated low/average/high cost breakdown
 * from js/costs-engine.js.
 */
(function () {
  const matterCardsEl = document.getElementById("matterCards");
  if (!matterCardsEl) return; // not on costs.html

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  COSTS_DATA.forEach(function (m) {
    matterCardsEl.innerHTML += '<a class="card" href="#" data-matter-id="' + m.id + '">' +
      '<div class="icon">' + m.icon + "</div>" +
      "<h3>" + m.name + "</h3><p>" + m.tagline + "</p>" +
      "</a>";
  });

  let currentMatter = null;

  matterCardsEl.addEventListener("click", function (e) {
    const card = e.target.closest("[data-matter-id]");
    if (!card) return;
    e.preventDefault();
    openCalculator(card.dataset.matterId);
  });

  function openCalculator(matterId) {
    currentMatter = COSTS_DATA.find(function (m) { return m.id === matterId; });
    if (!currentMatter) return;
    document.getElementById("matterPicker").style.display = "none";
    document.getElementById("calcSection").style.display = "block";
    document.getElementById("calcCard").style.display = "block";
    document.getElementById("calcOutput").style.display = "none";
    document.getElementById("calcOutput").innerHTML = "";
    document.getElementById("calcMatterName").textContent = currentMatter.icon + " " + currentMatter.name;

    const inputsEl = document.getElementById("calcInputs");
    if (currentMatter.inputs.length === 0) {
      inputsEl.innerHTML = '<p class="small muted">No inputs needed for this one — just click calculate.</p>';
    } else {
      inputsEl.innerHTML = currentMatter.inputs.map(function (inp) {
        if (inp.type === "select") {
          return '<div class="form-field"><label>' + escapeHtml(inp.label) + '</label><select class="wizard-input" id="calcInput-' + inp.id + '">' +
            inp.options.map(function (o) { return '<option value="' + escapeHtml(o) + '">' + escapeHtml(o) + "</option>"; }).join("") +
            "</select></div>";
        }
        return '<div class="form-field"><label>' + escapeHtml(inp.label) + '</label><input type="' + inp.type + '" class="wizard-input" id="calcInput-' + inp.id + '" placeholder="' + escapeHtml(inp.placeholder || "") + '"></div>';
      }).join("");
    }
    document.getElementById("calcSection").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.getElementById("backToPickerBtn").addEventListener("click", function () {
    document.getElementById("matterPicker").style.display = "block";
    document.getElementById("calcSection").style.display = "none";
    document.getElementById("matterPicker").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.getElementById("calculateBtn").addEventListener("click", function () {
    const answers = {};
    currentMatter.inputs.forEach(function (inp) {
      const el = document.getElementById("calcInput-" + inp.id);
      answers[inp.id] = el ? el.value : "";
    });

    const result = CostsEngine.calculate(currentMatter.id, answers);
    if (!result) return;

    document.getElementById("calcCard").style.display = "none";
    const out = document.getElementById("calcOutput");

    let html = '<div class="card" style="padding:32px">' +
      '<div class="badge-row"><span class="pill gold">Estimate</span></div>' +
      "<h2>" + escapeHtml(currentMatter.name) + "</h2>" +
      '<div style="overflow-x:auto"><table class="simple cost-table"><thead><tr><th>Category</th><th>Low</th><th>Average</th><th>High</th></tr></thead><tbody>';

    result.rows.forEach(function (r) {
      const avg = (r.low + r.high) / 2;
      html += "<tr><td><strong>" + escapeHtml(r.category) + "</strong>" + (r.note ? '<div class="small muted" style="margin-top:4px;max-width:280px">' + escapeHtml(r.note) + "</div>" : "") + "</td>" +
        "<td>" + CostsEngine.formatINR(r.low) + "</td>" +
        "<td>" + CostsEngine.formatINR(avg) + "</td>" +
        "<td>" + CostsEngine.formatINR(r.high) + "</td></tr>";
    });

    html += '</tbody><tfoot><tr class="cost-total-row"><td><strong>Total estimated range</strong></td>' +
      "<td><strong>" + CostsEngine.formatINR(result.totalLow) + "</strong></td>" +
      "<td><strong>" + CostsEngine.formatINR(result.totalAverage) + "</strong></td>" +
      "<td><strong>" + CostsEngine.formatINR(result.totalHigh) + "</strong></td></tr></tfoot></table></div>";

    html += '<div class="alert" style="margin-top:20px"><div class="ico">📌</div><p>These figures are illustrative ranges, not quotes — get a specific estimate from an advocate/professional once you know your exact situation. Government-fee rows marked "fixed" are current official rates; everything else varies by state, city, and complexity.</p></div>';

    if (currentMatter.lawArea) {
      html += '<a href="laws/' + currentMatter.lawArea + '.html" class="btn btn-ghost btn-sm" style="margin-top:16px">Read the related law →</a>';
    }
    html += '<a href="chat.html?q=' + encodeURIComponent("What should I budget for: " + currentMatter.name) + '" class="btn btn-ghost btn-sm" style="margin-top:16px;margin-left:10px">💬 Ask NyayaAI for more help →</a>';

    html += '<div class="center" style="margin-top:24px"><button class="btn btn-ghost" id="recalcBtn">Recalculate</button></div>';
    html += "</div>";

    out.innerHTML = html;
    out.style.display = "block";
    out.scrollIntoView({ behavior: "smooth", block: "start" });

    const recalcBtn = document.getElementById("recalcBtn");
    if (recalcBtn) recalcBtn.addEventListener("click", function () { openCalculator(currentMatter.id); });
  });
})();
