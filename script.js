const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let snake = [{ x: 160, y: 160 }];
let snakeDirection = 'right';
let gameInterval;
let isPaused = false;
let score = 0;

// Инициализация игры
function startGame() {
    if (gameInterval) clearInterval(gameInterval);
    score = 0;
    document.getElementById('score').innerText = `Счет: ${score}`;
    snake = [{ x: 160, y: 160 }];
    snakeDirection = 'right';
    gameInterval = setInterval(updateGame, 100);
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('pauseButton').style.display = 'inline-block';
}

// Основная функция обновления игры
function updateGame() {
    if (isPaused) return;

    // Логика движения змейки
    moveSnake();

    // Проверка на столкновение с границей или собой
    if (checkCollision()) {
        alert('Игра окончена!');
        clearInterval(gameInterval);
        document.getElementById('startButton').style.display = 'inline-block';
        document.getElementById('pauseButton').style.display = 'none';
        document.getElementById('resumeButton').style.display = 'none';
        return;
    }

    drawGame();
}

// Двигаем змейку
function moveSnake() {
    const head = { ...snake[0] };

    switch (snakeDirection) {
        case 'up': head.y -= 20; break;
        case 'down': head.y += 20; break;
        case 'left': head.x -= 20; break;
        case 'right': head.x += 20; break;
    }

    // Проверка выхода за границы
    if (head.x < 0) head.x = canvas.width - 20;
    if (head.y < 0) head.y = canvas.height - 20;
    if (head.x >= canvas.width) head.x = 0;
    if (head.y >= canvas.height) head.y = 0;

    snake.unshift(head);
    snake.pop();
}

// Проверка на столкновение
function checkCollision() {
    const head = snake[0];
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

// Отображение игры
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    for (const part of snake) {
        ctx.fillRect(part.x, part.y, 20, 20);
    }
}

// Управление кнопками
document.getElementById('startButton').addEventListener('click', startGame);

document.getElementById('pauseButton').addEventListener('click', () => {
    isPaused = true;
    document.getElementById('pauseButton').style.display = 'none';
    document.getElementById('resumeButton').style.display = 'inline-block';
});

document.getElementById('resumeButton').addEventListener('click', () => {
    isPaused = false;
    document.getElementById('resumeButton').style.display = 'none';
    document.getElementById('pauseButton').style.display = 'inline-block';
});

// Управление клавишами для направления змейки
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (snakeDirection !== 'down') snakeDirection = 'up';
            break;
        case 'ArrowDown':
            if (snakeDirection !== 'up') snakeDirection = 'down';
            break;
        case 'ArrowLeft':
            if (snakeDirection !== 'right') snakeDirection = 'left';
            break;
        case 'ArrowRight':
            if (snakeDirection !== 'left') snakeDirection = 'right';
            break;
    }
});
