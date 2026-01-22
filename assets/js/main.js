// ===== NAV TOGGLE =====
const btnToggle = document.getElementById('btnToggle');
const html = document.documentElement;
btnToggle && btnToggle.addEventListener('click', () => {
  html.classList.toggle('nav-open');
});

// ===== URGENT BANNER =====
const closeUrgent = document.getElementById('closeUrgent');
const urgentBanner = document.getElementById('urgentBanner');
closeUrgent && closeUrgent.addEventListener('click', () => {
  urgentBanner && (urgentBanner.style.display = 'none');
});

// ===== SCROLL REVEAL (simple) =====
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

// ===== CONTACT FORM (SIMULATED) =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const result = document.getElementById('formResult');
    result.textContent = 'Enviando...';
    result.style.color = '#c59d4a';
    // fake send
    setTimeout(() => {
      result.textContent = 'Mensaje enviado. Nos contactamos pronto.';
      contactForm.reset();
      setTimeout(()=> result.textContent = '', 5000);
    }, 900);
  });
}

// ===== DASHBOARD SIMPLE HELP (if on dashboard page) =====
if (window.location.pathname.endsWith('dashboard.html')) {
  try {
    const createBtn = document.getElementById('createTicket');
    const ticketList = document.getElementById('ticketList');
    createBtn && createBtn.addEventListener('click', () => {
      const title = document.getElementById('ticketTitle').value || 'Nuevo ticket';
      const desc = document.getElementById('ticketDesc').value || 'Sin descripción';
      const li = document.createElement('li');
      li.className = 'ticket';
      li.innerHTML = `<strong>${title}</strong><p>${desc}</p><span class="status">Abierto</span>`;
      ticketList.prepend(li);
      document.getElementById('ticketTitle').value = '';
      document.getElementById('ticketDesc').value = '';
    });
  } catch (err) {
    // ignore on index
  }
}
// Animación suave al cargar
document.addEventListener("DOMContentLoaded", () => {
    document.body.style.opacity = 1;
});

