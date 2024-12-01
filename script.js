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

// Function to start the game
function startGame() {
    document.addEventListener('keydown', changeDirection);
    generateFood();
    gameInterval = setInterval(update, 150); // Adjust speed here (lower value = faster)
}

// Function to change the snake's direction
function changeDirection(event) {
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

// Function to update the game state
function update() {
    if (gameOver) return;

    // Move the snake
    const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // Check for collisions with the walls
    if (newHead.x < 0 || newHead.x >= canvas.width || newHead.y < 0 || newHead.y >= canvas.height) {
        endGame();
        return;
    }

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
}

// Start the game
startGame();
