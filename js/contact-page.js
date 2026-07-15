/**
 * Builds a mailto: link from the contact form on contact.html.
 */
(function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const reason = document.getElementById("cf-reason").value;
    const name = document.getElementById("cf-name").value || "(no name given)";
    const email = document.getElementById("cf-email").value;
    const message = document.getElementById("cf-message").value;
    const subject = encodeURIComponent("NyayaAI — " + reason);
    const body = encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message);
    window.location.href = "mailto:hello@nyayaai.example?subject=" + subject + "&body=" + body;
  });
})();
