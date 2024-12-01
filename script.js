document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const TILE_SIZE = 20;
  const TILE_COUNT_X = canvas.width / TILE_SIZE;
  const TILE_COUNT_Y = canvas.height / TILE_SIZE;

  let snake = [{ x: 10, y: 10 }];
  let direction = { x: 1, y: 0 };
  let food = { x: 15, y: 15 };
  let score = 0;
  let bestScore = localStorage.getItem("bestScore") || 0;
  let gameInterval;
  let isPaused = false;

  const updateScoreDisplay = () => {
    document.getElementById("currentScore").innerText = `Счёт: ${score}`;
    document.getElementById("bestScore").innerText = `Лучший счёт: ${bestScore}`;
  };

  const placeFood = () => {
    food = {
      x: Math.floor(Math.random() * TILE_COUNT_X),
      y: Math.floor(Math.random() * TILE_COUNT_Y),
    };
    // Проверяем, чтобы еда не появлялась внутри змейки
    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
      placeFood();
    }
  };

  const drawTile = (x, y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  };

  const drawSnake = () => {
    snake.forEach(segment => drawTile(segment.x, segment.y, "green"));
  };

  const drawFood = () => {
    drawTile(food.x, food.y, "red");
  };

  const updateSnakePosition = () => {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Выход за границы — появление с противоположной стороны
    head.x = (head.x + TILE_COUNT_X) % TILE_COUNT_X;
    head.y = (head.y + TILE_COUNT_Y) % TILE_COUNT_Y;

    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      endGame();
      return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score++;
      if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("bestScore", bestScore);
      }
      placeFood();
    } else {
      snake.pop();
    }
  };

  const gameLoop = () => {
    if (isPaused) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateSnakePosition();
    drawSnake();
    drawFood();
    updateScoreDisplay();
  };

  const startGame = () => {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };
    score = 0;
    placeFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 200);
  };

  const endGame = () => {
    clearInterval(gameInterval);
    alert("Игра окончена! Нажмите 'Начать', чтобы сыграть снова.");
  };

  document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -1 };
    else if (e.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 1 };
    else if (e.key === "ArrowLeft" && direction.x === 0) direction = { x: -1, y: 0 };
    else if (e.key === "ArrowRight" && direction.x === 0) direction = { x: 1, y: 0 };
  });

  document.getElementById("startButton").addEventListener("click", () => {
    isPaused = false;
    startGame();
  });

  document.getElementById("pauseButton").addEventListener("click", () => {
    isPaused = !isPaused;
  });

  updateScoreDisplay();
});
