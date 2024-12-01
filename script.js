let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

const gridSize = 20; // Размер ячейки игрового поля
const canvasSize = 400; // Размер игрового поля
let snake = [{ x: 160, y: 160 }]; // Изначальное положение змейки
let snakeDirection = 'right'; // Направление движения
let food = { x: 100, y: 100 }; // Положение еды
let gameInterval;

// Управление движением змейки
document.addEventListener('keydown', (e) => {
    switch (e.key) {
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

// Функция для генерации случайного положения еды
function generateFood() {
    let x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    let y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    return { x, y };
}

// Функция для отрисовки змейки
function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
}

// Функция для отрисовки еды
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// Функция для обновления игры
function updateGame() {
    const head = { ...snake[0] }; // Копируем голову змейки

    switch (snakeDirection) {
        case 'up':
            head.y -= gridSize;
            break;
        case 'down':
            head.y += gridSize;
            break;
        case 'left':
            head.x -= gridSize;
            break;
        case 'right':
            head.x += gridSize;
            break;
    }

    // Проверка столкновений с границей
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        endGame();
        return;
    }

    // Проверка столкновений с телом змейки
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }

    // Проверка еды
    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
    } else {
        snake.pop(); // Удаляем последний сегмент змейки, чтобы она не росла без причины
    }

    snake.unshift(head); // Добавляем новую голову змейки
    drawGame();
}

// Функция для окончания игры
function endGame() {
    clearInterval(gameInterval);
    alert('Игра окончена! Нажмите "Начать игру", чтобы сыграть снова.');
}

// Функция для отрисовки всей игры
function drawGame() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    drawSnake();
    drawFood();
}

// Функция для начала игры
function startGame() {
    snake = [{ x: 160, y: 160 }];
    snakeDirection = 'right';
    food = generateFood();
    gameInterval = setInterval(updateGame, 150);
}

// Обработчики кнопок
document.getElementById('startGame').addEventListener('click', startGame);
