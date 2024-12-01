// Инициализация переменных
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let snake = [{ x: 150, y: 150 }];
let food = { x: 100, y: 100 };
let direction = 'RIGHT';
let newDirection = 'RIGHT';
let gameInterval;
let gameRunning = false;

// Обработка нажатий клавиш для смены направления
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction !== 'DOWN') newDirection = 'UP';
            break;
        case 'ArrowDown':
            if (direction !== 'UP') newDirection = 'DOWN';
            break;
        case 'ArrowLeft':
            if (direction !== 'RIGHT') newDirection = 'LEFT';
            break;
        case 'ArrowRight':
            if (direction !== 'LEFT') newDirection = 'RIGHT';
            break;
    }
});

// Функция для начала игры
function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        direction = newDirection;
        gameInterval = setInterval(updateGame, 100);
    }
}

// Функция для обновления игры
function updateGame() {
    direction = newDirection;
    let head = { ...snake[0] };

    // Изменение позиции головы змейки в зависимости от направления
    switch (direction) {
        case 'UP':
            head.y -= 20;
            break;
        case 'DOWN':
            head.y += 20;
            break;
        case 'LEFT':
            head.x -= 20;
            break;
        case 'RIGHT':
            head.x += 20;
            break;
    }

    // Проверка выхода за границы и возвращение с противоположной стороны
    if (head.x < 0) head.x = canvas.width - 20;
    if (head.y < 0) head.y = canvas.height - 20;
    if (head.x >= canvas.width) head.x = 0;
    if (head.y >= canvas.height) head.y = 0;

    // Проверка столкновения с самим собой
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    // Добавление нового сегмента в змейку
    snake.unshift(head);

    // Проверка, съела ли змейка еду
    if (head.x === food.x && head.y === food.y) {
        placeNewFood();
    } else {
        snake.pop();
    }

    drawGame();
}

// Функция для отрисовки игры
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Отрисовка змейки
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, 20, 20);
    });

    // Отрисовка еды
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 20, 20);
}

// Функция для размещения еды в случайной позиции
function placeNewFood() {
    let x = Math.floor(Math.random() * (canvas.width / 20)) * 20;
    let y = Math.floor(Math.random() * (canvas.height / 20)) * 20;
    food = { x, y };
}

// Функция окончания игры
function gameOver() {
    clearInterval(gameInterval);
    gameRunning = false;
    alert('Игра окончена! Ваш результат: ' + snake.length);
}

// Запуск игры при нажатии кнопки
document.getElementById('startButton').addEventListener('click', startGame);
