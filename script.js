const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const tileSize = 20;
let snake = [{ x: 100, y: 100 }];
let direction = 'RIGHT';
let food = { x: 160, y: 160 };
let gameInterval;
let isPaused = false;
let score = 0;
let bestScore = localStorage.getItem('bestScore') ? parseInt(localStorage.getItem('bestScore')) : 0;

// Инициализация отображения лучшего счета
document.getElementById('bestScore').innerText = bestScore;

function startGame() {
    document.getElementById('startGame').style.display = 'none';
    document.getElementById('pauseGame').style.display = 'inline';
    document.getElementById('resumeGame').style.display = 'none';
    document.getElementById('restartGame').style.display = 'none';

    // Сброс состояния игры
    snake = [{ x: 100, y: 100 }];
    direction = 'RIGHT';
    score = 0;
    document.getElementById('currentScore').innerText = score;
    placeFood();

    if (gameInterval) {
        clearInterval(gameInterval);
    }

    gameInterval = setInterval(updateGame, 150);
}

function pauseGame() {
    isPaused = true;
    document.getElementById('pauseGame').style.display = 'none';
    document.getElementById('resumeGame').style.display = 'inline';
    document.getElementById('restartGame').style.display = 'inline';
    clearInterval(gameInterval);
}

function resumeGame() {
    isPaused = false;
    document.getElementById('pauseGame').style.display = 'inline';
    document.getElementById('resumeGame').style.display = 'none';
    document.getElementById('restartGame').style.display = 'none';
    gameInterval = setInterval(updateGame, 150);
}

function restartGame() {
    startGame();
}

function updateGame() {
    if (isPaused) return;

    moveSnake();
    checkCollision();
    checkFood();
    drawGame();
}

function moveSnake() {
    let head = { ...snake[0] };

    if (direction === 'UP') head.y -= tileSize;
    if (direction === 'DOWN') head.y += tileSize;
    if (direction === 'LEFT') head.x -= tileSize;
    if (direction === 'RIGHT') head.x += tileSize;

    // Обработка выхода за границы и возвращение с противоположной стороны
    if (head.x < 0) head.x = canvas.width - tileSize;
    if (head.x >= canvas.width) head.x = 0;
    if (head.y < 0) head.y = canvas.height - tileSize;
    if (head.y >= canvas.height) head.y = 0;

    snake.unshift(head);
    snake.pop();
}

function checkCollision() {
    const head = snake[0];

    // Проверка столкновения с телом змеи
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
            return;
        }
    }
}

function checkFood() {
    const head = snake[0];
    if (head.x === food.x && head.y === food.y) {
        // Увеличиваем змейку
        snake.push({ ...snake[snake.length - 1] });
        score += 10;
        document.getElementById('currentScore').innerText = score;
        placeFood();
        updateBestScore();
    }
}

function placeFood() {
    food.x = Math.floor(Math.random() * (canvas.width / tileSize)) * tileSize;
    food.y = Math.floor(Math.random() * (canvas.height / tileSize)) * tileSize;
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Отображаем змейку
    ctx.fillStyle = 'green';
    for (let segment of snake) {
        ctx.fillRect(segment.x, segment.y, tileSize, tileSize);
    }

    // Отображаем еду
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, tileSize, tileSize);
}

function endGame() {
    clearInterval(gameInterval);
    alert('Игра окончена!');
    document.getElementById('startGame').style.display = 'inline';
    document.getElementById('pauseGame').style.display = 'none';
    document.getElementById('resumeGame').style.display = 'none';
    document.getElementById('restartGame').style.display = 'none';

    // Сброс состояния игры
    snake = [{ x: 100, y: 100 }];
    direction = 'RIGHT';
    score = 0;
    document.getElementById('currentScore').innerText = score;
}

function updateBestScore() {
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
        document.getElementById('bestScore').innerText = bestScore;
    }
}

// Управление змейкой с помощью клавиш
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
});
