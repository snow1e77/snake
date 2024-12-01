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
    }

    function updateGame() {
        if (gamePaused) return;
        // Game logic for moving the snake and checking collisions.
        // Add collision detection and scoring logic here.
    }

    function generateFood() {
        const x = Math.floor(Math.random() * canvas.width / 20) * 20;
        const y = Math.floor(Math.random() * canvas.height / 20) * 20;
        food = { x, y };
    }

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

    function drawSnake() {
        // Drawing logic for the snake.
    }

    function drawFood() {
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, 20, 20);
    }
});
