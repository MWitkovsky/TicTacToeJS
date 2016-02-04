/**
 * Created by Michael Witkovsky on 2/4/2016.
 */

//Canvas Variables
var canvasWidth;
var canvasHeight;
var canvas;
var canvas2D;

//Update Variables
var fps;
var time;
var timer;
var go;

var game;

function init() {
    canvasWidth = 800;
    canvasHeight = 800;
    canvas = document.getElementById("myCanvas");
    canvas.addEventListener("mousedown", mouseDown, false);
    canvas2D = canvas.getContext("2d");

    canvas2D.fillStyle = "#FF0000";
    window.addEventListener('load', init, false);

    initBoard();

    fps = 30;
    timer = null;
    go = true;
    updateFPS();
}

function initBoard(){
    //init game board
    game = new Array(3);
    game[0] = new Array(3);
    game[1] = new Array(3);
    game[2] = new Array(3);

    for(var i=0; i<3; i++){
        for(var j=0; j<3; j++){
            game[i][j] = new gameTile(false, false);
        }
    }

    //stroke settings
    canvas2D.lineWidth = 10;
    var thirdWidth = canvasWidth / 3;
    var thirdHeight = canvasHeight / 3;

    //Vertical Lines
    canvas2D.moveTo(thirdWidth, 0);
    canvas2D.lineTo(thirdWidth, canvasHeight);
    canvas2D.stroke();
    canvas2D.moveTo(2*thirdWidth, 0);
    canvas2D.lineTo(2*thirdWidth, canvasHeight);
    canvas2D.stroke();

    //Horizontal Lines
    canvas2D.moveTo(0, thirdHeight);
    canvas2D.lineTo(canvasWidth, thirdHeight);
    canvas2D.stroke();
    canvas2D.moveTo(0, 2*thirdHeight);
    canvas2D.lineTo(canvasWidth, 2*thirdHeight);
    canvas2D.stroke();
}

function step() {
    if (go) {
        update();
    }
}

function update() {
}

function updateFPS() {
    if (timer !== null) {
        clearInterval(timer);
    }
    time = 1000 / fps;
    timer = setInterval(step, time);
}

function clearCanvas() {
    canvas2D.clearRect(0, 0, canvasWidth, canvasHeight);
}

function stop() {
    go = false;
}

function start() {
    go = true;
}

function mouseDown(event) {
    var x = event.x;
    var y = event.y;

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    drawCircle(x, y);

    for(var i=0; i<3; i++){
        for(var j=0; j<3; j++){
            canvas2D.fillRect((272 * i),(272 * j), 260, 260);
        }
    }

}

function mouseUp(){

}

function drawCircle(x, y){
    canvas2D.moveTo(x, y);
    canvas2D.beginPath();
    canvas2D.arc(x+pageXOffset,y+pageYOffset,50,0,2*Math.PI);
    canvas2D.stroke();
}

function drawCross(){

}

function gameTile(isUsed, isCircle){
    this.isUsed = isUsed;
    this.isCircle = isCircle;

    this.placePiece = function(isCircle){
        this.isUsed = true;
        this.isCircle = isCircle;
    }
}