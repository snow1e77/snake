const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const restartButton = document.getElementById('restartButton');
const scoreDisplay = document.getElementById('score');

let gameInterval;
let isGameRunning = false;
let isGamePaused = false;
let score = 0;
let snake = [{ x: 160, y: 160 }];
let direction = 'right';
let food = { x: 80, y: 80 };
const snakeSize = 20;
const canvasSize = 400;

function startGame() {
    if (!isGameRunning) {
        resetGame();
        gameInterval = setInterval(updateGame, 150);
        isGameRunning = true;
        startButton.disabled = true;
        pauseButton.disabled = false;
        restartButton.disabled = false;
    }
}

function pauseGame() {
    if (isGameRunning) {
        clearInterval(gameInterval);
        isGamePaused = true;
        pauseButton.disabled = true;
        restartButton.disabled = false;
    }
}

function restartGame() {
    if (isGamePaused || !isGameRunning) {
        resetGame();
        startGame();
    }
}

function resetGame() {
    snake = [{ x: 160, y: 160 }];
    direction = 'right';
    food = { x: 80, y: 80 };
    score = 0;
    scoreDisplay.textContent = 'Счет: 0';
    isGameRunning = false;
    isGamePaused = false;
}

function updateGame() {
    if (!isGameRunning) return;

    moveSnake();
    checkCollision();
    checkFood();
    drawGame();
}

function moveSnake() {
    let head = { ...snake[0] };

    switch (direction) {
        case 'up': head.y -= snakeSize; break;
        case 'down': head.y += snakeSize; break;
        case 'left': head.x -= snakeSize; break;
        case 'right': head.x += snakeSize; break;
    }

    // Убедимся, что змейка выходит с противоположной стороны при касании границы
    if (head.x < 0) head.x = canvasSize - snakeSize;
    if (head.y < 0) head.y = canvasSize - snakeSize;
    if (head.x >= canvasSize) head.x = 0;
    if (head.y >= canvasSize) head.y = 0;

    snake.unshift(head);
    snake.pop();
}

function checkCollision() {
    const head = snake[0];
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            clearInterval(gameInterval);
            isGameRunning = false;
            alert('Игра окончена! Ваш счет: ' + score);
            startButton.disabled = false;
            pauseButton.disabled = true;
            restartButton.disabled = true;
            return;
        }
    }
}

function checkFood() {
    const head = snake[0];
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.textContent = 'Счет: ' + score;
        snake.push({});
        placeFood();
    }
}

function placeFood() {
    const x = Math.floor(Math.random() * (canvasSize / snakeSize)) * snakeSize;
    const y = Math.floor(Math.random() * (canvasSize / snakeSize)) * snakeSize;
    food = { x, y };
}

function drawGame() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    ctx.fillStyle = 'green';
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, snakeSize, snakeSize);
    });

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, snakeSize, snakeSize);
}

document.addEventListener('keydown', (e) => {
    if (!isGameRunning) return;

    switch (e.key) {
        case 'ArrowUp': if (direction !== 'down') direction = 'up'; break;
        case 'ArrowDown': if (direction !== 'up') direction = 'down'; break;
        case 'ArrowLeft': if (direction !== 'right') direction = 'left'; break;
        case 'ArrowRight': if (direction !== 'left') direction = 'right'; break;
    }
});
