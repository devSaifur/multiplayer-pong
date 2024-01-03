"use strict";
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let singlePlayer = true; // Set to true for single player mode
canvas.width = 500; // px
canvas.height = 700; // px
const ballRadius = 7;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 3.5;
let ballSpeedY = 3.5;
const paddleWidth = 60;
const paddleHeight = 10;
let topPaddleX = canvas.width / 2 - paddleWidth / 2;
let bottomPaddleX = canvas.width / 2 - paddleWidth / 2;
// CANVAS
function drawBall() {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fill();
}
function drawPaddles() {
    ctx.fillStyle = 'white';
    // Left paddle
    ctx.fillRect(topPaddleX, 0, paddleWidth, paddleHeight);
    // Right paddle (adjust for canvas width)
    ctx.fillRect(bottomPaddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
}
// Function to update the ball's position
function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    // Bounce off the walls
    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    }
}
// CONTROL
document.addEventListener('keydown', keyControl);
function keyControl(event) {
    switch (event.key) {
        case 'ArrowLeft':
            bottomPaddleX -= 15; // Move left
            break;
        case 'ArrowRight':
            bottomPaddleX += 15; // Move right
            break;
    }
}
document.addEventListener('mousemove', mouseControl);
function mouseControl(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left; // Get mouse position relative to canvas
    bottomPaddleX = mouseX - paddleWidth / 2; // Center bottom paddle under mouse
    // Keep bottom paddle within canvas boundaries
    bottomPaddleX = Math.max(0, Math.min(bottomPaddleX, canvas.width - paddleWidth));
}
function controlSinglePlayer() {
    const topPaddleCenterX = topPaddleX + paddleWidth / 2;
    // If the ball is to the left of the paddle, move left
    if (ballX < topPaddleCenterX - 10) {
        topPaddleX -= 3.5;
    }
    // If the ball is to the right of the paddle, move right
    else if (ballX > topPaddleCenterX + 10) {
        topPaddleX += 3.5;
    }
}
//ANIMATE
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before redrawing
    drawBall();
    drawPaddles();
    updateBall();
    singlePlayer && controlSinglePlayer();
    // Update paddle positions
    topPaddleX = Math.max(0, Math.min(topPaddleX, canvas.width - paddleWidth));
    bottomPaddleX = Math.max(0, Math.min(bottomPaddleX, canvas.width - paddleWidth));
}
animate();
