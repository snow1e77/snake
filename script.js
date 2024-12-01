// Объявление переменных
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let gridSize = 20; // Размер клетки
let snake = [];
let snakeLength = 5; // Начальная длина змейки
let direction = "right"; // Начальное направление
let food = {};
let score = 0;
let highScore = 0;
let gameInterval;
let isPaused = false;

// Функция для инициализации игры
function initializeGame() {
    snake = [];
    for (let i = snakeLength - 1; i >= 0; i--) {
        snake.push({ x: i * gridSize, y: 0 });
    }
    direction = "right";
    generateFood();
    score = 0;
    document.getElementById("score").textContent = "Score: 0";
}

// Функция для генерации еды
function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
    };
}

// Функция для отображения змейки и еды
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем змейку
    ctx.fillStyle = "green";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    // Рисуем еду
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    // Обновляем счет
    document.getElementById("score").textContent = "Score: " + score;
}

// Функция для движения змейки
function move() {
    if (isPaused) return;

    let newHead = { ...snake[0] };

    switch (direction) {
        case "right":
            newHead.x += gridSize;
            break;
        case "left":
            newHead.x -= gridSize;
            break;
        case "up":
            newHead.y -= gridSize;
            break;
        case "down":
            newHead.y += gridSize;
            break;
    }

    // Проверка выхода за границы и появления с другой стороны
    if (newHead.x >= canvas.width) newHead.x = 0;
    if (newHead.x < 0) newHead.x = canvas.width - gridSize;
    if (newHead.y >= canvas.height) newHead.y = 0;
    if (newHead.y < 0) newHead.y = canvas.height - gridSize;

    // Проверка столкновения с собой
    for (let i = 0; i < snake.length; i++) {
        if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
            endGame();
            return;
        }
    }

    snake.unshift(newHead);

    // Проверка съедена ли еда
    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        if (score > highScore) highScore = score;
        generateFood();
    } else {
        snake.pop();
    }

    draw();
}

// Функция для завершения игры
function endGame() {
    clearInterval(gameInterval);
    alert("Game Over! Your score: " + score);
    initializeGame();
    draw();
}

// Функция для обработки нажатий клавиш
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== "down") direction = "up";
    if (event.key === "ArrowDown" && direction !== "up") direction = "down";
    if (event.key === "ArrowLeft" && direction !== "right") direction = "left";
    if (event.key === "ArrowRight" && direction !== "left") direction = "right";
});

// Функция для старта игры
function startGame() {
    initializeGame();
    gameInterval = setInterval(move, 100);
}

// Обработчики для кнопок
document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("pauseButton").addEventListener("click", () => {
    if (isPaused) {
        gameInterval = setInterval(move, 100);
        isPaused = false;
    } else {
        clearInterval(gameInterval);
        isPaused = true;
    }
});
document.getElementById("restartButton").addEventListener("click", () => {
    clearInterval(gameInterval);
    initializeGame();
    gameInterval = setInterval(move, 100);
});
