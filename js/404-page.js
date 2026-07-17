/** Controller for 404.html — the "Search the site" button opens the same overlay the nav search does. */
(function () {
  const btn = document.getElementById("notFoundSearchBtn");
  if (!btn) return;
  btn.addEventListener("click", function () {
    const trigger = document.querySelector(".search-trigger");
    if (trigger) trigger.click();
  });
})();
