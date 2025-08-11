const canvas = document.getElementById('pong-canvas');
const ctx = canvas.getContext('2d');

// Configurations
const paddleWidth = 12;
const paddleHeight = 90;
const ballSize = 18; // diameter
const paddleSpeed = 9;

// Left paddle (Player)
let leftPaddle = {
  x: 0 + 12,
  y: canvas.height / 2 - paddleHeight / 2
};

// Right paddle (AI)
let rightPaddle = {
  x: canvas.width - paddleWidth - 12,
  y: canvas.height / 2 - paddleHeight / 2
};

// Ball
let ball = {
  x: canvas.width / 2 - ballSize / 2,
  y: canvas.height / 2 - ballSize / 2,
  vx: 6 * (Math.random() > 0.5 ? 1 : -1),
  vy: 5 * (Math.random() > 0.5 ? 1 : -1)
};

// Scores
let leftScore = 0;
let rightScore = 0;

// Mouse movement for left paddle
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  leftPaddle.y = mouseY - paddleHeight / 2;
  // Clamp within bounds
  leftPaddle.y = Math.max(0, Math.min(canvas.height - paddleHeight, leftPaddle.y));
});

// Main game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
  // Ball movement
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Wall collision (top/bottom)
  if (ball.y <= 0) {
    ball.y = 0;
    ball.vy *= -1;
  }
  if (ball.y + ballSize >= canvas.height) {
    ball.y = canvas.height - ballSize;
    ball.vy *= -1;
  }

  // Paddle collision (left)
  if (
    ball.x <= leftPaddle.x + paddleWidth &&
    ball.y + ballSize >= leftPaddle.y &&
    ball.y <= leftPaddle.y + paddleHeight
  ) {
    ball.x = leftPaddle.x + paddleWidth;
    ball.vx *= -1.05; // bounce & slightly speed up
    ball.vy += (Math.random() - 0.5) * 2;
  }

  // Paddle collision (right)
  if (
    ball.x + ballSize >= rightPaddle.x &&
    ball.y + ballSize >= rightPaddle.y &&
    ball.y <= rightPaddle.y + paddleHeight
  ) {
    ball.x = rightPaddle.x - ballSize;
    ball.vx *= -1.05;
    ball.vy += (Math.random() - 0.5) * 2;
  }

  // Score check
  if (ball.x < 0) {
    rightScore++;
    resetBall();
  }
  if (ball.x + ballSize > canvas.width) {
    leftScore++;
    resetBall();
  }

  // AI paddle movement (simple)
  let aiCenter = rightPaddle.y + paddleHeight / 2;
  if (aiCenter < ball.y + ballSize / 2) {
    rightPaddle.y += paddleSpeed;
  } else if (aiCenter > ball.y + ballSize / 2) {
    rightPaddle.y -= paddleSpeed;
  }
  // Clamp
  rightPaddle.y = Math.max(0, Math.min(canvas.height - paddleHeight, rightPaddle.y));
}

// Draw everything
function draw() {
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Middle line
  ctx.strokeStyle = '#fff';
  ctx.setLineDash([10, 15]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Left paddle
  ctx.fillStyle = '#09f';
  ctx.fillRect(leftPaddle.x, leftPaddle.y, paddleWidth, paddleHeight);

  // Right paddle
  ctx.fillStyle = '#f60';
  ctx.fillRect(rightPaddle.x, rightPaddle.y, paddleWidth, paddleHeight);

  // Ball
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(ball.x + ballSize / 2, ball.y + ballSize / 2, ballSize / 2, 0, Math.PI * 2);
  ctx.fill();

  // Scores
  ctx.font = '42px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText(leftScore, canvas.width * 0.25, 60);
  ctx.fillText(rightScore, canvas.width * 0.75, 60);
}

// Reset ball to center
function resetBall() {
  ball.x = canvas.width / 2 - ballSize / 2;
  ball.y = canvas.height / 2 - ballSize / 2;
  ball.vx = 6 * (Math.random() > 0.5 ? 1 : -1);
  ball.vy = 5 * (Math.random() > 0.5 ? 1 : -1);
}

gameLoop();
