const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
let snake = [{ x: 100, y: 100 }];
let direction = 'right';
let food = { x: 200, y: 200 };
let score = 0;
let highScore = 0;
let gameInterval;
let isPaused = false;

// Elements
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeBtn');
const restartBtn = document.getElementById('restartBtn');
const currentScoreEl = document.getElementById('currentScore');
const highScoreEl = document.getElementById('highScore');

// Game settings
canvas.width = 400;
canvas.height = 400;

// Event listeners
document.addEventListener('keydown', changeDirection);
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
resumeBtn.addEventListener('click', resumeGame);
restartBtn.addEventListener('click', restartGame);

// Game functions
function startGame() {
    snake = [{ x: 100, y: 100 }];
    direction = 'right';
    score = 0;
    currentScoreEl.textContent = score;
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, 150);
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    restartBtn.style.display = 'none';
}

function updateGame() {
    if (isPaused) return;

    // Move snake
    const head = { ...snake[0] };
    if (direction === 'right') head.x += gridSize;
    if (direction === 'left') head.x -= gridSize;
    if (direction === 'up') head.y -= gridSize;
    if (direction === 'down') head.y += gridSize;

    // Check for collision with the wall (wrap around)
    if (head.x >= canvas.width) head.x = 0;
    if (head.x < 0) head.x = canvas.width - gridSize;
    if (head.y >= canvas.height) head.y = 0;
    if (head.y < 0) head.y = canvas.height - gridSize;

    // Check for collision with itself
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }

    // Move the snake
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        currentScoreEl.textContent = score;
        generateFood();
        highScore = Math.max(highScore, score);
        highScoreEl.textContent = highScore;
    } else {
        snake.pop();
    }

    drawGame();
}

function changeDirection(e) {
    if (e.key === 'ArrowUp' && direction !== 'down') direction = 'up';
    if (e.key === 'ArrowDown' && direction !== 'up') direction = 'down';
    if (e.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
    if (e.key === 'ArrowRight' && direction !== 'left') direction = 'right';
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, gridSize, gridSize));

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function generateFood() {
    const x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
    food = { x, y };
}

function pauseGame() {
    clearInterval(gameInterval);
    isPaused = true;
    pauseBtn.disabled = true;
    resumeBtn.style.display = 'inline-block';
    restartBtn.style.display = 'inline-block';
}

function resumeGame() {
    isPaused = false;
    gameInterval = setInterval(updateGame, 150);
    resumeBtn.style.display = 'none';
    pauseBtn.disabled = false;
}

function restartGame() {
    clearInterval(gameInterval);
    startGame();
    isPaused = false;
    pauseBtn.disabled = false;
    resumeBtn.style.display = 'none';
    restartBtn.style.display = 'none';
}

function endGame() {
    clearInterval(gameInterval);
    alert('Игра окончена! Ваш счёт: ' + score);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resumeBtn.style.display = 'none';
    restartBtn.style.display = 'inline-block';
}
