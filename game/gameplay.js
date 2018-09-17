var overallContainer = document.getElementById("wholecontent");
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
//finding the total number of columns
var totalColumns = Math.floor(screenWidth/52);
//finding the total number of rows
var totalRows = Math.floor(screenHeight/53);
var enemyMovements = [];
var seconds = 0;
var mapGrid;
var jsGrid = [];
var currentCoordinateX;
var currentCoordinateY;
var gameover;
var enemy1 = [1, (totalColumns - 1)];
var enemy2 = [0, 2];
var enemy3 = [(totalRows - 1), 1];
var enemy4 = [2, 0];
var enemyGenerator;
var newEnemySpawn = 0;


var obstacle = {

    tree: {

        image: "images/cactus.jpg"
    }


}

var character = {

    hulk: {

        frontView: "images/hulk-front.jpg",
        leftView: "images/hulk-left.jpg",
        rightView: "images/hulk-right.jpg",
        backView: "images/hulk-back.jpg"

    }


}

var enemy = {

    redHulk: {

        frontView: "images/redhulk-front.jpg",
        leftView: "images/redhulk-left.jpg",
        rightView: "images/redhulk-right.jpg",
        backView: "images/redhulk-back.jpg"

    }

}

function createBoard() {

    var gridParent = document.createElement("table");
    gridParent.id = "gameboard";
    overallContainer.appendChild(gridParent);
    var timerDiv = document.createElement("div");
    timerDiv.id = "timer";
    overallContainer.appendChild(timerDiv);
    //creating the grid system
    for (var i = 0; i < totalRows; i++) {

        var row = document.createElement("tr");
        row.id = "r" + i;
        row.classList.add("rows")
        var gridRow = [];
        jsGrid.push(gridRow);

        for (var j = 0; j < totalColumns; j++) {

            var column = document.createElement("td");
            column.id = "c" + j;
            column.classList.add("columns");
            var imageTag = document.createElement("img");
            imageTag.src = "";
            column.appendChild(imageTag);
            row.appendChild(column);
            var gridColumn = " ";
            jsGrid[i].push(gridColumn);

        }

        gridParent.appendChild(row);
    }

    createBoundaries();
    createPlayer();
    createEnemy(enemy1);
    createEnemy(enemy2);
    createEnemy(enemy3);
    createEnemy(enemy4);
    movePlayer();
    enemyBehaviour(enemy1);
    enemyBehaviour(enemy2);
    enemyBehaviour(enemy3);
    enemyBehaviour(enemy4);
    createRandomEnemy();

};

//creating the starting point of the player
function createPlayer() {

    currentCoordinateY = totalRows - 1;
    currentCoordinateX = totalColumns - 1;
    jsGrid[currentCoordinateY][currentCoordinateX] = "X";

    var mapGridValue = "#r" + currentCoordinateY + " #c" + currentCoordinateX + " img";
    mapGrid = document.querySelector(mapGridValue);
    mapGrid.src = character.hulk.frontView;

};

function createEnemy(enemyId) {

    var enemyCoordinateY = enemyId[0];
    var enemyCoordinateX = enemyId[1];
    jsGrid[enemyCoordinateY][enemyCoordinateX] = "Y";

    var enemyGridValue = "#r" + enemyCoordinateY + " #c" + enemyCoordinateX + " img";
    var enemyGrid = document.querySelector(enemyGridValue);
    enemyGrid.src = enemy.redHulk.frontView;

}

function createRandomEnemy() {

    enemyGenerator = setInterval(function(){

        var enemyNew = [];
        var randomInnerGrid = randomness(totalColumns - 3) + 2;
        console.log(randomInnerGrid);
        var randomOuterGrid = randomness(totalRows - 3) + 2;
        console.log(randomOuterGrid);
        while (jsGrid[randomOuterGrid][randomInnerGrid] !== " ") {

            randomInnerGrid = randomness(totalColumns - 3) + 2;
            randomOuterGrid = randomness(totalRows - 3) + 2;

        }

        enemyNew.push(randomOuterGrid);
        enemyNew.push(randomInnerGrid);
        jsGrid[randomOuterGrid][randomInnerGrid] = "Y";
        var randomPlotEnemy = "#r" + randomOuterGrid + " #c" + randomInnerGrid + " img";
        var randomEnemyGrid = document.querySelector(randomPlotEnemy);
        randomEnemyGrid.src = enemy.redHulk.frontView;
        newEnemySpawn += 1;

        enemyBehaviour(enemyNew);

    }, 3000);

}

//finding the currnent co-ordinates of the the player
function plottingPlayer(view) {

    var mapGridValue = "#r" + currentCoordinateY + " #c" + currentCoordinateX + " img";
    mapGrid = document.querySelector(mapGridValue);

    if (view === undefined) {

       mapGrid.src = "";

    } else {

        mapGrid.src = view;
    }

};

function plottingEnemy(enemyId, view) {

    var enemyGridValue = "#r" + enemyId[0] + " #c" + enemyId[1] + " img";
    var enemyGrid = document.querySelector(enemyGridValue);

    if (view === undefined ) {

       enemyGrid.src = "";

    } else {

        enemyGrid.src = view;
    }

};

//getting the value of the key pressed and moving the character to the specified direction
function movePlayer() {

    window.addEventListener("keydown", function(){

        var events = event.key;

        if ( events === "ArrowUp" && currentCoordinateY > 0) {

            if (jsGrid[currentCoordinateY - 1][currentCoordinateX] !== "*") {

                //to plot the co-ordinate of he player before moving
                plottingPlayer();
                jsGrid[currentCoordinateY - 1][currentCoordinateX] = "X";
                currentCoordinateY -= 1;
                jsGrid[currentCoordinateY + 1][currentCoordinateX] = " ";
                //to plot the co-ordinate of the player after moving
                plottingPlayer(character.hulk.backView);



            } else if (jsGrid[currentCoordinateY - 1][currentCoordinateX] === "Y") {

                gameOver();

            }

        } else if (events === "ArrowDown" && currentCoordinateY < jsGrid.length - 1) {

            if (jsGrid[currentCoordinateY + 1][currentCoordinateX] !== "*") {

                plottingPlayer();
                jsGrid[currentCoordinateY + 1][currentCoordinateX] = "X";
                currentCoordinateY += 1;
                jsGrid[currentCoordinateY - 1][currentCoordinateX] = " ";
                plottingPlayer(character.hulk.frontView);


            } else if (jsGrid[currentCoordinateY + 1][currentCoordinateX] === "Y") {

                gameOver();
            }

        } else if (events === "ArrowLeft" && currentCoordinateX > 0) {

            if (jsGrid[currentCoordinateY][currentCoordinateX - 1] !== "*") {

                plottingPlayer();
                jsGrid[currentCoordinateY][currentCoordinateX - 1] = "X";
                currentCoordinateX -= 1;
                jsGrid[currentCoordinateY][currentCoordinateX + 1] = " ";
                plottingPlayer(character.hulk.leftView);


            } else if (jsGrid[currentCoordinateY][currentCoordinateX - 1] === "Y") {

                gameOver();
            }

        } else if (events === "ArrowRight" && currentCoordinateX <(jsGrid[0].length - 1)) {

            if (jsGrid[currentCoordinateY][currentCoordinateX + 1] !== "*") {

                plottingPlayer();
                jsGrid[currentCoordinateY][currentCoordinateX + 1] = "X";
                currentCoordinateX += 1;
                jsGrid[currentCoordinateY][currentCoordinateX - 1] = " ";
                plottingPlayer(character.hulk.rightView);



            } else if (jsGrid[currentCoordinateY][currentCoordinateX + 1] === "Y") {

                gameOver();
            }
        }

    });

};

// creating a random number
function randomness(number) {

    var randomNo = Math.floor(Math.random() * number);

    return randomNo;

};

// set timeout to end game after 20s and show stage lvl
function createBoundaries() {

    for (var i = 1; i < totalColumns - 1; i++) {

        if (i%2 === 0) {

            jsGrid[1][i] = "*";
            jsGrid[totalRows-2][i] = "*";
            var setBoundariesImageTop = "#r" + 1 + " #c" + i + " img";
            var setBoundariesImageBottom ="#r" + (totalRows - 2) + " #c" + i + " img";
            var obstacleTop = document.querySelector(setBoundariesImageTop);
            obstacleTop.src = obstacle.tree.image;
            var obstacleBottom = document.querySelector(setBoundariesImageBottom);
            obstacleBottom.src = obstacle.tree.image;

        }

    }

    for (var i = 1; i < totalRows - 1; i++) {

        if (i%2 === 0) {

            jsGrid[i][1] = "*";
            jsGrid[i][totalColumns-2] = "*";
            var setBoundariesImageLeft = "#r" + i + " #c" + 1 + " img";
            var setBoundariesImageRight ="#r" + i + " #c" + (totalColumns - 2) + " img";
            var obstacleLeft = document.querySelector(setBoundariesImageLeft);
            obstacleLeft.src = obstacle.tree.image;
            var obstacleRight = document.querySelector(setBoundariesImageRight);
            obstacleRight.src = obstacle.tree.image;

        }

    }

    jsGrid[0][(totalColumns - 1)] = "*";
    jsGrid[(totalRows - 1)][0] = "*";
    var setBoundariesImageTopRight = "#r0 #c" + (totalColumns - 1) + " img";
    var setBoundariesImageBottomLeft ="#r" + (totalRows - 1) + " #c0 img";
    var obstacleTopRight = document.querySelector(setBoundariesImageTopRight);
    obstacleTopRight.src = obstacle.tree.image;
    var obstacleBottomLeft = document.querySelector(setBoundariesImageBottomLeft);
    obstacleBottomLeft.src = obstacle.tree.image;

    var totalInnerBoundaries = Math.round(((totalRows - 4)*(totalColumns - 4))/5);

    for (var i = 0; i <= totalInnerBoundaries; i++) {

        var randomColumn = randomness(totalColumns - 3) + 2;
        var randomRow = randomness(totalRows - 3) + 2;

        while (jsGrid[randomRow][randomColumn] !== " ") {

            randomColumn = randomness(totalColumns - 3) + 2;
            randomRow = randomness(totalRows - 3) + 2;

        }

        jsGrid[randomRow][randomColumn] = "*";
        var onGridValue = "#r" + randomRow + " #c" + randomColumn + " img";
        var onGrid = document.querySelector(onGridValue);
        onGrid.src = obstacle.tree.image;
    }

};

function enemyBehaviour(enemyId) {

    var moveUp = function(enemyId) {

        if (enemyId[0] > 0) {

            if (jsGrid[enemyId[0] - 1][enemyId[1]] !== "*") {

                //to plot the co-ordinate of he player before moving
                plottingEnemy(enemyId);
                jsGrid[enemyId[0]][enemyId[1]] = " ";
                enemyId[0] -= 1;
                jsGrid[enemyId[0]][enemyId[1]] = "Y";
                //to plot the co-ordinate of the player after moving
                plottingEnemy(enemyId, enemy.redHulk.backView);
                checkOk = "ok";

            } else {

                checkOk = "notOk";
            }

        } else {

            checkOk = "notOk";
        }

    };

    var moveDown = function(enemyId) {

        if (enemyId[0] < jsGrid.length - 1) {

            if (jsGrid[enemyId[0] + 1][enemyId[1]] !== "*" ) {

                //to plot the co-ordinate of he player before moving
                plottingEnemy(enemyId);
                jsGrid[enemyId[0]][enemyId[1]] = " ";
                enemyId[0] += 1;
                jsGrid[enemyId[0]][enemyId[1]] = "Y";
                //to plot the co-ordinate of the player after moving
                plottingEnemy(enemyId, enemy.redHulk.frontView);
                checkOk = "ok";

            } else {

                checkOk = "notOk";
            }

        } else {

            checkOk = "notOk";
        }

    };

    var moveLeft = function(enemyId) {

        if (enemyId[1] > 0) {

            if (jsGrid[enemyId[0]][enemyId[1] - 1] !== "*") {

                //to plot the co-ordinate of he player before moving
                plottingEnemy(enemyId);
                jsGrid[enemyId[0]][enemyId[1]] = " ";
                enemyId[1] -= 1;
                jsGrid[enemyId[0]][enemyId[1]] = "Y";
                //to plot the co-ordinate of the player after moving
                plottingEnemy(enemyId, enemy.redHulk.leftView);
                checkOk = "ok";

            } else {

                checkOk = 'notOk';
            }

        } else {

            checkOk = "notOk";
        }


    };

    var moveRight = function(enemyId) {

        if (enemyId[1] < jsGrid[0].length - 1) {

            if (jsGrid[enemyId[0]][enemyId[1] + 1] !== "*") {

                //to plot the co-ordinate of he player before moving
                plottingEnemy(enemyId);
                jsGrid[enemyId[0]][enemyId[1]] = " ";
                enemyId[1] += 1;
                jsGrid[enemyId[0]][enemyId[1]] = "Y";
                //to plot the co-ordinate of the player after moving
                plottingEnemy(enemyId, enemy.redHulk.rightView);
                checkOk = "ok";

            } else {

                checkOk = "notOk";
            }

        } else {

            checkOk = "notOk";
        }

    };

        var intervalForMoving = setInterval(function(){

            var checkOk = "ok";

            var options = [moveUp, moveDown, moveLeft, moveRight];

            var pickRandomMovement = randomness(options.length);
            options[pickRandomMovement](enemyId);

            while (checkOk === "notOk" ) {

                pickRandomMovement = randomness(options.length);
                options[pickRandomMovement](enemyId);

            }

        }, 150);
        enemyMovements.push(intervalForMoving);

};

var gameOver = function() {

    var checkForX = [];

    for (var i = 0; i < totalRows; i++) {

        var innerString = jsGrid[i].toString();
        checkForX.push(innerString);

    }

    var string = checkForX.toString();
    var check = string.includes("X");

    if (check === false) {

        gameover = true;
        var whole = document.getElementById("wholecontent");
        while (whole.firstChild) {

            whole.removeChild(whole.childNodes[0]);

        }

        var text = document.createElement("h1");
        var showScore = document.createElement("h2");
        var restart = document.createElement("button");
        restart.innerHTML = "Restart";
        text.innerHTML = "Game Over!!";
        showScore.innerHTML = "Your score is: " + seconds;
        whole.appendChild(text);
        whole.appendChild(showScore);
        whole.appendChild(restart);
        document.getElementsByTagName("button")[0].addEventListener("click", function(){location.reload()});

        if (gameover === true) {

            for (var i = 0; i < (4 + newEnemySpawn); i++) {

                clearInterval(enemyMovements[i]);

            }

            clearInterval(executeCheck);
            clearInterval(timer);
            clearInterval(enemyGenerator);

        }

    }

};

var countup = function() {

        var countingDown = document.getElementById("timer");
        countingDown.innerHTML = seconds + "s";
        seconds++;



}

var timer = setInterval( countup , 1000 );
var executeCheck = setInterval(gameOver, 1);

window.onload = function() {

    createBoard();

};


// create more charcters/enemy/objects
// add music










