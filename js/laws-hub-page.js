/**
 * Renders the practice-area grid on laws.html.
 */
(function () {
  const iconMap = { gold: "gold", red: "red", blue: "blue", green: "green" };
  const grid = document.getElementById("lawGrid");
  if (!grid) return;
  LAWS_DB.categories.forEach(function (c) {
    grid.innerHTML += '<a class="card" href="laws/' + c.id + '.html">' +
      '<div class="icon">' + c.icon + "</div>" +
      "<h3>" + c.name + "</h3><p>" + c.summary + "</p>" +
      '<div class="meta"><span class="pill ' + iconMap[c.color] + '">' + c.keyActs.length + ' key acts</span><span class="pill">' + c.sections.length + ' provisions</span><span class="pill">' + c.recentUpdates.length + " 2026 updates</span></div>" +
      "</a>";
  });
})();
