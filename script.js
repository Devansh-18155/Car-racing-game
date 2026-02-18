const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let currentScoreEl = document.getElementById("currentScore");
let highScoreEl = document.getElementById("highScore");

let highScore = localStorage.getItem("racingHighScore") || 0;
highScoreEl.textContent = highScore;

let player = {
  x: 175,
  y: 500,
  width: 50,
  height: 80,
  speed: 5
};

let enemies = [];
let score = 0;
let gameOver = false;

let baseSpeed = 2;
let maxSpeed = 7;

let spawnInterval = 1500;   // Start: 1.5 seconds between enemies
let minSpawnInterval = 400; // Never go faster than this
let lastSpawnTime = 0;

let gameStartTime = 0;

let keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function spawnEnemy() {
  if (enemies.length >= 2) return; // 🔥 LIMIT TO 2

  let x = Math.random() * (canvas.width - 50);

  enemies.push({
    x: x,
    y: -80,
    width: 50,
    height: 80
  });
}


  enemies.push({
    x: x,
    y: -80,
    width: 50,
    height: 80
  });


function drawRect(obj, color) {
  ctx.fillStyle = color;
  ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function updateDifficulty(elapsedTime) {
  let level = Math.floor(elapsedTime / 10);

  baseSpeed = 2 + level * 0.5;
  if (baseSpeed > maxSpeed) baseSpeed = maxSpeed;

  spawnInterval = 1500 - level * 150;
  if (spawnInterval < minSpawnInterval)
    spawnInterval = minSpawnInterval;
}

function gameLoop(timestamp) {
  if (gameOver) return;

  if (!gameStartTime) gameStartTime = timestamp;
  let elapsedTime = (timestamp - gameStartTime) / 1000;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateDifficulty(elapsedTime);
  if (timestamp - lastSpawnTime > spawnInterval) {
  spawnEnemy();
  lastSpawnTime = timestamp;
}


  // Player movement
  if (keys["ArrowLeft"] && player.x > 0)
    player.x -= player.speed;

  if (keys["ArrowRight"] && player.x < canvas.width - player.width)
    player.x += player.speed;

  drawRect(player, "lime");

  // TIME-BASED SPAWN (not random spam)
  if (timestamp - lastSpawnTime > spawnInterval) {
    spawnEnemy();
    lastSpawnTime = timestamp;
  }

  enemies.forEach((enemy, index) => {
    enemy.y += baseSpeed;
    drawRect(enemy, "red");

    if (isColliding(player, enemy)) {
      gameOver = true;
      alert("Game Over! Score: " + score);
    }

    if (enemy.y > canvas.height) {
  enemies.splice(index, 1);
  score++;

  currentScoreEl.textContent = score;

  // Update high score
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("racingHighScore", highScore);
    highScoreEl.textContent = highScore;
  }
}

  });

  requestAnimationFrame(gameLoop);
}

function restartGame() {
  enemies = [];
  score = 0;
  baseSpeed = 2;
  spawnInterval = 1500;
  gameStartTime = 0;
  lastSpawnTime = 0;
  gameOver = false;
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);






