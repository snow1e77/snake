// Canvas setup
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const gridSize = 20; // Size of one grid cell
let snake = [
    { x: 160, y: 160 },
    { x: 140, y: 160 },
    { x: 120, y: 160 }
];
let food = { x: 0, y: 0 };
let direction = { x: gridSize, y: 0 }; // Initial movement to the right
let gameInterval;
let gameOver = false;
let isPaused = false;

// Button references
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeBtn');

// Event listeners for buttons
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
resumeBtn.addEventListener('click', resumeGame);

// Function to start the game
function startGame() {
    if (gameInterval) clearInterval(gameInterval);
    snake = [
        { x: 160, y: 160 },
        { x: 140, y: 160 },
        { x: 120, y: 160 }
    ];
    direction = { x: gridSize, y: 0 };
    gameOver = false;
    isPaused = false;
    generateFood();
    gameInterval = setInterval(update, 150);
    document.addEventListener('keydown', changeDirection);
    startBtn.disabled = true;
    pauseBtn.disabled = false;
}

// Function to change the snake's direction
function changeDirection(event) {
    if (isPaused || gameOver) return;

    if (event.key === 'ArrowUp' && direction.y === 0) {
        direction = { x: 0, y: -gridSize };
    } else if (event.key === 'ArrowDown' && direction.y === 0) {
        direction = { x: 0, y: gridSize };
    } else if (event.key === 'ArrowLeft' && direction.x === 0) {
        direction = { x: -gridSize, y: 0 };
    } else if (event.key === 'ArrowRight' && direction.x === 0) {
        direction = { x: gridSize, y: 0 };
    }
}

// Function to pause the game
function pauseGame() {
    if (!isPaused) {
        clearInterval(gameInterval);
        isPaused = true;
        pauseBtn.disabled = true;
        resumeBtn.disabled = false;
    }
}

// Function to resume the game
function resumeGame() {
    if (isPaused) {
        gameInterval = setInterval(update, 150);
        isPaused = false;
        pauseBtn.disabled = false;
        resumeBtn.disabled = true;
    }
}

// Function to update the game state
function update() {
    if (gameOver || isPaused) return;

    // Move the snake
    const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // Check for collisions with the walls (wrap around)
    if (newHead.x < 0) newHead.x = canvas.width - gridSize;
    if (newHead.x >= canvas.width) newHead.x = 0;
    if (newHead.y < 0) newHead.y = canvas.height - gridSize;
    if (newHead.y >= canvas.height) newHead.y = 0;

    // Check for collisions with itself
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        endGame();
        return;
    }

    snake.unshift(newHead);

    // Check if the snake has eaten the food
    if (newHead.x === food.x && newHead.y === food.y) {
        generateFood();
    } else {
        snake.pop();
    }

    draw();
}

// Function to draw the snake and the food
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'green';
    snake.forEach(segment => {
        context.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    context.fillStyle = 'red';
    context.fillRect(food.x, food.y, gridSize, gridSize);
}

// Function to generate food at a random location
function generateFood() {
    let x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    let y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;

    // Ensure food doesn't appear on the snake
    while (snake.some(segment => segment.x === x && segment.y === y)) {
        x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
        y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
    }

    food = { x, y };
}

// Function to end the game
function endGame() {
    clearInterval(gameInterval);
    gameOver = true;
    context.fillStyle = 'black';
    context.font = '30px Arial';
    context.fillText('Game Over!', canvas.width / 2 - 70, canvas.height / 2);
    startBtn.disabled = false;
}
