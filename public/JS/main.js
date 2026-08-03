// Animação de Partículas no Fundo
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const mouse = { x: null, y: null, radius: 150 };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = `rgba(${Math.random() * 70 + 99}, ${Math.random() * 70 + 102}, ${Math.random() * 70 + 241}, ${Math.random() * 0.5 + 0.2})`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            this.speedX = -this.speedX * 1.2;
            this.speedY = -this.speedY * 1.2;
        }

        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    particlesArray = [];
    for (let i = 0; i < 100; i++) {
        particlesArray.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(99, 102, 241, ${1 - distance / 100})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

init();
animate();

// Redimensionar Canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// Sombra no Header ao Rolar
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
});

// Rolagem Suave para Links Internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const el = document.querySelector(targetId);
        if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
    });
});

// Efeito Parallax nos Elementos Flutuantes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const float1 = document.querySelector('.float-1');
    const float2 = document.querySelector('.float-2');
    if (float1) float1.style.transform = `translate(${scrolled * 0.03}px, ${scrolled * 0.05}px)`;
    if (float2) float2.style.transform = `translate(${-scrolled * 0.03}px, ${-scrolled * 0.05}px)`;
});

// Interatividade Lottie
document.addEventListener('DOMContentLoaded', function () {
    try {
        LottieInteractivity.create({
            player: '#lottie-ai',
            mode: 'scroll',
            actions: [{ visibility: [0, 1], type: 'seek', frames: [0, 100] }]
        });
    } catch (e) {
        // Ignora caso a biblioteca Lottie ainda não tenha carregado
    }
});