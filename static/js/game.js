// Game
document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Game objects
    const star = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        mass: 10000,
        radius: 50,
    };

    const planet = {
        x: canvas.width / 2 + 250,
        y: canvas.height / 2,
        mass: 50,
        radius: 10,
        velocity: {
            x: 0,
            y: -4,
        },
    };

    const G = -0.4; // Gravitational constant

    // Variável para rastrear se a trajetória está visível ou não
    let showTrajectory = false;

    // Botão para mostrar/ocultar a trajetória
    const toggleTrajectoryButton = document.getElementById('toggleTrajectory');
    toggleTrajectoryButton.addEventListener('click', function () {
        showTrajectory = !showTrajectory;
        if (showTrajectory) {
            toggleTrajectoryButton.textContent = 'Ocultar Trajetória';
        } else {
            toggleTrajectoryButton.textContent = 'Mostrar Trajetória';
        }
    });

    // Variáveis para rastrear a posição da seta de velocidade
    let arrowX = planet.x + planet.velocity.x * 10;
    let arrowY = planet.y + planet.velocity.y * 10;

    // Variável para rastrear se o botão do mouse está pressionado
    let mousePressed = false;

    // Variável para rastrear se o jogo está pausado
    let gamePaused = false;

    // Botão para pausar/retomar o jogo
    const pauseResumeButton = document.getElementById('pauseResumeButton');
    pauseResumeButton.addEventListener('click', function () {
        gamePaused = !gamePaused;
        if (gamePaused) {
            pauseResumeButton.textContent = 'Retomar';
        } else {
            pauseResumeButton.textContent = 'Pausar';
        }
    });

    // Adiciona um ouvinte de evento ao canvas para rastrear o botão do mouse pressionado
    canvas.addEventListener('mousedown', function () {
        mousePressed = true;
    });

    // Adiciona um ouvinte de evento ao canvas para rastrear o botão do mouse solto
    canvas.addEventListener('mouseup', function () {
        if (mousePressed) {
            // Atualiza a velocidade do planeta com base na direção indicada pela seta de velocidade
            const dx = arrowX - planet.x;
            const dy = arrowY - planet.y;
            const length = Math.sqrt(dx * dx + dy * dy);

            // Define a nova velocidade do planeta com base na direção da seta de velocidade
            planet.velocity.x = (dx / length) * length / 10;
            planet.velocity.y = (dy / length) * length / 10;

            mousePressed = false;
        }
    });

    // Adiciona um ouvinte de evento ao canvas para rastrear a posição do mouse
    canvas.addEventListener('mousemove', function (event) {
        if (mousePressed) {
            // Atualiza a posição da seta de velocidade enquanto o botão do mouse está pressionado
            arrowX = event.clientX - canvas.getBoundingClientRect().left;
            arrowY = event.clientY - canvas.getBoundingClientRect().top;
        }
    });


    // Function to calculate the gravitational force
    function calculateGravity(object1, object2) {
        const dx = object2.x - object1.x;
        const dy = object2.y - object1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const force = (G * object1.mass * object2.mass) / (distance * distance);
        const angle = Math.atan2(dy, dx);
        const fx = force * Math.cos(angle);
        const fy = force * Math.sin(angle);
        return { fx, fy };
    }

    // Array para armazenar as posições passadas do planeta
    const planetPath = [];

    // Função para desenhar a trajetória do planeta
    function drawTrajectory() {
        ctx.beginPath();
        ctx.moveTo(planetPath[0].x, planetPath[0].y);

        for (let i = 1; i < planetPath.length; i++) {
            ctx.lineTo(planetPath[i].x, planetPath[i].y);
        }

        ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
        ctx.stroke();
    }

    // Função para desenhar uma seta
    function drawArrow(x1, y1, x2, y2, color) {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        const angle = Math.atan2(y1 - y2, x1 - x2);
        const arrowSize = 20;

        // Desenha a seta como um triângulo
        ctx.lineTo(x2 + arrowSize * Math.cos(angle - Math.PI / 6), y2 + arrowSize * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 + arrowSize * Math.cos(angle + Math.PI / 6), y2 + arrowSize * Math.sin(angle + Math.PI / 6));

        ctx.stroke();
    }

    // Animation loop
    function animate() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const gravity = calculateGravity(star, planet);

        if (!gamePaused) {
            // Atualiza a velocidade e a posição do planeta com base na gravidade
            planet.velocity.x += gravity.fx / planet.mass;
            planet.velocity.y += gravity.fy / planet.mass;
            planet.x += planet.velocity.x;
            planet.y += planet.velocity.y;
        }

        // Atualiza a matriz de posições do planeta
        planetPath.push({ x: planet.x, y: planet.y });

        // Mantém o tamanho da matriz planetPath limitado para evitar vazamento de memória
        if (planetPath.length > 300) {
            planetPath.shift();
        }

        // Desenha a estrela no centro do canvas
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.closePath();

        // Desenha o planeta
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();

        if (showTrajectory) {
            drawTrajectory();
        }

        // Vetor de aceleração

        // Vetor de velocidade
        drawArrow(planet.x, planet.y, arrowX, arrowY, 'green');


        requestAnimationFrame(animate);
    }

    // Inicia a animação
    animate();
});