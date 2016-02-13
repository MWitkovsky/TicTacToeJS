//Canvas Variables
var canvasWidth;
var canvasHeight;
var canvas;
var canvas2D;

//Game variables
var newGameTimerLength;
var newGameTimer;
var playerFirst;
var game;
var usedSpaces;
var gameStarted;
var gameActive;
var gameResult;

function init() {
    canvasWidth = 800;
    canvasHeight = 800;
    canvas = document.getElementById("myCanvas");
    canvas.addEventListener("mousedown", mouseDown, false);
    canvas2D = canvas.getContext("2d");
    canvas2D.fillStyle = "#FF0000";

    /*boardRefresher = setInterval(function(){
        clearCanvas();
        initBoard();
        drawPieces();
    }, 1000/30);*/
    playerFirst = false;

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

    canvas2D.beginPath();

    //Vertical Lines
    canvas2D.moveTo(thirdWidth, 0);
    canvas2D.lineTo(thirdWidth, canvasHeight);
    canvas2D.moveTo(2*thirdWidth, 0);
    canvas2D.lineTo(2*thirdWidth, canvasHeight);

    //Horizontal Lines
    canvas2D.moveTo(0, thirdHeight);
    canvas2D.lineTo(canvasWidth, thirdHeight);
    canvas2D.moveTo(0, 2*thirdHeight);
    canvas2D.lineTo(canvasWidth, 2*thirdHeight);

    canvas2D.stroke();
    canvas2D.closePath();
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

    gameActive = false;
    beginCountdown();
}

function nextGame(){
    if(gameActive){
        alert("finish your current game first!");
        return;
    }

    for(var i=0; i<3; i++){
        for(var j=0; j<3; j++){
            game[i][j].isUsed = false;
            game[i][j].isCircle = false;
        }
    }
    usedSpaces = 0;

    playerFirst = !playerFirst;

    gameStarted = true;
    gameActive = false;

    clearCanvas();
    initBoard();
    beginCountdown();
}

function beginCountdown(){
    newGameTimerLength = 5;
    newGameTimer = setInterval(function(){
        clearCanvas();
        initBoard();
        if(newGameTimerLength <= 0){
            gameActive = true;
            if(!playerFirst){
                CPUTurn();
                drawPieces();
            }
            clearInterval(newGameTimer);
        }
        else{
            drawNumber(newGameTimerLength);
            --newGameTimerLength;
        }
    }, 1000);
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
                            game[j][i].isUsed = true;
                            if(!playerFirst){
                                game[j][i].isCircle = true;
                            }
                            validMove = true;
                            ++usedSpaces;
                        }
                    }
                }
            }
        }

        drawPieces();
        var winner = checkForWinner();

        if(validMove && !winner){
            CPUTurn();
            drawPieces();
            checkForWinner();
        }

        //Debug code for drawing click regions
        /*for(var i=0; i<3; i++){
         for(var j=0; j<3; j++){
         canvas2D.fillRect((270 * i)+i-1,(270 * j)+j-1, 261, 261);
         }
         }*/
    }
}

function CPUTurn(){
    if(usedSpaces < 9){
        var validMove = false;
        while(!validMove){
            var x = Math.floor((Math.random() * 3));
            var y = Math.floor((Math.random() * 3));
            if(!game[x][y].isUsed){
                game[x][y].isUsed = true;
                if(playerFirst){
                    game[x][y].isCircle = true;
                }
                validMove = true;
                ++usedSpaces;
            }
        }
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

    //Check for draw
    if(usedSpaces == 9){
        alert("game is a draw");
        gameResult = "draw";
        gameActive = false;
        return true;
    }

    return false;
}

function declareWinner(isCircle){
    if(playerFirst){
        if(isCircle){
            alert("CPU Wins!");
            gameResult = "lose";
        }
        else{
            alert("Player Wins!");
            gameResult = "win";

            $.post('tictactoe', function(data) {
            });
        }
    }
    else{
        if(isCircle){
            alert("Player Wins!");
            gameResult = "win";

            $.post('tictactoe', function(data) {
            });
        }
        else{
            alert("CPU Wins!");
            gameResult = "lose";
        }
    }

    gameActive = false;
}

function drawPieces(){
    for(var x=0; x<3; x++){
        for(var y=0; y<3; y++){
            if(game[x][y].isUsed){
                if(game[x][y].isCircle){
                    drawCircle((270*x)+x+125,(270*y)+y+125);
                }
                else{
                    drawCross((270*x)+x+125,(270*y)+y+125);
                }
            }
        }
    }
}

function drawCircle(x, y){
    canvas2D.moveTo(x, y);
    canvas2D.beginPath();
    canvas2D.arc(x,y,60,0,2*Math.PI);
    canvas2D.stroke();
    canvas2D.closePath();
}

function drawCross(x, y) {
    canvas2D.beginPath();

    //Top left to bottom right
    canvas2D.moveTo(x - 70, y - 70);
    canvas2D.lineTo(x + 70, y + 70);

    //Bottom left to top right
    canvas2D.moveTo(x - 70, y + 70);
    canvas2D.lineTo(x + 70, y - 70);

    canvas2D.stroke();
    canvas2D.closePath();
}

function drawNumber(num){
    canvas2D.font = "30px Arial";
    canvas2D.fillText(num, canvas.width/2, canvas.height/2);
}

function gameTile(isUsed, isCircle){
    this.isUsed = isUsed;
    this.isCircle = isCircle;
}