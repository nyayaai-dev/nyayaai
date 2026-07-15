/**
 * Renders the homepage's practice-area grid, footer links, and news preview from data.
 */
(function () {
  const iconMap = { gold: "gold", red: "red", blue: "blue", green: "green" };
  const statAreas = document.getElementById("statAreas");
  if (statAreas) statAreas.textContent = LAWS_DB.categories.length;

  const grid = document.getElementById("lawGrid");
  LAWS_DB.categories.forEach(function (c) {
    grid.innerHTML += '<a class="card" href="laws/' + c.id + '.html">' +
      '<div class="icon">' + c.icon + "</div>" +
      "<h3>" + c.name + "</h3><p>" + c.tagline + "</p>" +
      '<div class="meta"><span class="pill ' + iconMap[c.color] + '">' + c.keyActs.length + ' key acts</span><span class="pill">' + c.sections.length + " provisions</span></div>" +
      "</a>";
  });

  const footerLinks = document.getElementById("footerLawLinks");
  LAWS_DB.categories.slice(0, 6).forEach(function (c) {
    footerLinks.innerHTML += '<li><a href="laws/' + c.id + '.html">' + c.name + "</a></li>";
  });

  const newsPreview = document.getElementById("newsPreview");
  NEWS_DB.slice(0, 3).forEach(function (n) {
    newsPreview.innerHTML += '<a class="card news-card" href="news.html#' + n.id + '">' +
      '<span class="pill gold">' + n.tag + "</span>" +
      '<div class="date" style="margin-top:10px">' + new Date(n.date).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) + "</div>" +
      "<h3>" + n.title + "</h3><p>" + n.summary.slice(0, 120) + "…</p>" +
      "</a>";
  });
})();
