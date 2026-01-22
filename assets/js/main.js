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

  const canvas = document.getElementById("stars");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  let stars = [];
  for (let i = 0; i < 150; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.x += s.dx;
      s.y += s.dy;
      if (s.x < 0 || s.x > canvas.width) s.x = Math.random() * canvas.width;
      if (s.y < 0 || s.y > canvas.height) s.y = Math.random() * canvas.height;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
});
