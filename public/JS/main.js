document.addEventListener('DOMContentLoaded', () => {
    // 1. Fundo 3D Nativo (Movimento Suave, Drift e Flutuação)
    initVanilla3DBackground();

    // 2. Controle da Navbar (Esconde ao descer / Mostra ao subir)
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY || document.documentElement.scrollTop;

    if (navbar) {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY || document.documentElement.scrollTop;
            if (currentScrollY <= 20) {
                navbar.classList.remove('navbar-hidden');
            } else if (currentScrollY > lastScrollY + 5) {
                navbar.classList.add('navbar-hidden');
            } else if (currentScrollY < lastScrollY - 5) {
                navbar.classList.remove('navbar-hidden');
            }
            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    // 3. Efeito 3D do Cartão Mockup
    const cardMockup = document.querySelector('.card-mockup');
    const wrapper = document.querySelector('.card-3d-wrapper');

    if (cardMockup && wrapper) {
        wrapper.addEventListener('mousemove', (e) => {
            const rect = wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = ((y - (rect.height / 2)) / (rect.height / 2)) * -15; 
            const rotateY = ((x - (rect.width / 2)) / (rect.width / 2)) * 15;

            cardMockup.style.transition = 'transform 0.1s ease-out';
            cardMockup.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        wrapper.addEventListener('mouseleave', () => {
            cardMockup.style.transition = 'none';
        });
    }
});

function initVanilla3DBackground() {
    const canvas = document.getElementById('canvas-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Interatividade suave com o mouse
    window.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX - width / 2) * 0.00008;
        targetMouseY = (e.clientY - height / 2) * 0.00008;
    });

    const cubeVertices = [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1]
    ];
    const cubeEdges = [
        [0,1], [1,2], [2,3], [3,0],
        [4,5], [5,6], [6,7], [7,4],
        [0,4], [1,5], [2,6], [3,7]
    ];

    // Objetos 3D com física de movimento contínuo
    const numObjects = 16;
    const objects = [];

    for (let i = 0; i < numObjects; i++) {
        objects.push({
            x: (Math.random() - 0.5) * width * 1.2,
            y: (Math.random() - 0.5) * height * 1.2,
            z: Math.random() * 400 + 100,
            vx: (Math.random() - 0.5) * 0.3, // Deslocamento horizontal
            vy: (Math.random() - 0.5) * 0.3, // Deslocamento vertical
            size: Math.random() * 30 + 20,
            rx: Math.random() * Math.PI,
            ry: Math.random() * Math.PI,
            rotSpeedX: (Math.random() - 0.5) * 0.002, // Rotação bem lenta
            rotSpeedY: (Math.random() - 0.5) * 0.002,
            floatOffset: Math.random() * Math.PI * 2,
            color: i % 2 === 0 ? 'rgba(0, 210, 255, ' : 'rgba(112, 0, 255, '
        });
    }

    // Partículas de poeira estelar subindo devagar
    const numParticles = 80;
    const particles = [];
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: (Math.random() - 0.5) * width * 1.4,
            y: (Math.random() - 0.5) * height * 1.4,
            z: Math.random() * 600 + 10,
            size: Math.random() * 1.5 + 0.5,
            vy: Math.random() * 0.1 + 0.03
        });
    }

    function project(x, y, z) {
        const fov = 400;
        const scale = fov / (fov + z);
        return {
            x: x * scale + width / 2,
            y: y * scale + height / 2,
            scale: scale
        };
    }

    let time = 0;

    function render() {
        time += 0.008;
        ctx.clearRect(0, 0, width, height);

        // Suaviza a transição do mouse
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        // Renderiza partículas flutuantes
        particles.forEach(p => {
            p.y -= p.vy;
            if (p.y < -height / 2) p.y = height / 2;

            const proj = project(p.x, p.y, p.z);
            ctx.fillStyle = 'rgba(0, 210, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, p.size * proj.scale, 0, Math.PI * 2);
            ctx.fill();
        });

        // Renderiza e movimenta as formas 3D pela tela
        objects.forEach(obj => {
            // Deslocamento contínuo + movimento ondulatório suave
            obj.x += obj.vx;
            obj.y += obj.vy + Math.sin(time + obj.floatOffset) * 0.15;

            // Rebate suavemente ao chegar nas bordas
            const boundX = width * 0.65;
            const boundY = height * 0.65;
            if (obj.x > boundX || obj.x < -boundX) obj.vx *= -1;
            if (obj.y > boundY || obj.y < -boundY) obj.vy *= -1;

            // Rotação suave constante
            obj.rx += obj.rotSpeedX + mouseY;
            obj.ry += obj.rotSpeedY + mouseX;

            const projectedVertices = cubeVertices.map(v => {
                let x = v[0] * obj.size;
                let y = v[1] * obj.size;
                let z = v[2] * obj.size;

                let x1 = x * Math.cos(obj.ry) - z * Math.sin(obj.ry);
                let z1 = z * Math.cos(obj.ry) + x * Math.sin(obj.ry);

                let y2 = y * Math.cos(obj.rx) - z1 * Math.sin(obj.rx);
                let z2 = z1 * Math.cos(obj.rx) + y * Math.sin(obj.rx);

                return project(x1 + obj.x, y2 + obj.y, z2 + obj.z);
            });

            ctx.lineWidth = 1.2;
            cubeEdges.forEach(edge => {
                const p1 = projectedVertices[edge[0]];
                const p2 = projectedVertices[edge[1]];

                const alpha = Math.min(1, Math.max(0.1, (800 - obj.z) / 800 * 0.4));
                ctx.strokeStyle = obj.color + alpha + ')';

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            });
        });

        requestAnimationFrame(render);
    }

    render();
}