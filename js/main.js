/* ============================================================
   REBYTE — main.js
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

const STAR_COUNT = 130;
const stars = Array.from({ length: STAR_COUNT }, () => ({
  x:  Math.random() * canvas.width,
  y:  Math.random() * canvas.height,
  r:  Math.random() * 1.2 + 0.3,
  dx: (Math.random() - 0.5) * 0.25,
  dy: (Math.random() - 0.5) * 0.25,
  o:  Math.random() * 0.5 + 0.3,
}));

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    s.x += s.dx;
    s.y += s.dy;
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

// ── Mobile nav toggle ───────────────────────────────────────
const navToggle = document.getElementById("navToggle");
const nav       = document.getElementById("nav");

navToggle.addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

// ── Scroll fade-in animations ───────────────────────────────
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

// ── Animated counters ───────────────────────────────────────
function animateCounter(el, target, suffix, duration) {
  duration = duration || 1800;
  suffix   = suffix   || "";
  let start = null;
  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll(".stat-num").forEach(function(num) {
        const match = num.textContent.match(/(\d+)(.*)/);
        if (match) animateCounter(num, parseFloat(match[1]), match[2]);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector(".hero-stats");
if (heroStats) statsObserver.observe(heroStats);

// ── FAQ toggle ──────────────────────────────────────────────
function toggleFaq(btn) {
  const item   = btn.closest(".faq-item");
  const isOpen = item.classList.contains("open");
  document.querySelectorAll(".faq-item.open").forEach(el => el.classList.remove("open"));
  if (!isOpen) item.classList.add("open");
}

// ── Plans data ──────────────────────────────────────────────
const plans = {
  "Básico": {
    desc: "Ideal para equipos personales o uso básico.",
    features: ["Chequeo anual completo", "Soporte remoto en 72 horas", "Descuento en repuestos"]
  },
  "Profesional": {
    desc: "Perfecto para profesionales y negocios en operación continua.",
    features: ["Mantenimiento semestral", "Soporte remoto en 24 horas", "1 visita in situ incluida"]
  },
  "Corporativo": {
    desc: "Pensado para empresas con operaciones críticas.",
    features: ["Soporte ilimitado", "Atención prioritaria 24/7", "Contrato y SLA garantizado"]
  }
};

// ── Open plan modal ─────────────────────────────────────────
function openPlan(planName) {
  const plan = plans[planName];
  document.getElementById("planTitle").innerText = planName;
  document.getElementById("planDescription").innerText = plan.desc;
  document.getElementById("planFeatures").innerHTML = plan.features
    .map(f => `<li>${f}</li>`).join("");
  const msg = encodeURIComponent(`Hola, quiero contratar el plan ${planName} de Rebyte`);
  document.getElementById("planWhatsapp").href = `https://wa.me/573125710763?text=${msg}`;
  document.getElementById("planModal").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closePlan() {
  document.getElementById("planModal").classList.remove("open");
  document.body.style.overflow = "";
}

// ── Confirm modal ───────────────────────────────────────────
function closeConfirm() {
  document.getElementById("confirmModal").classList.remove("open");
  document.body.style.overflow = "";
}

function copiarGuia() {
  const guia = document.getElementById("guiaGenerada").innerText;
  navigator.clipboard.writeText(guia).then(() => {
    const btn = document.querySelector("#confirmModal .cta-btn span");
    const original = btn.innerText;
    btn.innerText = "¡Copiado!";
    setTimeout(() => { btn.innerText = original; }, 2000);
  });
}

// ── Contact form ─────────────────────────────────────────────
const form = document.getElementById("contactForm");
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzrvmO2bQUXWSl6nrnaFrDhIBI06cMwW_UceYq3U0QqjHVqh2IMPzeEzlF4TuCtxEN8mw/exec";

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const submitBtn = form.querySelector(".form-submit span");
  submitBtn.innerText = "Enviando...";

  const data = new FormData(form);

  // Send via no-cors fetch (CORS will block response but data arrives at Sheet)
  // So we generate guia here and append it — Sheet will use it since we removed the fallback
  const guia = "RB-" + Date.now();
  data.append("guia", guia);

  fetch(SCRIPT_URL, { method: "POST", body: data, mode: "no-cors" })
    .then(function() {
      document.getElementById("guiaGenerada").innerText = guia;
      submitBtn.innerText = "Enviar mensaje";
      document.getElementById("confirmModal").classList.add("open");
      document.body.style.overflow = "hidden";
      form.reset();
    })
    .catch(function() {
      document.getElementById("guiaGenerada").innerText = guia;
      submitBtn.innerText = "Enviar mensaje";
      document.getElementById("confirmModal").classList.add("open");
      document.body.style.overflow = "hidden";
      form.reset();
    });
});

// ── Tracking / guide search ──────────────────────────────────
function buscarGuia() {
  const guia      = document.getElementById("guiaInput").value.trim();
  const resultado = document.getElementById("resultadoGuia");
  if (!guia) {
    resultado.innerHTML = `<span style="color:var(--text-3)">⚠ Ingresa un número de guía.</span>`;
    return;
  }
  resultado.innerHTML = `<span style="color:var(--text-3)">Buscando...</span>`;
  const callbackName = "cb_" + Date.now();
  window[callbackName] = function(data) {
    delete window[callbackName];
    if (!data.encontrado) {
      resultado.innerHTML = `<span style="color:var(--text-3)">No se encontró la guía <strong style="color:var(--text)">${guia}</strong>.</span>`;
      return;
    }
    resultado.innerHTML = `
      <div class="result-card">
        <h4>Estado del servicio</h4>
        <p><strong>Guía:</strong> ${guia}</p>
        <p><strong>Estado:</strong> ${data.estado}</p>
        ${data.comentario ? `<p>${data.comentario}</p>` : ""}
        ${data.foto ? `<img src="${convertDriveLink(data.foto)}" alt="Foto">` : ""}
      </div>`;
  };
  const script = document.createElement("script");
  script.src = `https://script.google.com/macros/s/AKfycbzrvmO2bQUXWSl6nrnaFrDhIBI06cMwW_UceYq3U0QqjHVqh2IMPzeEzlF4TuCtxEN8mw/exec?guia=${encodeURIComponent(guia)}&callback=${callbackName}`;
  document.body.appendChild(script);
}

document.getElementById("guiaInput").addEventListener("keydown", e => {
  if (e.key === "Enter") buscarGuia();
});

// ── Utility ─────────────────────────────────────────────────
function convertDriveLink(url) {
  if (!url) return "";
  if (url.includes("drive.google.com")) {
    const match = url.match(/\/d\/([^/]+)/);
    if (match && match[1]) return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return url;
}

// ── Escape key closes modals ─────────────────────────────────
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { closePlan(); closeConfirm(); }
});
