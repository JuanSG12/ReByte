const proxyUrl = "https://rebyte-proxy.re-byte19.workers.dev";
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let stars = [];
const STAR_COUNT = 150;

class Star {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.r = Math.random() * 1.5 + 0.5;
    this.dx = (Math.random() - 0.5) * 0.3;
    this.dy = (Math.random() - 0.5) * 0.3;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }
}

function init() {
  stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push(new Star());
  }
}

function animate() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  stars.forEach(star => {
    star.update();
    star.draw();
  });

  requestAnimationFrame(animate);
}

init();
animate();

// Dropdown
const dropBtn = document.querySelector(".dropbtn");
const dropdown = document.querySelector(".dropdown-content");

dropBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdown.classList.toggle("show");
});

document.addEventListener("click", () => {
  dropdown.classList.remove("show");
});

// PLANES
const plans = {
  "Básico": {
    desc: "Ideal para equipos personales o uso básico.",
    features: [
      "Chequeo anual",
      "Soporte remoto 72h",
      "Descuento en repuestos"
    ]
  },
  "Profesional": {
    desc: "Perfecto para negocios y trabajo continuo.",
    features: [
      "Mantenimiento semestral",
      "Soporte remoto 24h",
      "1 visita in sitio"
    ]
  },
  "Corporativo": {
    desc: "Pensado para empresas y operaciones críticas.",
    features: [
      "Soporte ilimitado",
      "Prioridad 24/7",
      "Contrato y SLA"
    ]
  }
};

function openPlan(planName) {
  const modal = document.getElementById("planModal");

  document.getElementById("planTitle").innerText = planName;
  document.getElementById("planDescription").innerText = plans[planName].desc;

  const list = document.getElementById("planFeatures");
  list.innerHTML = "";
  plans[planName].features.forEach(item => {
    const li = document.createElement("li");
    li.textContent = "✔ " + item;
    list.appendChild(li);
  });

  const whatsappMsg = `Hola, quiero contratar el plan ${planName} de ReByte`;
  document.getElementById("planWhatsapp").href =
    `https://wa.me/573125710763?text=${encodeURIComponent(whatsappMsg)}`;

  modal.style.display = "flex";
}

function closePlan() {
  document.getElementById("planModal").style.display = "none";
}

// ===== FORMULARIO (CORREGIDO CON GUIA REAL) =====
const form = document.getElementById("contactForm");

form.addEventListener("submit", () => {
  const guia = "RB-" + Date.now();

  // 👉 enviar guía al Apps Script
  const inputGuia = document.createElement("input");
  inputGuia.type = "hidden";
  inputGuia.name = "guia";
  inputGuia.value = guia;

  form.appendChild(inputGuia);

  // 👉 mostrar guía correcta al usuario
  document.getElementById("guiaGenerada").innerText = guia;

  setTimeout(() => {
    document.getElementById("confirmModal").style.display = "flex";
  }, 1200);
});

// ===== BUSCADOR =====
function buscarGuia() {
  const guia = document.getElementById("guiaInput").value.trim();
  const resultado = document.getElementById("resultadoGuia");

  if (!guia) {
    resultado.innerHTML = "⚠️ Ingresa una guía.";
    return;
  }

  resultado.innerHTML = "🔎 Buscando...";

  const callbackName = "respuestaGuia_" + Date.now();

  window[callbackName] = function(data) {
    delete window[callbackName];

    if (!data.encontrado) {
      resultado.innerHTML = "❌ Guía no encontrada.";
      return;
    }

    resultado.innerHTML = `
      <div class="plan-card destacado" style="margin:auto;max-width:320px;">
        <h3>🔧 Estado del mantenimiento</h3>
        <p><strong>Guía:</strong> ${guia}</p>
        <p><strong>Estado:</strong> ${data.estado}</p>
        <p>${data.comentario || ""}</p>

        ${
          data.foto
            ? `<img src="${convertDriveLink(data.foto)}" style="width:100%;border-radius:14px;margin:12px 0;">`
            : ""
        }

        <button class="btn" onclick="location.reload()">Cerrar</button>
      </div>
    `;
  };

  const script = document.createElement("script");

  script.src = `https://script.google.com/macros/s/AKfycbzrvmO2bQUXWSl6nrnaFrDhIBI06cMwW_UceYq3U0QqjHVqh2IMPzeEzlF4TuCtxEN8mw/exec?guia=${encodeURIComponent(guia)}&callback=${callbackName}`;

  document.body.appendChild(script);
}

// ===== UTIL =====
function convertDriveLink(url) {
  if (!url) return "";

  if (url.includes("drive.google.com")) {
    const match = url.match(/\/d\/([^\/]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
  }

  return url;
}