let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let tileSize = 20;
let snake = [{ x: 100, y: 100 }];
let direction = 'RIGHT';
let food = { x: 160, y: 160 };
let gameInterval;
let isPaused = false;
let score = 0;
let bestScore = localStorage.getItem('bestScore') ? parseInt(localStorage.getItem('bestScore')) : 0;

// Обновление лучшего результата
document.getElementById('bestScore').innerText = bestScore;

// Функция для запуска игры
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

// Функция для паузы игры
function pauseGame() {
    isPaused = true;
    document.getElementById('pauseGame').style.display = 'none';
    document.getElementById('resumeGame').style.display = 'inline';
    document.getElementById('restartGame').style.display = 'inline';
    clearInterval(gameInterval);
}

// Функция для продолжения игры
function resumeGame() {
    isPaused = false;
    document.getElementById('pauseGame').style.display = 'inline';
    document.getElementById('resumeGame').style.display = 'none';
    document.getElementById('restartGame').style.display = 'none';
    gameInterval = setInterval(updateGame, 150);
}

// Функция для перезапуска игры
function restartGame() {
    startGame();
}

// Основная функция обновления игры
function updateGame() {
    if (isPaused) return;

    moveSnake();
    checkCollision();
    checkFood();
    drawGame();
}

// Функция движения змеи
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

// Проверка столкновения с телом змеи
function checkCollision() {
    const head = snake[0];

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
            return;
        }
    }
}

// Проверка поедания еды
function checkFood() {
    const head = snake[0];
    if (head.x === food.x && head.y === food.y) {
        snake.push({ ...snake[snake.length - 1] });
        score += 10;
        document.getElementById('currentScore').innerText = score;
        placeFood();
        updateBestScore();
    }
}

// Функция размещения еды
function placeFood() {
    food.x = Math.floor(Math.random() * (canvas.width / tileSize)) * tileSize;
    food.y = Math.floor(Math.random() * (canvas.height / tileSize)) * tileSize;
}

// Функция отрисовки игры
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'green';
    for (let segment of snake) {
        ctx.fillRect(segment.x, segment.y, tileSize, tileSize);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, tileSize, tileSize);
}

// Функция окончания игры
function endGame() {
    clearInterval(gameInterval);
    alert('Игра окончена!');
    document.getElementById('startGame').style.display = 'inline';
    document.getElementById('pauseGame').style.display = 'none';
    document.getElementById('resumeGame').style.display = 'none';
    document.getElementById('restartGame').style.display = 'none';

    snake = [{ x: 100, y: 100 }];
    direction = 'RIGHT';
    score = 0;
    document.getElementById('currentScore').innerText = score;
}

// Обновление лучшего результата
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
