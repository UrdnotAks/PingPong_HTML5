class Ball{
    x: number;
    y: number;
    radius: number;
    velX: number;
    velY: number;
    speed: number;
    color: string;

    constructor(){
        this.x = canvas.width / 2;
        this.y = canvas.height / 2 + 25;
        this.radius = 10;
        this.velX = 5;
        this.velY = 5;
        this.speed = 7;
        this.color = "WHITE";
    }

    draw(): void{
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

    resetBall(): void{
        this.x = canvas.width / 2;
        this.y = canvas.height / 2 + 25;
        this.velX = -this.velX;
        this.speed = 7;
    }

    move(): void{
        this.x += this.velX;
        this.y += this.velY;
    }

    inverseX(): void{
        this.velX = -this.velX;
    }

    changeDirection(direction: number, angle: number): void{
        this.velX = this.speed * Math.sin(angle);
        this.velY = direction * this.speed * Math.cos(angle);
    }

    updateSpeed(): void{
        this.speed += 0.2;
    }
}


class Player{
    x: number;
    y: number;
    width: number;
    height: number;
    score: number;
    color: string;
    offset: number;

    constructor(){
        this.offset = 15;
        this.width = 100;
        this.height = 10;
        this.x = (canvas.width - this.width) / 2;
        this.y = canvas.height - this.height - this.offset;
        this.score = 0;
        this.color = "WHITE";
    }

    draw(): void{
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(pos: number): void{
        this.x = pos;
    }

    reset(): void{
        this.x = (canvas.width - this.width) / 2;
        this.y = canvas.height - this.height - this.offset; 
    }
}


class Com{
    x: number;
    y: number;
    width: number;
    height: number;
    score: number;
    color: string;
    offset: number;
    speedLevel: number;
    speedFactor: number[];

    constructor(){
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

    draw(): void{
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(ballX: number): void{
        let speedMod: number = this.speedFactor[this.speedLevel];
        if(this.x > 10 && this.x+this.width < canvas.width-10){
            this.x += (ballX - (this.x + this.width/2)) * speedMod;
        }
        else if(this.x < 10){
            this.x += 5;
        }
        else if(this.x+this.width > canvas.width-10){
            this.x -= 5;
        }
    }
    
    updateSpeed(index: number): void{
        this.speedLevel = index;
    }
}


class Net{
    x: number;
    y: number;
    height: number;
    width: number;
    color: string;

    constructor(x: number){
        this.x = x;
        this.y = ((canvas.height - 2) / 2) + 25;
        this.height = 2;
        this.width = 10;
        this.color = "WHITE";
    }

    draw(): void{
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}


function getMousePos(event: MouseEvent): void{
    let relativeX: number = event.clientX - canvas.offsetLeft - player.width/2;
    if(relativeX > 10 && (relativeX+100) < canvas.width-10)
    {
        player.move(relativeX);
    }

}


function drawNet(): void{
    for(let i: number = 0; i <= canvas.width; i += 15){
        let obj: Net = new Net(i);
        obj.draw();
    }
}


function drawScore(): void{
    ctx.fillStyle = "#FFF";
    ctx.font = "20px fantasy";
    ctx.textAlign = "center";
    ctx.fillText("Player: " + player.score.toString(), canvas.width/4, 25);
    ctx.fillText("Com: " + com.score.toString(), 3*canvas.width/4, 25);
}


function gameOver(): void{
        image = restartButton;
        gameState = "gameOver";
}


function collision(ball: Ball, paddle: Player | Com){
    let paddleTop: number = paddle.y;
    let paddleBottom: number = paddle.y + paddle.height;
    let paddleLeft: number = paddle.x;
    let paddleRight: number = paddle.x + paddle.width;

    let ballTop = ball.y - ball.radius;
    let ballBottom = ball.y + ball.radius;
    let ballLeft = ball.x - ball.radius;
    let ballRight = ball.x + ball.radius;

    let collisionInfo: boolean = paddleLeft < ballRight && paddleRight > ballLeft && paddleBottom > ballTop && paddleTop < ballBottom;
    return collisionInfo;
}


function update(): void{
    let paddle: Player | Com;
    if(ball.y + ball.radius > canvas.height / 2){
        paddle = player;
    }
    else{
        paddle = com;
    }

    if(collision(ball, paddle)){
        hit.play();
        let collidePoint: number = (ball.x - (paddle.x + paddle.width/2));
        collidePoint /= (paddle.width / 2) ;

        let angle: number = (Math.PI/4) * collidePoint;

        let direction: number;
        if(ball.y + ball.radius < canvas.height/2){
            direction = 1;
        }
        else{
            direction = -1;
        }

        ball.changeDirection(direction, angle);

        ball.updateSpeed();
    }

    if(ball.y + ball.radius > canvas.height - 10){
        com.score++;
        comScore.play();
        gameState = "paused";
        ball.resetBall();
        player.reset();
        comScored += 1;
        playerScored = 0;
        if(comScored > 1 && scoreCounter > 0){
            scoreCounter--;
            com.updateSpeed(scoreCounter);
        }
    }

    else if(ball.y - ball.radius < 50){
        player.score++;
        playerScore.play();
        ball.resetBall();
        playerScored += 1;
        comScored = 0;
        if(playerScored > 1 && scoreCounter < 4){
            scoreCounter++;
            com.updateSpeed(scoreCounter);
        }
    }
    
    ball.move();

    com.move(ball.x);

    if(ball.x - ball.radius < 10 || ball.x + ball.radius > canvas.width-10){
        ball.inverseX();
        wall.play();
    }

    if(player.score == 10){
        winner = "player";
        gameOver();
    }
    
    if(com.score == 10){
        winner = "com";
        gameOver();
    }
    
}


function render(): void{
    if(gameState == "gameOver"){
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#FFF";
        ctx.font = "75px fantasy";
        ctx.textAlign = "center"

        if(winner == "player"){
            ctx.fillText("!!! YOU WON !!!", canvas.width/2, canvas.height/2);
        }

        else{
            ctx.fillText("!!! YOU LOST !!!", canvas.width/2, canvas.height/2);
        }

        ctx.font = "25px fantasy";
        ctx.textAlign = "center";
        ctx.fillText("Tap to Restart", canvas.width/2-32, canvas.height/2-32 + 100);
    }

    else{
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 2;
        ctx.rect(10, 60, canvas.width-20, canvas.height-70);
        ctx.stroke();
        ctx.closePath();

        drawScore();

        drawNet();

        player.draw();

        com.draw();

        ball.draw();

        if(gameState != "running"){
            ctx.drawImage(image, canvas.width/2-32, canvas.height/2-32+25);
        }
    }   
}


function restartGame(): void{
    init(); 
}


function loop(): void{

    if(gameState == "running"){
        update();
    }
    
    render();

    requestAnimationFrame(loop);

    now = Date.now();
    delta = now - then;

    if(delta > interval){
        then = now - (delta % interval);
    }

}


function mouseClickHandler(event: MouseEvent): void{
    var relativeX: number = event.clientX - canvas.offsetLeft;
    var relativeY: number = event.clientY - canvas.offsetTop;

    if(gameState == "gameOver"){
        init();
    }
    else if( (relativeX > canvas.width/2-32 && relativeX < canvas.width/2+32 && relativeY > canvas.height/2-32+25 && relativeY < canvas.height/2+64+25) && gameState == "paused" ){
        gameState = "running"
    }
        
        
    
}


function init(): void{
    document.addEventListener("mousemove", getMousePos, false);
    document.addEventListener("mousedown", mouseClickHandler, false);

    image = startButton;

    gameState = "paused";
    
    player = new Player();
    com = new Com();
    ball = new Ball();

    fps= 60;
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


let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

let hit: HTMLAudioElement;
let wall: HTMLAudioElement;
let playerScore: HTMLAudioElement;
let comScore: HTMLAudioElement;

let player: Player;
let com: Com;
let ball: Ball;
let fps: number;
let now: any;
let then: any;
let interval: number;
let delta: any;

let playerScored: number;
let comScored: number;
let scoreCounter: number;

let winner: string;

let gameState: string;
let startButton: HTMLImageElement;
let restartButton: HTMLImageElement;
let image: HTMLImageElement;

canvas  = <HTMLCanvasElement>document.getElementById("gameCanvas");
ctx = canvas.getContext("2d");

startButton = <HTMLImageElement>document.getElementById("start");
restartButton = <HTMLImageElement>document.getElementById("restart");

init();
loop();
