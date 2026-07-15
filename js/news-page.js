/**
 * Renders and filters the news grid on news.html.
 */
(function () {
  const grid = document.getElementById("newsGrid");
  const filterRow = document.getElementById("filterRow");
  if (!grid || !filterRow) return;

  const iconMap = { constitution: "gold", criminal: "red", civil: "blue", corporate: "gold", family: "green", property: "blue", labour: "gold", tax: "green", cyber: "blue", consumer: "green" };

  function render(filter) {
    grid.innerHTML = "";
    const items = filter ? NEWS_DB.filter(function (n) { return n.lawArea === filter; }) : NEWS_DB;
    items.slice().sort(function (a, b) { return new Date(b.date) - new Date(a.date); }).forEach(function (n) {
      const cat = LAWS_DB.categories.find(function (c) { return c.id === n.lawArea; });
      grid.innerHTML += '<div class="card news-card" id="' + n.id + '">' +
        '<span class="pill ' + (iconMap[n.lawArea] || "gold") + '">' + n.tag + "</span> " +
        (cat ? '<span class="pill">' + cat.icon + " " + cat.name + "</span>" : "") +
        '<div class="date" style="margin-top:10px">' + new Date(n.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) + "</div>" +
        "<h3>" + n.title + "</h3><p>" + n.summary + "</p>" +
        '<div class="src"><span>' + n.source + '</span><a href="' + n.url + '" target="_blank" rel="noopener">Read source →</a></div>' +
        "</div>";
    });
  }

  filterRow.innerHTML = '<span class="area-chip active" data-filter="">All</span>';
  LAWS_DB.categories.forEach(function (c) {
    filterRow.innerHTML += '<span class="area-chip" data-filter="' + c.id + '">' + c.icon + " " + c.name + "</span>";
  });
  filterRow.querySelectorAll(".area-chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      filterRow.querySelectorAll(".area-chip").forEach(function (c) { c.classList.remove("active"); });
      chip.classList.add("active");
      render(chip.dataset.filter);
    });
  });

  render("");
})();
