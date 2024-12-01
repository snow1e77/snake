document.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.getElementById("game-board");
    const scoreDisplay = document.getElementById("score");
    const highScoreDisplay = document.getElementById("high-score");
    const startButton = document.getElementById("start-btn");
    const pauseButton = document.getElementById("pause-btn");
    const restartButton = document.getElementById("restart-btn");

    const boardSize = 20; // Размер игрового поля
    const initialSnake = [{ x: 10, y: 10 }];
    const directions = { ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 } };

    let snake = [...initialSnake];
    let food = generateFoodPosition();
    let currentDirection = null; // Изменено: Змейка не двигается вначале
    let nextDirection = null;
    let score = 0;
    let highScore = 0;
    let gameInterval;
    let isPaused = true;

    function generateFoodPosition() {
        let position;
        do {
            position = {
                x: Math.floor(Math.random() * boardSize),
                y: Math.floor(Math.random() * boardSize),
            };
        } while (snake.some(segment => segment.x === position.x && segment.y === position.y));
        return position;
    }

    function draw() {
        gameBoard.innerHTML = ""; // Очистка поля
        snake.forEach(segment => {
            const segmentElement = document.createElement("div");
            segmentElement.style.gridRowStart = segment.y + 1;
            segmentElement.style.gridColumnStart = segment.x + 1;
            segmentElement.classList.add("snake");
            gameBoard.appendChild(segmentElement);
        });

        const foodElement = document.createElement("div");
        foodElement.style.gridRowStart = food.y + 1;
        foodElement.style.gridColumnStart = food.x + 1;
        foodElement.classList.add("food");
        gameBoard.appendChild(foodElement);
    }

    function moveSnake() {
        if (!currentDirection) return; // Змейка не двигается без направления

        const head = { x: snake[0].x + currentDirection.x, y: snake[0].y + currentDirection.y };

        // Выход за границы - телепортация
        head.x = (head.x + boardSize) % boardSize;
        head.y = (head.y + boardSize) % boardSize;

        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            endGame();
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score += 1;
            updateScore();
            food = generateFoodPosition();
        } else {
            snake.pop();
        }
    }

    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}`;
        if (score > highScore) {
            highScore = score;
            highScoreDisplay.textContent = `High Score: ${highScore}`;
        }
    }

    function endGame() {
        clearInterval(gameInterval);
        alert(`Game Over! Final Score: ${score}`);
        snake = [...initialSnake];
        food = generateFoodPosition();
        score = 0;
        updateScore();
        isPaused = true;
        pauseButton.disabled = true;
        startButton.disabled = false;
        currentDirection = null; // Сброс направления
    }

    function gameLoop() {
        moveSnake();
        draw();
    }

    function startGame() {
        if (!isPaused) return;
        isPaused = false;
        nextDirection = directions.ArrowRight; // Начальное направление
        currentDirection = nextDirection;
        gameInterval = setInterval(gameLoop, 200);
        startButton.disabled = true;
        pauseButton.disabled = false;
        restartButton.disabled = false;
    }

    function pauseGame() {
        if (isPaused) return;
        isPaused = true;
        clearInterval(gameInterval);
        startButton.disabled = false;
    }

    function restartGame() {
        endGame();
        startGame();
    }

    document.addEventListener("keydown", (e) => {
        if (directions[e.key]) {
            const newDirection = directions[e.key];
            if (!currentDirection || (newDirection.x !== -currentDirection.x && newDirection.y !== -currentDirection.y)) {
                nextDirection = newDirection;
                currentDirection = nextDirection;
            }
        }
    });

    startButton.addEventListener("click", startGame);
    pauseButton.addEventListener("click", pauseGame);
    restartButton.addEventListener("click", restartGame);

    draw();
    updateScore();
});
