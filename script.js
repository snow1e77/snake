const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startGameButton');
const pauseButton = document.getElementById('pauseButton');
const restartButton = document.getElementById('restartButton');
const scoreDisplay = document.getElementById('score');

let gameInterval;
let isGameRunning = false;
let isGamePaused = false;
let score = 0;

const game = {
    snake: [{ x: 160, y: 160 }],
    direction: 'right',
    food: { x: 80, y: 80 },
    speed: 200,
};

function startGame() {
    if (!isGameRunning) {
        resetGame();
        gameInterval = setInterval(updateGame, game.speed);
        isGameRunning = true;
        startButton.disabled = true;
        pauseButton.disabled = false;
        restartButton.disabled = false;
    }
}

function pauseGame() {
    if (isGameRunning) {
        clearInterval(gameInterval);
        isGamePaused = true;
        pauseButton.disabled = true;
        restartButton.disabled = false;
    }
}

function restartGame() {
    if (isGamePaused || !isGameRunning) {
        resetGame();
        startGame();
    }
}

function resetGame() {
    game.snake = [{ x: 160, y: 160 }];
    game.direction = 'right';
    game.food = { x: 80, y: 80 };
    score = 0;
    scoreDisplay.textContent = 'Счет: 0';
    isGameRunning = false;
    isGamePaused = false;
}

function updateGame() {
    if (!isGameRunning) return;

    moveSnake();
    checkCollision();
    checkFood();
    drawGame();
}

function moveSnake() {
    let head = { ...game.snake[0] };

    switch (game.direction) {
        case 'up': head.y -= 20; break;
        case 'down': head.y += 20; break;
        case 'left': head.x -= 20; break;
        case 'right': head.x += 20; break;
    }

    if (head.x < 0) head.x = canvas.width - 20;
    if (head.y < 0) head.y = canvas.height - 20;
    if (head.x >= canvas.width) head.x = 0;
    if (head.y >= canvas.height) head.y = 0;

    game.snake.unshift(head);
    game.snake.pop();
}

function checkCollision() {
    const head = game.snake[0];
    for (let i = 1; i < game.snake.length; i++) {
        if (head.x === game.snake[i].x && head.y === game.snake[i].y) {
            clearInterval(gameInterval);
            isGameRunning = false;
            alert('Игра окончена! Ваш счет: ' + score);
            startButton.disabled = false;
            pauseButton.disabled = true;
            restartButton.disabled = true;
            return;
        }
    }
}

function checkFood() {
    const head = game.snake[0];
    if (head.x === game.food.x && head.y === game.food.y) {
        score += 10;
        scoreDisplay.textContent = 'Счет: ' + score;
        game.snake.push({});
        placeFood();
    }
}

function placeFood() {
    const x = Math.floor(Math.random() * (canvas.width / 20)) * 20;
    const y = Math.floor(Math.random() * (canvas.height / 20)) * 20;
    game.food = { x, y };
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'green';
    game.snake.forEach(part => {
        ctx.fillRect(part.x, part.y, 20, 20);
    });

    ctx.fillStyle = 'red';
    ctx.fillRect(game.food.x, game.food.y, 20, 20);
}

document.addEventListener('keydown', (e) => {
    if (!isGameRunning) return;

    switch (e.key) {
        case 'ArrowUp': if (game.direction !== 'down') game.direction = 'up'; break;
        case 'ArrowDown': if (game.direction !== 'up') game.direction = 'down'; break;
        case 'ArrowLeft': if (game.direction !== 'right') game.direction = 'left'; break;
        case 'ArrowRight': if (game.direction !== 'left') game.direction = 'right'; break;
    }
});
