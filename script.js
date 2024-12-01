const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const resumeButton = document.getElementById('resumeButton');
const scoreElement = document.getElementById('score');

let snake;
let food;
let gameInterval;
let isPaused = false;
let score = 0;
let direction;
let gameRunning = false;

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        score = 0;
        snake = [
            { x: 150, y: 150 },
            { x: 140, y: 150 },
            { x: 130, y: 150 },
        ];
        direction = 'right';
        document.addEventListener('keydown', changeDirection);
        generateFood();
        startButton.style.display = 'none';
        pauseButton.style.display = 'inline-block';
        resumeButton.style.display = 'none';
        gameInterval = setInterval(updateGame, 100);
        updateScore();
    }
}

function pauseGame() {
    if (gameRunning) {
        clearInterval(gameInterval);
        isPaused = true;
        pauseButton.style.display = 'none';
        resumeButton.style.display = 'inline-block';
    }
}

function resumeGame() {
    if (isPaused) {
        isPaused = false;
        gameInterval = setInterval(updateGame, 100);
        pauseButton.style.display = 'inline-block';
        resumeButton.style.display = 'none';
    }
}

function changeDirection(event) {
    if (event.key === 'ArrowUp' && direction !== 'down') direction = 'up';
    if (event.key === 'ArrowDown' && direction !== 'up') direction = 'down';
    if (event.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
    if (event.key === 'ArrowRight' && direction !== 'left') direction = 'right';
}

function updateGame() {
    if (isPaused) return;

    let newHead = { ...snake[0] };

    switch (direction) {
        case 'up':
            newHead.y -= 10;
            break;
        case 'down':
            newHead.y += 10;
            break;
        case 'left':
            newHead.x -= 10;
            break;
        case 'right':
            newHead.x += 10;
            break;
    }

    // Check for collision with walls
    if (
        newHead.x < 0 || newHead.x >= canvas.width ||
        newHead.y < 0 || newHead.y >= canvas.height
    ) {
        endGame();
        return;
    }

    // Check for collision with itself
    for (let i = 1; i < snake.length; i++) {
        if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
            endGame();
            return;
        }
    }

    snake.unshift(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        updateScore();
        generateFood();
    } else {
        snake.pop();
    }

    drawGame();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = 'green';
    for (let segment of snake) {
        ctx.fillRect(segment.x, segment.y, 10, 10);
    }

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 10, 10);
}

function generateFood() {
    const x = Math.floor(Math.random() * (canvas.width / 10)) * 10;
    const y = Math.floor(Math.random() * (canvas.height / 10)) * 10;

    // Ensure food does not appear on the snake
    for (let segment of snake) {
        if (segment.x === x && segment.y === y) {
            return generateFood();
        }
    }

    food = { x, y };
}

function updateScore() {
    scoreElement.textContent = `Счёт: ${score}`;
}

function endGame() {
    clearInterval(gameInterval);
    alert('Игра окончена! Ваш счёт: ' + score);
    startButton.style.display = 'inline-block';
    pauseButton.style.display = 'none';
    resumeButton.style.display = 'none';
    gameRunning = false;
}

// Add event listener for start button
startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', pauseGame);
resumeButton.addEventListener('click', resumeGame);
