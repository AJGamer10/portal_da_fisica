// Game
$(document).ready(function () {
    const G = 0.1; // Constante da gravitação
    const canvas = $('#gameCanvas')[0];
    const ctx = canvas.getContext('2d');
    const togglePath = $('#togglePath');
    const pauseSimulation = $('#pauseSimulation');
    const explanation = $('#explanation');

    const planet1 = {
        x: canvas.width / 2 - 250,
        y: canvas.height / 2,
        radius: 20,
        mass: 5000,
        velocity: { x: 0, y: 1 },
        color: 'blue',
        trajectory: [],
        isPathVisible: false,
        isSimulationPaused: false,
    };

    const planet2 = {
        x: canvas.width / 2 + 300,
        y: canvas.height / 2,
        radius: 10,
        mass: 500,
        velocity: { x: 0, y: -1 },
        color: 'white',
        trajectory: [],
        isPathVisible: false,
        isSimulationPaused: false,
    };

    const star = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 60,
        mass: 10000,
        velocity: { x: 0, y: 0 },
        color: '#f1c40f',
        isPathVisible: false,
        isSimulationPaused: false,
    };

    const toggleVisibility = (object) => {
        object.isPathVisible = !object.isPathVisible;
        const button = object.isPathVisible ? 'Esconder' : 'Mostrar';
        togglePath.text(`${button} trajetória`);
        togglePath.css('background-color', object.isPathVisible ? 'rgb(255, 156, 156)' : '#3498db');
    };

    togglePath.click(() => {
        toggleVisibility(planet1);
        toggleVisibility(planet2);
        toggleVisibility(star);
    });

    const toggleSimulation = (object) => {
        object.isSimulationPaused = !object.isSimulationPaused;
        const button = object.isSimulationPaused ? 'Resumir' : 'Pausar';
        pauseSimulation.text(button);
        pauseSimulation.css('background-color', object.isSimulationPaused ? 'rgb(255, 156, 156)' : '#3498db');
    };

    pauseSimulation.click(() => {
        toggleSimulation(planet1);
        toggleSimulation(planet2);
        toggleSimulation(star);
    });

    const updateExplanation = () => {
        explanation.text('Explicação: A simulação está em andamento...');
    };

    const calculateForce = (planet, other) => {
        const dx = other.x - planet.x;
        const dy = other.y - planet.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > planet.radius + other.radius) {
            const force = (G * other.mass * planet.mass) / (distance * distance);
            const angle = Math.atan2(dy, dx);
            return { force, angle };
        }
        return { force: 0, angle: 0 };
    };

    const updatePosition = () => {
        // planeta1 com estrela
        if (!planet1.isSimulationPaused) {
            const { force, angle } = calculateForce(planet1, star);
            const acceleration = force / planet1.mass;
            planet1.velocity.x += acceleration * Math.cos(angle);
            planet1.velocity.y += acceleration * Math.sin(angle);
            planet1.x += planet1.velocity.x;
            planet1.y += planet1.velocity.y;
            planet1.trajectory.push({ x: planet1.x, y: planet1.y });
        }
        
        // planeta2 com estrela
        if (!planet2.isSimulationPaused) {
            const { force, angle } = calculateForce(planet2, star);
            const acceleration = force / planet2.mass;
            planet2.velocity.x += acceleration * Math.cos(angle);
            planet2.velocity.y += acceleration * Math.sin(angle);
            planet2.x += planet2.velocity.x;
            planet2.y += planet2.velocity.y;
            planet2.trajectory.push({ x: planet2.x, y: planet2.y });
        }

        // planeta1 com planeta2
        if (!planet1.isSimulationPaused) {
            const { force, angle } = calculateForce(planet1, planet2);
            const acceleration = force / planet1.mass;
            planet1.velocity.x += acceleration * Math.cos(angle);
            planet1.velocity.y += acceleration * Math.sin(angle);
            planet1.x += planet1.velocity.x;
            planet1.y += planet1.velocity.y;
            planet1.trajectory.push({ x: planet1.x, y: planet1.y });
        }

        // planeta2 com planeta1
        if (!planet2.isSimulationPaused) {
            const { force, angle } = calculateForce(planet2, planet1);
            const acceleration = force / planet2.mass;
            planet2.velocity.x += acceleration * Math.cos(angle);
            planet2.velocity.y += acceleration * Math.sin(angle);
            planet2.x += planet2.velocity.x;
            planet2.y += planet2.velocity.y;
            planet2.trajectory.push({ x: planet2.x, y: planet2.y });
        }
    
        drawCanvas();
        if (planet1.isPathVisible) drawPath(planet1);
        if (planet2.isPathVisible) drawPath(planet2);
        requestAnimationFrame(updatePosition);
    };

    const drawPath = (planet) => {
        ctx.beginPath();
        ctx.strokeStyle = planet.color;
    
        // Limite o tamanho da trajetória
        if (planet.trajectory.length > 600) {
            planet.trajectory.splice(0, planet.trajectory.length - 600);
        }
    
        ctx.moveTo(planet.trajectory[0].x, planet.trajectory[0].y);
        planet.trajectory.forEach((point) => {
            ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
        ctx.closePath();
    };

    const drawArrow = (planet) => {
        if (planet.velocity.x !== 0 || planet.velocity.y !== 0) {
            const arrowLength = 50;
            const arrowAngle = Math.atan2(planet.velocity.y, planet.velocity.x);
    
            ctx.beginPath();
            ctx.strokeStyle = 'green';
            ctx.moveTo(planet.x, planet.y);
            ctx.lineTo(planet.x + arrowLength * Math.cos(arrowAngle), planet.y + arrowLength * Math.sin(arrowAngle));
            ctx.lineWidth = 2;
            ctx.stroke();
    
            // Desenha a ponta da flecha
            ctx.beginPath();
            ctx.moveTo(planet.x + arrowLength * Math.cos(arrowAngle), planet.y + arrowLength * Math.sin(arrowAngle));
            ctx.lineTo(planet.x + (arrowLength - 5) * Math.cos(arrowAngle - 0.3), planet.y + (arrowLength - 5) * Math.sin(arrowAngle - 0.3));
            ctx.lineTo(planet.x + (arrowLength - 5) * Math.cos(arrowAngle + 0.3), planet.y + (arrowLength - 5) * Math.sin(arrowAngle + 0.3));
            ctx.closePath();
            ctx.fillStyle = 'green';
            ctx.fill();
        }
    };

    const drawCanvas = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        // Desenha a estrela
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();
        ctx.closePath();
    
        // Desenha o planeta 1
        ctx.beginPath();
        ctx.arc(planet1.x, planet1.y, planet1.radius, 0, Math.PI * 2);
        ctx.fillStyle = planet1.color;
        ctx.fill();
        ctx.closePath();
        drawArrow(planet1);
    
        // Desenha o planeta 2
        ctx.beginPath();
        ctx.arc(planet2.x, planet2.y, planet2.radius, 0, Math.PI * 2);
        ctx.fillStyle = planet2.color;
        ctx.fill();
        ctx.closePath();
        drawArrow(planet2);
    };

    updateExplanation();
    updatePosition();
});