/**
 * Renders a single law-category page. Reads the category id from data-category-id on
 * <body> (set directly in each laws/*.html shell — no inline script needed), with
 * LAWS_DB / NEWS_DB already loaded.
 */
(function () {
  const categoryId = document.body.getAttribute("data-category-id");
  const cat = LAWS_DB.categories.find(function (c) { return c.id === categoryId; });
  if (!cat) return;

  document.title = cat.name + " — NyayaAI";
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", cat.summary);

  const iconMap = { gold: "gold", red: "red", blue: "blue", green: "green" };

  // Breadcrumb + hero
  document.getElementById("crumbName").textContent = cat.name;
  document.getElementById("catIcon").textContent = cat.icon;
  document.getElementById("catName").textContent = cat.name;
  document.getElementById("catTagline").textContent = cat.tagline;
  document.getElementById("catSummary").textContent = cat.summary;
  const statusBox = document.getElementById("catStatus");
  statusBox.innerHTML = '<div class="ico">📌</div><p><strong>Status as of ' +
    new Date(LAWS_DB.lastReviewed).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) +
    ':</strong> ' + cat.status + "</p>";

  // Key acts table
  const actsBody = document.getElementById("actsBody");
  cat.keyActs.forEach(function (a) {
    actsBody.innerHTML += "<tr><td><strong>" + a.name + "</strong></td><td>" + a.year + "</td><td>" + a.note + "</td></tr>";
  });

  // Sections / articles
  const sectionsWrap = document.getElementById("sectionsWrap");
  const tocWrap = document.getElementById("tocWrap");
  cat.sections.forEach(function (s) {
    sectionsWrap.innerHTML +=
      '<div class="article-block" id="' + s.id + '">' +
      '<div class="num">' + s.ref + "</div>" +
      "<h3>" + s.title + "</h3>" +
      "<p>" + s.body + "</p>" +
      '<a href="../chat.html?q=' + encodeURIComponent("Explain " + s.ref + " — " + s.title) + '" class="pill gold">Ask AI about this →</a>' +
      "</div>";
    tocWrap.innerHTML += '<a href="#' + s.id + '">' + s.ref + " — " + s.title + "</a>";
  });

  // Helplines & immediate steps (only rendered for categories that define them, e.g. Cyber Law)
  if (cat.helplines && cat.helplines.length) {
    const statusHeading = document.getElementById("statusHeading");
    let helplineHtml = '<h2 id="helplines">Helplines &amp; Where to Report</h2><div class="grid grid-2" id="helplinesWrap">';
    cat.helplines.forEach(function (h) {
      helplineHtml += '<div class="card helpline-card">' +
        '<div class="helpline-number">' + h.number + "</div>" +
        "<h3>" + h.name + "</h3>" +
        "<p>" + h.note + "</p>" +
        "</div>";
    });
    helplineHtml += "</div>";
    statusHeading.insertAdjacentHTML("beforebegin", helplineHtml);
    tocWrap.innerHTML += '<a href="#helplines">Helplines &amp; Where to Report</a>';
  }

  // Recent updates
  const updatesWrap = document.getElementById("updatesWrap");
  cat.recentUpdates.forEach(function (u) {
    updatesWrap.innerHTML += '<div class="alert" style="margin-bottom:12px"><div class="ico">📰</div><p>' + u + "</p></div>";
  });

  // Related news
  const relatedNews = document.getElementById("relatedNews");
  const related = (typeof NEWS_DB !== "undefined" ? NEWS_DB : []).filter(function (n) { return n.lawArea === cat.id; });
  if (related.length && relatedNews) {
    related.forEach(function (n) {
      relatedNews.innerHTML += '<a class="card news-card" href="../news.html#' + n.id + '">' +
        '<span class="pill gold">' + n.tag + "</span>" +
        '<div class="date" style="margin-top:10px">' + new Date(n.date).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) + "</div>" +
        "<h3>" + n.title + "</h3><p>" + n.summary.slice(0, 130) + "…</p>" +
        "</a>";
    });
  } else if (relatedNews) {
    relatedNews.closest("section").style.display = "none";
  }

  // Other categories strip
  const otherWrap = document.getElementById("otherCats");
  LAWS_DB.categories.filter(function (c) { return c.id !== cat.id; }).forEach(function (c) {
    otherWrap.innerHTML += '<a href="' + c.id + '.html" class="area-chip">' + c.icon + " " + c.name + "</a>";
  });

  // Ask-AI CTA prefilled
  const ctaBtn = document.getElementById("askCta");
  if (ctaBtn) ctaBtn.href = "../chat.html?q=" + encodeURIComponent("I have a question about " + cat.name + " in India");
})();
