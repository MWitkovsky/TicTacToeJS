/**
 * Created by Michael Witkovsky on 2/4/2016.
 */

//Canvas Variables
var canvasWidth;
var canvasHeight;
var canvas;
var canvas2D;

//Game variables
var countdown;
var game;
var usedSpaces;
var gameStarted;
var gameActive;

function beginCountdown(){
    this.timeRemaining = 5;
    this.interval = setInterval(function(){
        clearCanvas();
        initBoard();
        drawNumber(this.timeRemaining);
        /*if(--this.timeRemaining <= 0){
            clearCanvas();
            initBoard();
            initGame();
            gameStarted = true;
            clearInterval(this.interval);
            this.interval = null;
        }*/
    }, 1);
}

function init() {
    canvasWidth = 800;
    canvasHeight = 800;
    canvas = document.getElementById("myCanvas");
    canvas.addEventListener("mousedown", mouseDown, false);
    canvas2D = canvas.getContext("2d");

    canvas2D.fillStyle = "#FF0000";
    window.addEventListener('load', init, false);

    gameStarted = false;
    countdown = beginCountdown();
    clearCanvas();
    initBoard();
    initGame();
    gameStarted = true;
}

function initBoard(){
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

function initGame(){
    //init game board
    game = new Array(3);
    game[0] = new Array(3);
    game[1] = new Array(3);
    game[2] = new Array(3);
    usedSpaces = 0;

    for(var i=0; i<3; i++){
        for(var j=0; j<3; j++){
            game[i][j] = new gameTile(false, false);
        }
    }

    gameActive = true;
}

function clearCanvas() {
    canvas2D.clearRect(0, 0, canvasWidth, canvasHeight);
}

function mouseDown(event) {
    if(gameStarted && gameActive){
        var validMove = false;
        var x = event.x;
        var y = event.y;

        x -= canvas.offsetLeft;
        x += pageXOffset;
        y -= canvas.offsetTop;
        y += pageYOffset;

        var squareX;
        var squareY;

        for(var i=0; i<3; i++){
            squareY = (270*i)+i-1;
            for(var j=0; j<3; j++){
                squareX = (270*j)+j-1;
                if(x >= squareX && x <= squareX + 261){
                    if (y >= squareY && y <= squareY + 261) {
                        if(game[j][i].isUsed){
                            alert("x:" + j + " y:" + i + " is already being used");
                        }
                        else{
                            drawCross(squareX+261/2, squareY+261/2);
                            game[j][i].isUsed = true;
                            validMove = true;
                            usedSpaces++;
                            if(checkForWinner()){
                                return;
                            }
                        }
                    }
                }
            }
        }

        if(validMove){
            //AI
            if(usedSpaces < 9){
                validMove = false;
                while(!validMove){
                    var x = Math.floor((Math.random() * 3));
                    var y = Math.floor((Math.random() * 3));
                    if(!game[x][y].isUsed){
                        //alert("I chose X: " + x + " and Y: " + y);
                        game[x][y].isUsed = true;
                        game[x][y].isCircle = true;
                        drawCircle((270*x)+x+125,(270*y)+y+125);
                        validMove = true;
                        usedSpaces++;
                        if(checkForWinner()){
                            return;
                        }
                    }
                }
            }
            else{
                alert("Game is a draw.");
            }

        }

        //Debug code for drawing click regions
        /*for(var i=0; i<3; i++){
         for(var j=0; j<3; j++){
         canvas2D.fillRect((270 * i)+i-1,(270 * j)+j-1, 261, 261);
         }
         }*/
    }
}

function checkForWinner(){
    var isCircle;
    var isPossibleWinner;
    //Checks all rows
    for(var i=0; i<3; i++){
        if(game[0][i].isUsed){
            isCircle = game[0][i].isCircle;
        }
        else{
            isCircle = null;
        }
        isPossibleWinner = false;
        for(var j=1; j<3; j++){
            if(game[j][i].isUsed && game[j][i].isCircle === isCircle){
                if(j === 2 && isPossibleWinner){
                    declareWinner(isCircle);
                    return true;
                }
                isPossibleWinner = true;
            }
        }
    }

    //Checks all columns
    for(var i=0; i<3; i++){
        if(game[i][0].isUsed){
            isCircle = game[i][0].isCircle;
        }
        else{
            isCircle = null;
        }
        isPossibleWinner = false;
        for(var j=1; j<3; j++){
            if(game[i][j].isUsed && game[i][j].isCircle === isCircle){
                if(j === 2 && isPossibleWinner){
                    declareWinner(isCircle);
                    return true;
                }
                isPossibleWinner = true;
            }
        }
    }

    //Check top left diagonal
    if(game[0][0].isUsed){
        isCircle = game[0][0].isCircle;
    }
    else{
        isCircle = null;
    }
    isPossibleWinner = false;
    for(var i=1; i<3; i++){
        if(game[i][i].isUsed && game[i][i].isCircle === isCircle){
            if(i === 2 && isPossibleWinner){
                declareWinner(isCircle);
                return true;
            }
            isPossibleWinner = true;
        }
    }

    //Check bottom left diagonal
    if(game[0][2].isUsed){
        isCircle = game[0][2].isCircle;
    }
    else{
        isCircle = null;
    }
    isPossibleWinner = false;
    for(var i=1; i<3; i++){
        if(game[i][2-i].isUsed && game[i][2-i].isCircle === isCircle){
            if(i === 2 && isPossibleWinner){
                declareWinner(isCircle);
                return true;
            }
            isPossibleWinner = true;
        }
    }
}

function declareWinner(isCircle){
    if(isCircle){
        alert("CPU Wins!");
    }
    else{
        alert("Player Wins!");
    }

    gameActive = false;
}

function drawCircle(x, y){
    canvas2D.moveTo(x, y);
    canvas2D.beginPath();
    canvas2D.arc(x,y,60,0,2*Math.PI);
    canvas2D.stroke();
}

function drawCross(x, y){
    //Top left to bottom right
    canvas2D.moveTo(x-70, y-70);
    canvas2D.lineTo(x+70, y+70);
    canvas2D.stroke();

    //Bottom left to top right
    canvas2D.moveTo(x-70, y+70);
    canvas2D.lineTo(x+70, y-70);
    canvas2D.stroke();
}

function drawNumber(num){
    canvas2D.font = "30px Arial";
    canvas2D.fillText(num, canvas.width/2, canvas.height/2);
}

function gameTile(isUsed, isCircle){
    this.isUsed = isUsed;
    this.isCircle = isCircle;
}