// ===== Sidebar Active State =====
const links = document.querySelectorAll(".sidebar nav ul li a");

links.forEach(link => {
  link.addEventListener("click", () => {
    links.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});

// ===== Logout Simulation =====
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  alert("Sesión cerrada con éxito.");
  window.location.href = "index.html"; 
});

// ===== Example Dynamic KPI Update =====
function updateDashboard() {
  document.getElementById("activeCases").innerText = "34";
  document.getElementById("completedCases").innerText = "82";
  document.getElementById("pendingQuotes").innerText = "12";
}

updateDashboard();

// ===== Chart.js Configuration =====
const ctx = document.getElementById("mainChart");

if (ctx) {
  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
      datasets: [{
        label: "Servicios completados",
        data: [12, 19, 15, 22, 30, 25, 18],
        borderWidth: 3,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}
