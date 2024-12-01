const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
let snake = [{ x: 160, y: 160 }];
let direction = 'right';
let gameInterval;
let gameRunning = false;

function startGame() {
    snake = [{ x: 160, y: 160 }];
    direction = 'right';
    gameRunning = true;
    document.getElementById('startGame').disabled = true;
    document.getElementById('pauseGame').style.display = 'inline-block';
    document.getElementById('resumeGame').style.display = 'none';
    gameInterval = setInterval(updateGame, 100);
}

function pauseGame() {
    clearInterval(gameInterval);
    gameRunning = false;
    document.getElementById('pauseGame').style.display = 'none';
    document.getElementById('resumeGame').style.display = 'inline-block';
}

function resumeGame() {
    gameRunning = true;
    document.getElementById('pauseGame').style.display = 'inline-block';
    document.getElementById('resumeGame').style.display = 'none';
    gameInterval = setInterval(updateGame, 100);
}

function updateGame() {
    const head = { ...snake[0] };

    switch (direction) {
        case 'up': head.y -= gridSize; break;
        case 'down': head.y += gridSize; break;
        case 'left': head.x -= gridSize; break;
        case 'right': head.x += gridSize; break;
    }

    // Проверка выхода за границы и "выход" на противоположную сторону
    if (head.x < 0) head.x = canvas.width - gridSize;
    if (head.x >= canvas.width) head.x = 0;
    if (head.y < 0) head.y = canvas.height - gridSize;
    if (head.y >= canvas.height) head.y = 0;

    // Проверка на столкновение с телом змейки
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);
    snake.pop();
    drawGame();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
}

function gameOver() {
    clearInterval(gameInterval);
    gameRunning = false;
    alert('Игра окончена!');
    document.getElementById('startGame').disabled = false;
    document.getElementById('pauseGame').style.display = 'none';
    document.getElementById('resumeGame').style.display = 'none';
}

// Управление с клавиатуры
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});
