/**
 * Renders insights.html from js/data/insights-data.js + laws-data.js.
 */
(function () {
  if (typeof INSIGHTS_DB === "undefined") return;

  const cardGrid = document.getElementById("insightCards");
  const detailWrap = document.getElementById("insightDetails");
  if (!cardGrid || !detailWrap) return;

  function catFor(lawArea) {
    return LAWS_DB.categories.find(function (c) { return c.id === lawArea; });
  }

  INSIGHTS_DB.forEach(function (guide) {
    const cat = catFor(guide.lawArea);

    cardGrid.innerHTML += '<a class="card" href="#' + guide.id + '">' +
      '<div class="icon">' + guide.icon + '</div>' +
      '<h3>' + guide.title + '</h3>' +
      '<p>' + guide.dek + '</p>' +
      '<div class="meta"><span class="pill">' + guide.steps.length + ' steps</span>' + (cat ? '<span class="pill">' + cat.icon + ' ' + cat.name + '</span>' : '') + '</div>' +
      '</a>';

    let stepsHtml = "";
    guide.steps.forEach(function (s, i) {
      stepsHtml += '<div class="article-block">' +
        '<div class="num">Step ' + (i + 1) + '</div>' +
        '<h3>' + s.h + '</h3>' +
        '<p>' + s.b + '</p>' +
        '</div>';
    });

    detailWrap.innerHTML += '<div class="card" id="' + guide.id + '" style="margin-bottom:26px;padding:32px">' +
      '<div class="badge-row"><span class="pill">' + guide.icon + ' Guide</span>' + (cat ? '<span class="pill">' + cat.name + '</span>' : '') + '</div>' +
      '<h2>' + guide.title + '</h2>' +
      '<p class="lead">' + guide.dek + '</p>' +
      stepsHtml +
      '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:20px">' +
      (cat ? '<a href="laws/' + cat.id + '.html" class="btn btn-ghost btn-sm">Read the full ' + cat.name + ' page →</a>' : '') +
      '<a href="chat.html?q=' + encodeURIComponent("I need help with: " + guide.title) + '" class="btn btn-primary btn-sm">💬 Ask NyayaAI about this →</a>' +
      '</div>' +
      '</div>';
  });
})();
