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
// Fix for zoom: also listen to visualViewport if available
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

navToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
});
nav.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

// ── Scroll fade-in animations ───────────────────────────────
const fadeEls = document.querySelectorAll(".fade-in");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay based on sibling index
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
function animateCounter(el, target, suffix = "", duration = 1800) {
  const isFloat = String(target).includes(".");
  let start = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = eased * target;
    el.textContent = (isFloat ? value.toFixed(1) : Math.floor(value)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll(".stat-num");
      nums.forEach(num => {
        const text = num.textContent;
        const match = text.match(/([\d.]+)(.*)/);
        if (match) {
          animateCounter(num, parseFloat(match[1]), match[2]);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector(".hero-stats");
if (heroStats) statsObserver.observe(heroStats);

// ── FAQ toggle ──────────────────────────────────────────────
function toggleFaq(btn) {
  const item = btn.closest(".faq-item");
  const isOpen = item.classList.contains("open");

  // Close all
  document.querySelectorAll(".faq-item.open").forEach(el => el.classList.remove("open"));

  // Open clicked if it was closed
  if (!isOpen) item.classList.add("open");
}

// ── Plans data ──────────────────────────────────────────────
const plans = {
  "Básico": {
    desc: "Ideal para equipos personales o uso básico.",
    features: [
      "Chequeo anual completo",
      "Soporte remoto en 72 horas",
      "Descuento en repuestos",
    ]
  },
  "Profesional": {
    desc: "Perfecto para profesionales y negocios en operación continua.",
    features: [
      "Mantenimiento semestral",
      "Soporte remoto en 24 horas",
      "1 visita in situ incluida",
    ]
  },
  "Corporativo": {
    desc: "Pensado para empresas con operaciones críticas.",
    features: [
      "Soporte ilimitado",
      "Atención prioritaria 24/7",
      "Contrato y SLA garantizado",
    ]
  }
};

// ── Open plan modal ─────────────────────────────────────────
function openPlan(planName) {
  const modal = document.getElementById("planModal");
  const plan  = plans[planName];

  document.getElementById("planTitle").innerText = planName;
  document.getElementById("planDescription").innerText = plan.desc;

  const list = document.getElementById("planFeatures");
  list.innerHTML = plan.features.map(f => `<li>${f}</li>`).join("");

  const msg = encodeURIComponent(`Hola, quiero contratar el plan ${planName} de Rebyte`);
  document.getElementById("planWhatsapp").href = `https://wa.me/573125710763?text=${msg}`;

  modal.classList.add("open");
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

form.addEventListener("submit", () => {
  const guia = "RB-" + Date.now();

  let hiddenGuia = form.querySelector('input[name="guia"]');
  if (!hiddenGuia) {
    hiddenGuia = document.createElement("input");
    hiddenGuia.type = "hidden";
    hiddenGuia.name = "guia";
    form.appendChild(hiddenGuia);
  }
  hiddenGuia.value = guia;

  document.getElementById("guiaGenerada").innerText = guia;

  const submitBtn = form.querySelector(".form-submit span");
  submitBtn.innerText = "Enviando...";

  setTimeout(() => {
    submitBtn.innerText = "Enviar mensaje";
    document.getElementById("confirmModal").classList.add("open");
    document.body.style.overflow = "hidden";
    form.reset();
  }, 1200);
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
        ${data.foto ? `<img src="${convertDriveLink(data.foto)}" alt="Foto del servicio">` : ""}
      </div>
    `;
  };

  const script = document.createElement("script");
  script.src = `https://script.google.com/macros/s/AKfycbzrvmO2bQUXWSl6nrnaFrDhIBI06cMwW_UceYq3U0QqjHVqh2IMPzeEzlF4TuCtxEN8mw/exec?guia=${encodeURIComponent(guia)}&callback=${callbackName}`;
  document.body.appendChild(script);
}

document.getElementById("guiaInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") buscarGuia();
});

// ── Utility ─────────────────────────────────────────────────
function convertDriveLink(url) {
  if (!url) return "";
  if (url.includes("drive.google.com")) {
    const match = url.match(/\/d\/([^/]+)/);
    if (match?.[1]) return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return url;
}

// ── Keyboard: close modals with Escape ──────────────────────
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closePlan();
    closeConfirm();
  }
});

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

navToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
});

// Close nav when a link is clicked
nav.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

// ── Plans data ──────────────────────────────────────────────
const plans = {
  "Básico": {
    desc: "Ideal para equipos personales o uso básico.",
    features: [
      "Chequeo anual completo",
      "Soporte remoto en 72 horas",
      "Descuento en repuestos",
    ]
  },
  "Profesional": {
    desc: "Perfecto para profesionales y negocios en operación continua.",
    features: [
      "Mantenimiento semestral",
      "Soporte remoto en 24 horas",
      "1 visita in situ incluida",
    ]
  },
  "Corporativo": {
    desc: "Pensado para empresas con operaciones críticas.",
    features: [
      "Soporte ilimitado",
      "Atención prioritaria 24/7",
      "Contrato y SLA garantizado",
    ]
  }
};

// ── Open plan modal ─────────────────────────────────────────
function openPlan(planName) {
  const modal = document.getElementById("planModal");
  const plan  = plans[planName];

  document.getElementById("planTitle").innerText = planName;
  document.getElementById("planDescription").innerText = plan.desc;

  const list = document.getElementById("planFeatures");
  list.innerHTML = plan.features.map(f => `<li>${f}</li>`).join("");

  const msg = encodeURIComponent(`Hola, quiero contratar el plan ${planName} de Rebyte`);
  document.getElementById("planWhatsapp").href = `https://wa.me/573125710763?text=${msg}`;

  modal.classList.add("open");
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

form.addEventListener("submit", (e) => {
  const guia = "RB-" + Date.now();

  // Attach tracking number to form submission
  let hiddenGuia = form.querySelector('input[name="guia"]');
  if (!hiddenGuia) {
    hiddenGuia = document.createElement("input");
    hiddenGuia.type = "hidden";
    hiddenGuia.name = "guia";
    form.appendChild(hiddenGuia);
  }
  hiddenGuia.value = guia;

  document.getElementById("guiaGenerada").innerText = guia;

  const submitBtn = form.querySelector(".form-submit span");
  submitBtn.innerText = "Enviando...";

  setTimeout(() => {
    submitBtn.innerText = "Enviar mensaje";
    document.getElementById("confirmModal").classList.add("open");
    document.body.style.overflow = "hidden";
    form.reset();
  }, 1200);
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
        ${data.foto ? `<img src="${convertDriveLink(data.foto)}" alt="Foto del servicio">` : ""}
      </div>
    `;
  };

  const script = document.createElement("script");
  script.src = `https://script.google.com/macros/s/AKfycbzrvmO2bQUXWSl6nrnaFrDhIBI06cMwW_UceYq3U0QqjHVqh2IMPzeEzlF4TuCtxEN8mw/exec?guia=${encodeURIComponent(guia)}&callback=${callbackName}`;
  document.body.appendChild(script);
}

// Allow Enter key on search box
document.getElementById("guiaInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") buscarGuia();
});

// ── Utility ─────────────────────────────────────────────────
function convertDriveLink(url) {
  if (!url) return "";
  if (url.includes("drive.google.com")) {
    const match = url.match(/\/d\/([^/]+)/);
    if (match?.[1]) return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return url;
}

// ── Keyboard: close modals with Escape ──────────────────────
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closePlan();
    closeConfirm();
  }
});
