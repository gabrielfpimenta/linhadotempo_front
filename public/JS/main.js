document.addEventListener('DOMContentLoaded', () => {
    initVanilla3DBackground();

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

    let targetMouseX = 0, targetMouseY = 0, mouseX = 0, mouseY = 0;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

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

    // Paleta em 3 Tonalidades do Gradiente
    const colors = [
        'rgba(0, 198, 255, ',  // Cyan
        'rgba(0, 114, 255, ',  // Azul Elétrico
        'rgba(112, 0, 255, '   // Roxo
    ];

    const numObjects = 18;
    const objects = [];

    for (let i = 0; i < numObjects; i++) {
        objects.push({
            x: (Math.random() - 0.5) * width * 1.2,
            y: (Math.random() - 0.5) * height * 1.2,
            z: Math.random() * 400 + 100,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            size: Math.random() * 28 + 18,
            rx: Math.random() * Math.PI,
            ry: Math.random() * Math.PI,
            rotSpeedX: (Math.random() - 0.5) * 0.002,
            rotSpeedY: (Math.random() - 0.5) * 0.002,
            floatOffset: Math.random() * Math.PI * 2,
            color: colors[i % colors.length]
        });
    }

    const particles = [];
    for (let i = 0; i < 90; i++) {
        particles.push({
            x: (Math.random() - 0.5) * width * 1.4,
            y: (Math.random() - 0.5) * height * 1.4,
            z: Math.random() * 600 + 10,
            size: Math.random() * 1.5 + 0.5,
            vy: Math.random() * 0.08 + 0.02
        });
    }

    function project(x, y, z) {
        const fov = 400;
        const scale = fov / (fov + z);
        return { x: x * scale + width / 2, y: y * scale + height / 2, scale };
    }

    let time = 0;
    function render() {
        time += 0.008;
        ctx.clearRect(0, 0, width, height);

        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        particles.forEach(p => {
            p.y -= p.vy;
            if (p.y < -height / 2) p.y = height / 2;
            const proj = project(p.x, p.y, p.z);
            ctx.fillStyle = 'rgba(0, 198, 255, 0.35)';
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, p.size * proj.scale, 0, Math.PI * 2);
            ctx.fill();
        });

        objects.forEach(obj => {
            obj.x += obj.vx;
            obj.y += obj.vy + Math.sin(time + obj.floatOffset) * 0.12;

            if (Math.abs(obj.x) > width * 0.65) obj.vx *= -1;
            if (Math.abs(obj.y) > height * 0.65) obj.vy *= -1;

            obj.rx += obj.rotSpeedX + mouseY;
            obj.ry += obj.rotSpeedY + mouseX;

            const projectedVertices = cubeVertices.map(v => {
                let x = v[0] * obj.size, y = v[1] * obj.size, z = v[2] * obj.size;
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
                const alpha = Math.min(1, Math.max(0.15, (800 - obj.z) / 800 * 0.45));
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