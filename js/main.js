/***********************************
 * MENU DESPLEGABLE - SERVICIOS
 ***********************************/
document.addEventListener("DOMContentLoaded", () => {
  const navItem = document.querySelector(".nav-item");
  const dropdown = document.querySelector(".dropdown");

  if (navItem && dropdown) {
    navItem.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("open");
    });

    document.addEventListener("click", () => {
      dropdown.classList.remove("open");
    });
  }
});

/***********************************
 * FONDO DE ESTRELLAS ANIMADAS
 ***********************************/
const canvas = document.getElementById("stars");
if (canvas) {
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let stars = [];
  const STAR_COUNT = 150;
  const mouse = { x: null, y: null };

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Star {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.radius = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (mouse.x && mouse.y) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          this.x += dx / dist;
          this.y += dy / dist;
        }
      }

      if (this.x < 0 || this.x > canvas.width) this.x = Math.random() * canvas.width;
      if (this.y < 0 || this.y > canvas.height) this.y = Math.random() * canvas.height;
    }
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push(new Star());
    }
  }

  function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
      star.update();
      star.draw();
    });
    requestAnimationFrame(animateStars);
  }

  initStars();
  animateStars();
}
