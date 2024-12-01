let gameContainer = document.getElementById('gameContainer');
let startBtn = document.getElementById('startBtn');
let pauseBtn = document.getElementById('pauseBtn');
let resumeBtn = document.getElementById('resumeBtn');
let restartBtn = document.getElementById('restartBtn');
let snake = [];
let snakeLength = 1;
let gameInterval;
let gameRunning = false;

// Инициализация игры
function initGame() {
    gameContainer.innerHTML = ''; // Очистка контейнера
    snake = [{ x: 200, y: 200 }];
    snakeLength = 1;
    gameRunning = false;
    drawSnake();
}

// Функция отрисовки змейки
function drawSnake() {
    gameContainer.innerHTML = ''; // Очистка предыдущего состояния
    snake.forEach(segment => {
        let snakePart = document.createElement('div');
        snakePart.style.position = 'absolute';
        snakePart.style.width = '20px';
        snakePart.style.height = '20px';
        snakePart.style.backgroundColor = 'green';
        snakePart.style.top = `${segment.y}px`;
        snakePart.style.left = `${segment.x}px`;
        gameContainer.appendChild(snakePart);
    });
}

// Функция старта игры
startBtn.addEventListener('click', () => {
    if (!gameRunning) {
        gameRunning = true;
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
        restartBtn.style.display = 'inline-block';
        runGame();
    }
});

// Функция паузы игры
pauseBtn.addEventListener('click', () => {
    clearInterval(gameInterval);
    gameRunning = false;
    pauseBtn.style.display = 'none';
    resumeBtn.style.display = 'inline-block';
});

// Функция продолжения игры
resumeBtn.addEventListener('click', () => {
    gameRunning = true;
    resumeBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
    runGame();
});

// Функция перезапуска игры
restartBtn.addEventListener('click', () => {
    initGame();
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    resumeBtn.style.display = 'none';
    restartBtn.style.display = 'none';
});

// Логика движения змейки и игры
function runGame() {
    gameInterval = setInterval(() => {
        if (gameRunning) {
            // Логика движения и проверки
            drawSnake();
        }
    }, 100); // Период обновления игры
}
