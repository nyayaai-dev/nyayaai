/**
 * Renders the FAQ accordion on faq.html from js/data/faq-data.js.
 */
(function () {
  const list = document.getElementById("faqList");
  if (!list || typeof FAQS === "undefined") return;

  FAQS.forEach(function (item, i) {
    const el = document.createElement("div");
    el.className = "faq-item";
    el.innerHTML =
      '<button class="faq-q" aria-expanded="false"><span>' + item.q + '</span><span class="plus">+</span></button>' +
      '<div class="faq-a"><p>' + item.a + "</p></div>";
    list.appendChild(el);
    el.querySelector(".faq-q").addEventListener("click", function () {
      el.classList.toggle("open");
      this.setAttribute("aria-expanded", el.classList.contains("open"));
    });
  });

  if (list.children.length) list.children[0].classList.add("open");
})();
