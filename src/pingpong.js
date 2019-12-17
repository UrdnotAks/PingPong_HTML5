var Ball = /** @class */ (function () {
    function Ball() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2 + 25;
        this.radius = 10;
        this.velX = 5;
        this.velY = 5;
        this.speed = 7;
        this.color = "WHITE";
    }
    Ball.prototype.draw = function () {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    };
    Ball.prototype.resetBall = function () {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2 + 25;
        this.velX = -this.velX;
        this.speed = 7;
    };
    Ball.prototype.move = function () {
        this.x += this.velX;
        this.y += this.velY;
    };
    Ball.prototype.inverseX = function () {
        this.velX = -this.velX;
    };
    Ball.prototype.changeDirection = function (direction, angle) {
        this.velX = this.speed * Math.sin(angle);
        this.velY = direction * this.speed * Math.cos(angle);
    };
    Ball.prototype.updateSpeed = function () {
        this.speed += 0.2;
    };
    return Ball;
}());
var Player = /** @class */ (function () {
    function Player() {
        this.offset = 15;
        this.width = 100;
        this.height = 10;
        this.x = (canvas.width - this.width) / 2;
        this.y = canvas.height - this.height - this.offset;
        this.score = 0;
        this.color = "WHITE";
    }
    Player.prototype.draw = function () {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    Player.prototype.move = function (pos) {
        this.x = pos;
    };
    Player.prototype.reset = function () {
        this.x = (canvas.width - this.width) / 2;
        this.y = canvas.height - this.height - this.offset;
    };
    return Player;
}());
var Com = /** @class */ (function () {
    function Com() {
        this.offset = 65;
        this.width = 100;
        this.height = 10;
        this.x = (canvas.width - this.width) / 2;
        this.y = this.offset;
        this.score = 0;
        this.color = "WHITE";
        this.speedFactor = [0.09, 0.095, 0.1, 0.15, 0.2];
        this.speedLevel = 2;
    }
    Com.prototype.draw = function () {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    Com.prototype.move = function (ballX) {
        var speedMod = this.speedFactor[this.speedLevel];
        if (this.x > 10 && this.x + this.width < canvas.width - 10) {
            this.x += (ballX - (this.x + this.width / 2)) * speedMod;
        }
        else if (this.x < 10) {
            this.x += 5;
        }
        else if (this.x + this.width > canvas.width - 10) {
            this.x -= 5;
        }
    };
    Com.prototype.updateSpeed = function (index) {
        this.speedLevel = index;
    };
    return Com;
}());
var Net = /** @class */ (function () {
    function Net(x) {
        this.x = x;
        this.y = ((canvas.height - 2) / 2) + 25;
        this.height = 2;
        this.width = 10;
        this.color = "WHITE";
    }
    Net.prototype.draw = function () {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    return Net;
}());
function getMousePos(event) {
    var relativeX = event.clientX - canvas.offsetLeft - player.width / 2;
    if (relativeX > 10 && (relativeX + 100) < canvas.width - 10) {
        player.move(relativeX);
    }
}
function drawNet() {
    for (var i = 0; i <= canvas.width; i += 15) {
        var obj = new Net(i);
        obj.draw();
    }
}
function drawScore() {
    ctx.fillStyle = "#FFF";
    ctx.font = "20px fantasy";
    ctx.textAlign = "center";
    ctx.fillText("Player: " + player.score.toString(), canvas.width / 4, 25);
    ctx.fillText("Com: " + com.score.toString(), 3 * canvas.width / 4, 25);
}
function gameOver() {
    image = restartButton;
    gameState = "gameOver";
}
function collision(ball, paddle) {
    var paddleTop = paddle.y;
    var paddleBottom = paddle.y + paddle.height;
    var paddleLeft = paddle.x;
    var paddleRight = paddle.x + paddle.width;
    var ballTop = ball.y - ball.radius;
    var ballBottom = ball.y + ball.radius;
    var ballLeft = ball.x - ball.radius;
    var ballRight = ball.x + ball.radius;
    var collisionInfo = paddleLeft < ballRight && paddleRight > ballLeft && paddleBottom > ballTop && paddleTop < ballBottom;
    return collisionInfo;
}
function update() {
    var paddle;
    if (ball.y + ball.radius > canvas.height / 2) {
        paddle = player;
    }
    else {
        paddle = com;
    }
    if (collision(ball, paddle)) {
        hit.play();
        var collidePoint = (ball.x - (paddle.x + paddle.width / 2));
        collidePoint /= (paddle.width / 2);
        var angle = (Math.PI / 4) * collidePoint;
        var direction = void 0;
        if (ball.y + ball.radius < canvas.height / 2) {
            direction = 1;
        }
        else {
            direction = -1;
        }
        ball.changeDirection(direction, angle);
        ball.updateSpeed();
    }
    if (ball.y + ball.radius > canvas.height - 10) {
        com.score++;
        comScore.play();
        gameState = "paused";
        ball.resetBall();
        player.reset();
        comScored += 1;
        playerScored = 0;
        if (comScored > 1 && scoreCounter > 0) {
            scoreCounter--;
            com.updateSpeed(scoreCounter);
        }
    }
    else if (ball.y - ball.radius < 50) {
        player.score++;
        playerScore.play();
        ball.resetBall();
        playerScored += 1;
        comScored = 0;
        if (playerScored > 1 && scoreCounter < 4) {
            scoreCounter++;
            com.updateSpeed(scoreCounter);
        }
    }
    ball.move();
    com.move(ball.x);
    if (ball.x - ball.radius < 10 || ball.x + ball.radius > canvas.width - 10) {
        ball.inverseX();
        wall.play();
    }
    if (player.score == 10) {
        winner = "player";
        gameOver();
    }
    if (com.score == 10) {
        winner = "com";
        gameOver();
    }
}
function render() {
    if (gameState == "gameOver") {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#FFF";
        ctx.font = "75px fantasy";
        ctx.textAlign = "center";
        if (winner == "player") {
            ctx.fillText("!!! YOU WON !!!", canvas.width / 2, canvas.height / 2);
        }
        else {
            ctx.fillText("!!! YOU LOST !!!", canvas.width / 2, canvas.height / 2);
        }
        ctx.font = "25px fantasy";
        ctx.textAlign = "center";
        ctx.fillText("Tap to Restart", canvas.width / 2 - 32, canvas.height / 2 - 32 + 100);
    }
    else {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 2;
        ctx.rect(10, 60, canvas.width - 20, canvas.height - 70);
        ctx.stroke();
        ctx.closePath();
        drawScore();
        drawNet();
        player.draw();
        com.draw();
        if (gameState == "running") {
            ball.draw();
        }
        if (gameState != "running") {
            ctx.drawImage(image, canvas.width / 2 - 32, canvas.height / 2 - 32 + 25);
        }
    }
}
function restartGame() {
    init();
}
function loop() {
    if (gameState == "running") {
        update();
    }
    render();
    requestAnimationFrame(loop);
    now = Date.now();
    delta = now - then;
    if (delta > interval) {
        then = now - (delta % interval);
    }
}
function mouseClickHandler(event) {
    var relativeX = event.clientX - canvas.offsetLeft;
    var relativeY = event.clientY - canvas.offsetTop;
    if (gameState == "gameOver") {
        init();
    }
    else if ((relativeX > canvas.width / 2 - 32 && relativeX < canvas.width / 2 + 32 && relativeY > canvas.height / 2 - 32 + 25 && relativeY < canvas.height / 2 + 64 + 25) && gameState == "paused") {
        gameState = "running";
    }
}
function init() {
    document.addEventListener("mousemove", getMousePos, false);
    document.addEventListener("mousedown", mouseClickHandler, false);
    image = startButton;
    gameState = "paused";
    player = new Player();
    com = new Com();
    ball = new Ball();
    fps = 60;
    then = Date.now();
    interval = 1000 / fps;
    hit = new Audio();
    wall = new Audio();
    comScore = new Audio();
    playerScore = new Audio();
    hit.src = "sounds/hit.mp3";
    wall.src = "sounds/wall.mp3";
    comScore.src = "sounds/comScore.mp3";
    playerScore.src = "sounds/playerScore.mp3";
    playerScored = 0;
    comScored = 0;
    scoreCounter = 2;
}
var canvas;
var ctx;
var hit;
var wall;
var playerScore;
var comScore;
var player;
var com;
var ball;
var fps;
var now;
var then;
var interval;
var delta;
var playerScored;
var comScored;
var scoreCounter;
var winner;
var gameState;
var startButton;
var restartButton;
var image;
canvas = document.getElementById("gameCanvas");
ctx = canvas.getContext("2d");
startButton = document.getElementById("start");
restartButton = document.getElementById("restart");
init();
loop();
