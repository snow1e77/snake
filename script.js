const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
let snake = [{ x: 10 * gridSize, y: 10 * gridSize }];
let direction = 'RIGHT';
let newDirection = 'RIGHT';
let food = {};
let gameInterval;
let isPaused = false;
let currentScore = 0;
let highScore = 0;

// Устанавливаем начальное положение еды
function placeFood() {
    const x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
    food = { x, y };
}

// Инициализация игры
function startGame() {
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('pauseButton').style.display = 'inline-block';
    document.getElementById('resumeButton').style.display = 'none';
    placeFood();
    direction = newDirection = 'RIGHT';
    snake = [{ x: 10 * gridSize, y: 10 * gridSize }];
    currentScore = 0;
    document.getElementById('currentScore').innerText = `Текущий счёт: ${currentScore}`;
    gameInterval = setInterval(updateGame, 100);
}

// Обновление игры
function updateGame() {
    if (isPaused) return;

    const head = { ...snake[0] };

    switch (newDirection) {
        case 'UP': head.y -= gridSize; break;
        case 'DOWN': head.y += gridSize; break;
        case 'LEFT': head.x -= gridSize; break;
        case 'RIGHT': head.x += gridSize; break;
    }

    // Проверка на столкновение с границей (выход с противоположной стороны)
    if (head.x < 0) head.x = canvas.width - gridSize;
    if (head.x >= canvas.width) head.x = 0;
    if (head.y < 0) head.y = canvas.height - gridSize;
    if (head.y >= canvas.height) head.y = 0;

    // Проверка на столкновение с самим собой
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    // Проверка на съедение еды
    if (head.x === food.x && head.y === food.y) {
        currentScore++;
        document.getElementById('currentScore').innerText = `Текущий счёт: ${currentScore}`;
        placeFood();
        if (currentScore > highScore) {
            highScore = currentScore;
            document.getElementById('highScore').innerText = `Лучший счёт: ${highScore}`;
        }
    } else {
        snake.pop();
    }

    drawGame();
}

// Отображение игры
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем змейку
    ctx.fillStyle = 'green';
    for (const segment of snake) {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    }

    // Рисуем еду
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// Остановка игры
function gameOver() {
    clearInterval(gameInterval);
    alert('Игра окончена! Нажмите "Начать игру" для нового начала.');
    startGame();
}

// Обработка нажатий клавиш для смены направления
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && direction !== 'DOWN') newDirection = 'UP';
    if (e.key === 'ArrowDown' && direction !== 'UP') newDirection = 'DOWN';
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') newDirection = 'LEFT';
    if (e.key === 'ArrowRight' && direction !== 'LEFT') newDirection = 'RIGHT';
});

// Кнопка паузы
document.getElementById('pauseButton').addEventListener('click', () => {
    isPaused = true;
    document.getElementById('pauseButton').style.display = 'none';
    document.getElementById('resumeButton').style.display = 'inline-block';
});

// Кнопка продолжения
document.getElementById('resumeButton').addEventListener('click', () => {
    isPaused = false;
    document.getElementById('pauseButton').style.display = 'inline-block';
    document.getElementById('resumeButton').style.display = 'none';
});

// Кнопка начала игры
document.getElementById('startButton').addEventListener('click', startGame);
