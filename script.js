const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 20;
const ROWS = 20;
const COLS = 20;
canvas.width = TILE_SIZE * COLS;
canvas.height = TILE_SIZE * ROWS;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;
let bestScore = localStorage.getItem("bestScore") || 0;
let gameInterval = null;

const scoreDisplay = document.getElementById("score");
const bestScoreDisplay = document.getElementById("best-score");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

bestScoreDisplay.textContent = bestScore;

function drawTile(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function drawSnake() {
  snake.forEach(segment => drawTile(segment.x, segment.y, "lime"));
}

function drawFood() {
  drawTile(food.x, food.y, "red");
}

function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  head.x = (head.x + COLS) % COLS;
  head.y = (head.y + ROWS) % ROWS;

  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = score;
    placeFood();
  } else {
    snake.pop();
  }
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * COLS),
    y: Math.floor(Math.random() * ROWS),
  };

  if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
    placeFood();
  }
}

function gameOver() {
  clearInterval(gameInterval);
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
    bestScoreDisplay.textContent = bestScore;
  }
  alert("Game Over! Your score: " + score);
  resetGame();
}

function resetGame() {
  clearInterval(gameInterval);
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  score = 0;
  scoreDisplay.textContent = score;
  placeFood();
  drawGame();
  pauseBtn.disabled = true;
  resetBtn.disabled = true;
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawFood();
}

function startGame() {
  resetGame();
  pauseBtn.disabled = false;
  resetBtn.disabled = false;
  gameInterval = setInterval(() => {
    moveSnake();
    drawGame();
  }, 200);
}

function togglePause() {
  if (gameInterval) {
    clearInterval(gameInterval);
    gameInterval = null;
    pauseBtn.textContent = "Resume";
  } else {
    gameInterval = setInterval(() => {
      moveSnake();
      drawGame();
    }, 200);
    pauseBtn.textContent = "Pause";
  }
}

startBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", togglePause);
resetBtn.addEventListener("click", () => {
  clearInterval(gameInterval);
  resetGame();
});
document.addEventListener("keydown", event => {
  const keyMap = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
  };
  if (keyMap[event.key]) {
    const newDirection = keyMap[event.key];
    if (snake.length > 1 &&
      snake[0].x + newDirection.x === snake[1].x &&
      snake[0].y + newDirection.y === snake[1].y) {
      return;
    }
    direction = newDirection;
  }
});
