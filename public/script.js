"use strict";
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let singlePlayer = true; // Set to true for single player mode
let redScore = 0;
let greenScore = 0;
let gameOver = false;
let winner;
canvas.width = 500; // px
canvas.height = 700; // px
const ballRadius = 5;
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
function drawLine() {
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.strokeStyle = 'white';
    ctx.stroke();
}
function drawScore() {
    ctx.font = '16px Courier New';
    ctx.fillStyle = 'white';
    if (!gameOver) {
        ctx.fillText(`RED: ${redScore}`, canvas.width / 2 - 225, 325);
        ctx.fillText(`GREEN: ${greenScore}`, canvas.width / 2 - 225, canvas.height - 315);
    }
    else {
        ctx.fillText(`Winner: ${winner}, Please refresh to start over`, canvas.width / 2 - 200, canvas.height / 2 - 25);
    }
}
function updateBall() {
    if (gameOver)
        return;
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    // Bounce off the walls
    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    }
    // Check if the player missed the ball
    if (ballY + ballRadius > canvas.height - paddleHeight) {
        if (ballX > bottomPaddleX && ballX < bottomPaddleX + paddleWidth) {
            // Collision detected, bounce the ball
            ballSpeedY = -ballSpeedY;
            // Adjust ball speed or angle if necessary
            increaseSpeedOnCornerHit(ballX, bottomPaddleX);
        }
        else {
            // No collision, reset the ball, update score
            resetBall();
            redScore++;
            if (redScore >= 10) {
                winner = 'RED';
                resetGame();
            }
            //set ball direction depending on who scores
            ballSpeedY = Math.abs(ballSpeedY);
        }
    }
    // Check if the computer or other player missed the ball
    if (ballY - ballRadius < paddleHeight) {
        if (ballX > topPaddleX && ballX < topPaddleX + paddleWidth) {
            // Collision detected, bounce the ball
            ballSpeedY = -ballSpeedY;
            // Adjust ball speed or angle if necessary
            increaseSpeedOnCornerHit(ballX, topPaddleX);
        }
        else {
            // missed, reset the ball, update score
            resetBall();
            greenScore++;
            if (greenScore >= 10) {
                winner = 'GREEN';
                resetGame();
            }
            //set ball direction depending on who scores
            ballSpeedY = -Math.abs(ballSpeedY);
        }
    }
    function increaseSpeedOnCornerHit(ballX, paddleX) {
        const leftEdge = paddleX;
        const rightEdge = paddleX + paddleWidth;
        const isCornerHit = ballX < leftEdge + 20 || ballX > rightEdge - 20;
        if (isCornerHit) {
            // Increase speed by a small factor
            paddleX *= 1.1;
            ballSpeedX *= 1.1;
            ballSpeedY *= 1.1;
        }
    }
}
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 3.5;
    ballSpeedY = 3.5;
    gameOver = redScore === 10 || greenScore === 10;
}
function resetGame() {
    gameOver = true;
    redScore = 0;
    greenScore = 0;
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
    // Move paddle based on ball's position
    if (ballX < topPaddleCenterX - 10) {
        topPaddleX -= 3.9;
    }
    else if (ballX > topPaddleCenterX + 10) {
        topPaddleX += 3.9;
    }
}
//ANIMATE
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before redrawing
    drawBall();
    drawPaddles();
    drawLine();
    updateBall();
    drawScore();
    singlePlayer && controlSinglePlayer();
    // Update paddle positions
    topPaddleX = Math.max(0, Math.min(topPaddleX, canvas.width - paddleWidth));
    bottomPaddleX = Math.max(0, Math.min(bottomPaddleX, canvas.width - paddleWidth));
}
animate();
