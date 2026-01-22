// DROPDOWN CLICK
document.querySelector(".dropbtn").addEventListener("click", () => {
    document.querySelector(".dropdown").classList.toggle("open");
});

// ESTRELLAS
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let stars = [];
const STAR_COUNT = 150;
let mouse = { x: null, y: null };

addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});

addEventListener("mousemove", e => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.r = Math.random() * 1.5 + 0.5;
        this.vx = (Math.random() - .5) * .3;
        this.vy = (Math.random() - .5) * .3;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.draw();
    }
}

for (let i = 0; i < STAR_COUNT; i++) stars.push(new Star());

function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    stars.forEach(s => s.update());
    requestAnimationFrame(animate);
}
animate();
