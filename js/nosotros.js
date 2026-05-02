/* ============================================================
   REBYTE — nosotros.js
   ============================================================ */

// ── Stars canvas ────────────────────────────────────────────
const canvas = document.getElementById("stars");
const ctx    = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", resizeCanvas);
}

const stars = Array.from({ length: 100 }, () => ({
  x:  Math.random() * canvas.width,
  y:  Math.random() * canvas.height,
  r:  Math.random() * 1.2 + 0.3,
  dx: (Math.random() - 0.5) * 0.2,
  dy: (Math.random() - 0.5) * 0.2,
  o:  Math.random() * 0.4 + 0.2,
}));

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    s.x += s.dx; s.y += s.dy;
    if (s.x < 0) s.x = canvas.width;
    if (s.x > canvas.width)  s.x = 0;
    if (s.y < 0) s.y = canvas.height;
    if (s.y > canvas.height) s.y = 0;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${s.o})`;
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}
drawStars();

// ── Header scroll ───────────────────────────────────────────
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
}, { passive: true });

// ── Mobile nav ──────────────────────────────────────────────
const navToggle = document.getElementById("navToggle");
const nav       = document.getElementById("nav");
navToggle.addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

// ── Scroll fade-in ───────────────────────────────────────────
const fadeEls = document.querySelectorAll(".fade-in");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = entry.target.parentElement.querySelectorAll(".fade-in");
      let idx = 0;
      siblings.forEach((el, j) => { if (el === entry.target) idx = j; });
      entry.target.style.transitionDelay = `${idx * 0.1}s`;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
fadeEls.forEach(el => observer.observe(el));
