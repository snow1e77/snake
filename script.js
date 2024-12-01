document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resumeBtn = document.getElementById('resumeBtn');
    const restartBtn = document.getElementById('restartBtn');
    const scoreDisplay = document.getElementById('score');

    let snake = [];
    let direction = 'RIGHT';
    let food = {};
    let gameInterval;
    let gamePaused = false;
    let score = 0;

    // Функция начала игры
    function startGame() {
        snake = [{ x: 50, y: 50 }];
        direction = 'RIGHT';
        score = 0;
        scoreDisplay.textContent = 'Счет: ' + score;
        generateFood();
        clearInterval(gameInterval);
        gameInterval = setInterval(updateGame, 100);
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'block';
        restartBtn.style.display = 'none';
        resumeBtn.style.display = 'none';
    }

    // Функция обновления игры
    function updateGame() {
        if (gamePaused) return;
        moveSnake();
        checkCollisions();
        drawGame();
    }

    // Функция движения змейки
    function moveSnake() {
        const head = { ...snake[0] };
        if (direction === 'RIGHT') head.x += 20;
        if (direction === 'LEFT') head.x -= 20;
        if (direction === 'UP') head.y -= 20;
        if (direction === 'DOWN') head.y += 20;

        // Проверка на столкновение с границами
        if (head.x < 0) head.x = canvas.width - 20;
        if (head.x >= canvas.width) head.x = 0;
        if (head.y < 0) head.y = canvas.height - 20;
        if (head.y >= canvas.height) head.y = 0;

        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreDisplay.textContent = 'Счет: ' + score;
            generateFood();
        } else {
            snake.pop();
        }
    }

    // Генерация еды
    function generateFood() {
        const x = Math.floor(Math.random() * canvas.width / 20) * 20;
        const y = Math.floor(Math.random() * canvas.height / 20) * 20;
        food = { x, y };
    }

    // Проверка на столкновение
    function checkCollisions() {
        const head = snake[0];
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                alert('Игра окончена! Ваш счет: ' + score);
                clearInterval(gameInterval);
                startBtn.style.display = 'block';
                return;
            }
        }
    }

    // Отрисовка игры
    function drawGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'green';
        for (const part of snake) {
            ctx.fillRect(part.x, part.y, 20, 20);
        }
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, 20, 20);
    }

    // Слушатели событий
    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', () => {
        clearInterval(gameInterval);
        gamePaused = true;
        pauseBtn.style.display = 'none';
        resumeBtn.style.display = 'block';
        restartBtn.style.display = 'block';
    });
    resumeBtn.addEventListener('click', () => {
        gamePaused = false;
        gameInterval = setInterval(updateGame, 100);
        pauseBtn.style.display = 'block';
        resumeBtn.style.display = 'none';
        restartBtn.style.display = 'none';
    });
    restartBtn.addEventListener('click', startGame);
});
