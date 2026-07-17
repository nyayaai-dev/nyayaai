/**
 * Small shared UI polish, used across pages: toast notifications and a confetti burst.
 * No dependencies, no network calls — everything renders and animates locally.
 */
const NyayaFX = (function () {
  function ensureToastContainer() {
    let c = document.getElementById("toastContainer");
    if (!c) {
      c = document.createElement("div");
      c.id = "toastContainer";
      c.className = "toast-container";
      document.body.appendChild(c);
    }
    return c;
  }

  function toast(message, opts) {
    opts = opts || {};
    const container = ensureToastContainer();
    const el = document.createElement("div");
    el.className = "toast" + (opts.type ? " toast-" + opts.type : "");
    el.innerHTML = "<span>" + message + '</span><button type="button" class="toast-close" aria-label="Dismiss">✕</button>';
    container.appendChild(el);
    requestAnimationFrame(function () { el.classList.add("show"); });

    let dismissed = false;
    function dismiss() {
      if (dismissed) return;
      dismissed = true;
      clearTimeout(timer);
      el.classList.remove("show");
      setTimeout(function () { el.remove(); }, 250);
    }
    const timer = setTimeout(dismiss, opts.duration || 3500);
    el.querySelector(".toast-close").addEventListener("click", dismiss);
    return dismiss;
  }

  // Grayscale, on-brand burst — no external library. Skips entirely under
  // prefers-reduced-motion, matching the same accessibility check used for the page loader.
  function confettiBurst() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = document.createElement("canvas");
    canvas.className = "confetti-canvas";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const colors = ["#0a0a0a", "#474747", "#8f8f8f", "#dcdcdc"];
    const particles = [];
    const count = 70;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 240,
        y: canvas.height * 0.32,
        vx: (Math.random() - 0.5) * 13,
        vy: -Math.random() * 13 - 4,
        size: Math.random() * 7 + 4,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 16,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: Math.random() > 0.5 ? "rect" : "circle"
      });
    }
    let frame = 0;
    const gravity = 0.35;
    const maxFrames = 150;

    function tick() {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p) {
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - frame / maxFrames);
        if (p.shape === "rect") ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        else { ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
      });
      if (frame < maxFrames) requestAnimationFrame(tick);
      else canvas.remove();
    }
    requestAnimationFrame(tick);
  }

  return { toast: toast, confettiBurst: confettiBurst };
})();
