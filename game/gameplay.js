var overallContainer = document.getElementById("wholecontent");
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
//finding the total number of columns
var totalColumns = Math.floor(screenWidth/52);
//finding the total number of rows
var totalRows = Math.floor(screenHeight/53);
var enemyMovements = [];
var seconds = 1;
var jsGrid = [];
var currentCoordinateX;
var currentCoordinateY;
var gameover;
var enemy1 = [1, (totalColumns - 1), "ok"];
var enemy2 = [0, 2, "ok"];
var enemy3 = [(totalRows - 1), 1, "ok"];
var enemy4 = [2, 0, "ok"];
var enemyGenerator;
var newEnemySpawn = 0;
var selectedCharacter;
var selectedEnemy;
var selectedObstacle;
var selectedBackground;
var timer;
var executeCheck;
var backgroundMusic;
var initials;


var obstacle = {

    tree: {

        image: "images/cactus.jpg"
    },

    house: {

        image: "images/house.jpg"
    },

    rock: {

        image: "images/rock.jpg"
    }


}

var character = {

    hulk: {

        frontView: "images/hulk-front.jpg",
        leftView: "images/hulk-left.jpg",
        rightView: "images/hulk-right.jpg",
        backView: "images/hulk-back.jpg"

    },

    prisoner: {

        frontView: "images/prisoner-front.jpg",
        leftView: "images/prisoner-left.jpg",
        rightView: "images/prisoner-right.jpg",
        backView: "images/prisoner-back.jpg"
    },

    batman: {

        frontView: "images/batman-front.jpg",
        leftView: "images/batman-left.jpg",
        rightView: "images/batman-right.jpg",
        backView: "images/batman-back.jpg"
    }


}

var enemy = {

    redHulk: {

        frontView: "images/redhulk-front.jpg",
        leftView: "images/redhulk-left.jpg",
        rightView: "images/redhulk-right.jpg",
        backView: "images/redhulk-back.jpg"

    },

    police: {

        frontView: "images/police-front.jpg",
        leftView: "images/police-left.jpg",
        rightView: "images/police-right.jpg",
        backView: "images/police-back.jpg"
    },

    joker: {

        frontView: "images/joker-front.jpg",
        leftView: "images/joker-left.jpg",
        rightView: "images/joker-right.jpg",
        backView: "images/joker-back.jpg"
    }

}

var background = {

    hulk: "rgb(249,192,40)",
    prisoner: "rgb(146,146,146)",
    batman: "rgb(166,165,129)"

}

function pickTheme() {

    var chooseCharacter = document.createElement("h1");
    chooseCharacter.classList.add("choose");
    chooseCharacter.innerHTML = "Choose your Avatar";
    overallContainer.appendChild(chooseCharacter);

    var playerInitials = document.createElement("input");
    playerInitials.id = "initials";
    playerInitials.setAttribute("type", "text");
    playerInitials.setAttribute("maxlength", 3);
    playerInitials.setAttribute("placeholder", "Enter Your Initials");
    playerInitials.autofocus = true;
    overallContainer.appendChild(playerInitials);
    document.getElementById("initials").addEventListener("change", function(){initials = playerInitials.value});



    var hulkCharacter = document.createElement("div");
    hulkCharacter.classList.add("character");
    hulkCharacter.id = "hulk"
    overallContainer.appendChild(hulkCharacter);

    var prisonerCharacter = document.createElement("div");
    prisonerCharacter.classList.add("character");
    prisonerCharacter.id = "prisoner"
    overallContainer.appendChild(prisonerCharacter);

    var batmanCharacter = document.createElement("div");
    batmanCharacter.classList.add("character");
    batmanCharacter.id = "batman"
    overallContainer.appendChild(batmanCharacter);

    var listOfOptions = document.querySelectorAll(".character");

    for (var i = 0; i < listOfOptions.length; i++) {

        listOfOptions[i].addEventListener("click", function(){

            if (this.id === "hulk") {

                selectedCharacter = character.hulk;
                selectedEnemy = enemy.redHulk;
                selectedObstacle = obstacle.tree;
                selectedBackground = background.hulk;

            } else if (this.id === "prisoner") {

                selectedCharacter = character.prisoner;
                selectedEnemy = enemy.police;
                selectedObstacle = obstacle.house;
                selectedBackground = background.prisoner;

            } else if (this.id === "batman") {

                selectedCharacter = character.batman;
                selectedEnemy = enemy.joker;
                selectedObstacle = obstacle.rock;
                selectedBackground = background.batman;
            }


            while (overallContainer.firstChild) {

                overallContainer.removeChild(overallContainer.childNodes[0]);
            }

            createBoard();

        })

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

    addSound("Arcade-Puzzler.mp3");
    var backgroundColor = document.querySelector("#gameboard");
    backgroundColor.style.backgroundColor = selectedBackground;
    createBoundaries();
    createExit();
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
    timer = setInterval( countup , 1000 );
    executeCheck = setInterval(gameOver, 1);
    executeCheckForWin = setInterval(win, 1);

};

//creating the starting point of the player
function createPlayer() {

    currentCoordinateY = totalRows - 1;
    currentCoordinateX = totalColumns - 1;
    jsGrid[currentCoordinateY][currentCoordinateX] = "X";

    var mapGridValue = "#r" + currentCoordinateY + " #c" + currentCoordinateX + " img";
    var mapGrid = document.querySelector(mapGridValue);
    mapGrid.src = selectedCharacter.frontView;

};

function createExit() {

    var exit = [0,0];
    jsGrid[exit[0]][exit[1]] = "E";
    var exitDom = document.querySelector("#r0 #c0 img");
    exitDom.src = "images/exit.jpg";


}

function createEnemy(enemyId) {

    var enemyCoordinateY = enemyId[0];
    var enemyCoordinateX = enemyId[1];
    jsGrid[enemyCoordinateY][enemyCoordinateX] = "Y";

    var enemyGridValue = "#r" + enemyCoordinateY + " #c" + enemyCoordinateX + " img";
    var enemyGrid = document.querySelector(enemyGridValue);
    enemyGrid.src = selectedEnemy.frontView;

}

function createRandomEnemy() {

    enemyGenerator = setInterval(function(){

        var enemyNew = [];
        var randomInnerGrid = randomness(totalColumns - 3) + 2;
        var randomOuterGrid = randomness(totalRows - 3) + 2;
        while (jsGrid[randomOuterGrid][randomInnerGrid] !== " ") {

            randomInnerGrid = randomness(totalColumns - 3) + 2;
            randomOuterGrid = randomness(totalRows - 3) + 2;

        }

        enemyNew.push(randomOuterGrid);
        enemyNew.push(randomInnerGrid);
        enemyNew.push("ok");
        jsGrid[randomOuterGrid][randomInnerGrid] = "Y";
        var randomPlotEnemy = "#r" + randomOuterGrid + " #c" + randomInnerGrid + " img";
        var randomEnemyGrid = document.querySelector(randomPlotEnemy);
        randomEnemyGrid.src = selectedEnemy.frontView;
        addSound("Roundhouse Kick-SoundBible.com-1663225804.mp3");
        newEnemySpawn += 1;

        setTimeout( function() {enemyBehaviour(enemyNew)}, 500);

    }, 3000);

}

//finding the currnent co-ordinates of the the player
function plottingPlayer(view) {

    var mapGridValue = "#r" + currentCoordinateY + " #c" + currentCoordinateX + " img";
    var mapGrid = document.querySelector(mapGridValue);

    if (view === undefined ) {

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

    var move = function(event){

        if (gameover === true) {

            window.removeEventListener("keydown", move);

        }

        var events = event.key;

        if ( events === "ArrowUp" && currentCoordinateY > 0) {

            if (jsGrid[currentCoordinateY - 1][currentCoordinateX] !== "*") {

                if (jsGrid[currentCoordinateY - 1][currentCoordinateX] === "Y") {

                    jsGrid[currentCoordinateY - 1][currentCoordinateX] = "Y";
                    currentCoordinateY -= 1;
                    jsGrid[currentCoordinateY + 1][currentCoordinateX] = " ";

                } else {

                    //to plot the co-ordinate of he player before moving
                    plottingPlayer();
                    jsGrid[currentCoordinateY - 1][currentCoordinateX] = "X";
                    currentCoordinateY -= 1;
                    //to plot the co-ordinate of the player after moving
                    plottingPlayer(selectedCharacter.backView);
                    jsGrid[currentCoordinateY + 1][currentCoordinateX] = " ";

                }


            }

        } else if (events === "ArrowDown" && currentCoordinateY < jsGrid.length - 1) {

            if (jsGrid[currentCoordinateY + 1][currentCoordinateX] !== "*") {

                if (jsGrid[currentCoordinateY + 1][currentCoordinateX] === "Y") {

                    jsGrid[currentCoordinateY + 1][currentCoordinateX] = "Y";
                    currentCoordinateY += 1;
                    jsGrid[currentCoordinateY - 1][currentCoordinateX] = " ";

                } else {

                    plottingPlayer();
                    jsGrid[currentCoordinateY + 1][currentCoordinateX] = "X";
                    currentCoordinateY += 1;
                    plottingPlayer(selectedCharacter.frontView);
                    jsGrid[currentCoordinateY - 1][currentCoordinateX] = " ";

                }
            }

        } else if (events === "ArrowLeft" && currentCoordinateX > 0) {

            if (jsGrid[currentCoordinateY][currentCoordinateX - 1] !== "*") {

                if (jsGrid[currentCoordinateY][currentCoordinateX - 1] === "Y") {

                    jsGrid[currentCoordinateY][currentCoordinateX - 1] = "Y";
                    currentCoordinateX -= 1;
                    jsGrid[currentCoordinateY][currentCoordinateX + 1] = " ";

                } else {

                    plottingPlayer();
                    jsGrid[currentCoordinateY][currentCoordinateX - 1] = "X";
                    currentCoordinateX -= 1;
                    plottingPlayer(selectedCharacter.leftView);
                    jsGrid[currentCoordinateY][currentCoordinateX + 1] = " ";

                }
            }

        } else if (events === "ArrowRight" && currentCoordinateX <(jsGrid[0].length - 1)) {

            if (jsGrid[currentCoordinateY][currentCoordinateX + 1] !== "*") {

                if (jsGrid[currentCoordinateY][currentCoordinateX + 1] === "Y") {

                    jsGrid[currentCoordinateY][currentCoordinateX + 1] = "Y";
                    currentCoordinateX += 1;
                    jsGrid[currentCoordinateY][currentCoordinateX - 1] = " ";

                } else {

                    plottingPlayer();
                    jsGrid[currentCoordinateY][currentCoordinateX + 1] = "X";
                    currentCoordinateX += 1;
                    plottingPlayer(selectedCharacter.rightView);
                    jsGrid[currentCoordinateY][currentCoordinateX - 1] = " ";

                }
            }

        }

    };

    window.addEventListener("keydown", move);


};

// creating a random number
function randomness(number) {

    var randomNo = Math.floor(Math.random() * number);

    return randomNo;

};

// set timeout to end game after 20s and show stage lvl
function createBoundaries() {

    for (var i = 1; i < totalColumns - 1; i++) {

        if (i%3 === 0) {

            jsGrid[1][i] = "*";
            jsGrid[totalRows-2][i] = "*";
            var setBoundariesImageTop = "#r" + 1 + " #c" + i + " img";
            var setBoundariesImageBottom ="#r" + (totalRows - 2) + " #c" + i + " img";
            var obstacleTop = document.querySelector(setBoundariesImageTop);
            obstacleTop.src = selectedObstacle.image;
            var obstacleBottom = document.querySelector(setBoundariesImageBottom);
            obstacleBottom.src = selectedObstacle.image;

        }

    }

    for (var i = 1; i < totalRows - 1; i++) {

        if (i%3 === 0) {

            jsGrid[i][1] = "*";
            jsGrid[i][totalColumns-2] = "*";
            var setBoundariesImageLeft = "#r" + i + " #c" + 1 + " img";
            var setBoundariesImageRight ="#r" + i + " #c" + (totalColumns - 2) + " img";
            var obstacleLeft = document.querySelector(setBoundariesImageLeft);
            obstacleLeft.src = selectedObstacle.image;
            var obstacleRight = document.querySelector(setBoundariesImageRight);
            obstacleRight.src = selectedObstacle.image;

        }

    }

    jsGrid[0][(totalColumns - 1)] = "*";
    jsGrid[(totalRows - 1)][0] = "*";
    var setBoundariesImageTopRight = "#r0 #c" + (totalColumns - 1) + " img";
    var setBoundariesImageBottomLeft ="#r" + (totalRows - 1) + " #c0 img";
    var obstacleTopRight = document.querySelector(setBoundariesImageTopRight);
    obstacleTopRight.src = selectedObstacle.image;
    var obstacleBottomLeft = document.querySelector(setBoundariesImageBottomLeft);
    obstacleBottomLeft.src = selectedObstacle.image;

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
        onGrid.src = selectedObstacle.image;
    }
};

function enemyBehaviour(enemyId) {

    var moveUp = function(enemyId) {

        if (enemyId[0] > 0) {

            if (jsGrid[enemyId[0] - 1][enemyId[1]] !== "*" && jsGrid[enemyId[0] - 1][enemyId[1]] !== "E") {

                //to plot the co-ordinate of he player before moving
                plottingEnemy(enemyId);
                jsGrid[enemyId[0] - 1][enemyId[1]] = "Y";
                enemyId[0] -= 1;
                jsGrid[enemyId[0] + 1][enemyId[1]] = " ";
                //to plot the co-ordinate of the player after moving
                plottingEnemy(enemyId, selectedEnemy.backView);
                enemyId[2] = "ok";

            } else {

                enemyId[2] = "notOk";
            }

        } else {

            enemyId[2] = "notOk";
        }

    };

    var moveDown = function(enemyId) {

        if (enemyId[0] < jsGrid.length - 1) {

            if (jsGrid[enemyId[0] + 1][enemyId[1]] !== "*" && jsGrid[enemyId[0] + 1][enemyId[1]] !== "E") {

                //to plot the co-ordinate of he player before moving
                plottingEnemy(enemyId);
                jsGrid[enemyId[0] + 1][enemyId[1]] = "Y";
                enemyId[0] += 1;
                jsGrid[enemyId[0] - 1][enemyId[1]] = " ";
                //to plot the co-ordinate of the player after moving
                plottingEnemy(enemyId, selectedEnemy.frontView);
                enemyId[2] = "ok";

            } else {

                enemyId[2] = "notOk";
            }

        } else {

            enemyId[2] = "notOk";
        }

    };

    var moveLeft = function(enemyId) {

        if (enemyId[1] > 0) {

            if (jsGrid[enemyId[0]][enemyId[1] - 1] !== "*" && jsGrid[enemyId[0]][enemyId[1] - 1] !== "E") {

                //to plot the co-ordinate of he player before moving
                plottingEnemy(enemyId);
                jsGrid[enemyId[0]][enemyId[1] - 1] = "Y";
                enemyId[1] -= 1;
                jsGrid[enemyId[0]][enemyId[1] + 1] = " ";
                //to plot the co-ordinate of the player after moving
                plottingEnemy(enemyId, selectedEnemy.leftView);
                enemyId[2] = "ok";

            } else {

                enemyId[2] = 'notOk';
            }

        } else {

            enemyId[2] = "notOk";
        }


    };

    var moveRight = function(enemyId) {

        if (enemyId[1] < jsGrid[0].length - 1) {

            if (jsGrid[enemyId[0]][enemyId[1] + 1] !== "*" && jsGrid[enemyId[0]][enemyId[1] + 1] !== "E") {

                //to plot the co-ordinate of he player before moving
                plottingEnemy(enemyId);
                jsGrid[enemyId[0]][enemyId[1] + 1] = "Y";
                enemyId[1] += 1;
                jsGrid[enemyId[0]][enemyId[1] - 1] = " ";
                //to plot the co-ordinate of the player after moving
                plottingEnemy(enemyId, selectedEnemy.rightView);
                enemyId[2] = "ok";

            } else {

                enemyId[2] = "notOk";
            }

        } else {

            enemyId[2] = "notOk";
        }

    };

        var intervalForMoving = setInterval(function(){

            var differenceX = enemyId[1] - currentCoordinateX;
            var differenceY = enemyId[0] - currentCoordinateY;
            var valueDifferenceX = differenceX * -1;
            var valueDifferenceY = differenceY * -1;

            var options = [moveUp, moveDown, moveLeft, moveRight];

            if (valueDifferenceX < valueDifferenceY && differenceX < 0) {

                moveRight(enemyId);

                if (enemyId[2] === "notOk") {

                    var pickRandomMovement = randomness(options.length);
                    options[pickRandomMovement](enemyId);

                    while (enemyId[2] === "notOk" ) {

                        pickRandomMovement = randomness(options.length);
                        options[pickRandomMovement](enemyId);

                    }
                }

            } else if (valueDifferenceX < valueDifferenceY && differenceX > 0) {

                moveLeft(enemyId);

                if (enemyId[2] === "notOk") {

                    var pickRandomMovement = randomness(options.length);
                    options[pickRandomMovement](enemyId);

                    while (enemyId[2] === "notOk" ) {

                        pickRandomMovement = randomness(options.length);
                        options[pickRandomMovement](enemyId);

                    }
                }

            } else if (valueDifferenceY < valueDifferenceX && differenceY < 0) {

                moveDown(enemyId);

                if (enemyId[2] === "notOk") {

                    var pickRandomMovement = randomness(options.length);
                    options[pickRandomMovement](enemyId);

                    while ( enemyId[2]  === "notOk" ) {

                        pickRandomMovement = randomness(options.length);
                        options[pickRandomMovement](enemyId);

                    }
                }

            } else if (valueDifferenceY < valueDifferenceX && differenceY > 0) {

                moveUp(enemyId);

                if (enemyId[2] === "notOk") {

                    var pickRandomMovement = randomness(options.length);
                    options[pickRandomMovement](enemyId);

                    while (enemyId[2] === "notOk" ) {

                        pickRandomMovement = randomness(options.length);
                        options[pickRandomMovement](enemyId);

                    }
                }

            } else if (valueDifferenceY === 0 && differenceX > 0) {

                moveLeft(enemyId);

                if (enemyId[2] === "notOk") {

                    var pickRandomMovement = randomness(options.length);
                    options[pickRandomMovement](enemyId);

                    while (enemyId[2] === "notOk" ) {

                        pickRandomMovement = randomness(options.length);
                        options[pickRandomMovement](enemyId);

                    }
                }

            } else if (valueDifferenceY === 0 && differenceX < 0) {

                moveRight(enemyId);

                if (enemyId[2] === "notOk") {

                    var pickRandomMovement = randomness(options.length);
                    options[pickRandomMovement](enemyId);

                    while (enemyId[2] === "notOk" ) {

                        pickRandomMovement = randomness(options.length);
                        options[pickRandomMovement](enemyId);

                    }

                }

            } else if (valueDifferenceX === 0 && differenceY > 0) {

                moveUp(enemyId);

                if (enemyId[2] === "notOk") {

                    var pickRandomMovement = randomness(options.length);
                    options[pickRandomMovement](enemyId);

                    while (enemyId[2] === "notOk" ) {

                        pickRandomMovement = randomness(options.length);
                        options[pickRandomMovement](enemyId);

                    }
                }

            } else if (valueDifferenceX === 0 && differenceY < 0) {

                moveDown(enemyId);

                if (enemyId[2] === "notOk") {

                    var pickRandomMovement = randomness(options.length);
                    options[pickRandomMovement](enemyId);

                    while (enemyId[2] === "notOk" ) {

                        pickRandomMovement = randomness(options.length);
                        options[pickRandomMovement](enemyId);

                    }
                }

            } else if (valueDifferenceX === valueDifferenceY) {

                var pickRandomMovement = randomness(options.length);
                options[pickRandomMovement](enemyId);

                while (enemyId[2] === "notOk" ) {

                    pickRandomMovement = randomness(options.length);
                    options[pickRandomMovement](enemyId);

                }

            }


        }, 295);

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
        while (overallContainer.firstChild) {

            overallContainer.removeChild(overallContainer.childNodes[0]);

        }

        var text = document.createElement("h1");
        var text2 = document.createElement("h2");
        var restart = document.createElement("button");
        restart.innerHTML = "Restart";
        text.innerHTML = "Game Over!!";
        text.classList.add("gameover");
        text2.classList.add("text2");
        text2.innerHTML = "Nice try but you are not escaping from here...";
        overallContainer.appendChild(text);
        overallContainer.appendChild(text2);
        overallContainer.appendChild(restart);
        document.getElementsByTagName("button")[0].addEventListener("click", function(){location.reload()});

        for (var i = 0; i < enemyMovements.length; i++) {

            clearInterval(enemyMovements[i]);

        }

        clearInterval(executeCheck);
        clearInterval(executeCheckForWin);
        clearInterval(timer);
        clearInterval(enemyGenerator);

    }

};

var win = function() {

    if (jsGrid[0].includes("E") === false) {

        gameover = true;
        while (overallContainer.firstChild) {

            overallContainer.removeChild(overallContainer.childNodes[0]);

        }

        var text = document.createElement("h1");
        var showScore = document.createElement("h2");
        var restart = document.createElement("button");
        restart.innerHTML = "Restart";
        text.innerHTML = "Congratulations!!";
        text.classList.add("winner");
        showScore.classList.add("score");
        showScore.innerHTML = "Your score is: " + seconds;
        overallContainer.appendChild(text);

        //check browser support
        if ( typeof(Storage) !== undefined) {

            if (localStorage.getItem("highScore") !== null ) {

                var currentHighScore = localStorage.getItem("highScore");

                if (currentHighScore >= seconds) {

                    localStorage.setItem("highScore", seconds);
                    localStorage.setItem("leaderboardInitials", initials);
                }

            } else {

               localStorage.setItem("highScore", seconds);
               localStorage.setItem("leaderboardInitials", initials);
            }

            var highScore = document.createElement("h2");
            highScore.innerHTML = "LEADERBOARD: " + localStorage.getItem("leaderboardInitials") + " " +localStorage.getItem("highScore");
            highScore.classList.add("highscore");
            overallContainer.appendChild(highScore);

        }

        overallContainer.appendChild(showScore);
        overallContainer.appendChild(restart);
        document.getElementsByTagName("button")[0].addEventListener("click", function(){location.reload()});

        for (var i = 0; i < enemyMovements.length; i++) {

            clearInterval(enemyMovements[i]);

        }

        clearInterval(executeCheck);
        clearInterval(executeCheckForWin);
        clearInterval(timer);
        clearInterval(enemyGenerator);

    }
}

var countup = function() {

        var countingDown = document.getElementById("timer");
        countingDown.innerHTML = seconds + "s";
        seconds++;



};

function addSound(src) {

    backgroundMusic = document.createElement("audio");
    backgroundMusic.id = "myMusic";
    backgroundMusic.src = src;
    backgroundMusic.setAttribute("preload", "auto");
    backgroundMusic.setAttribute("controls", "none");
    backgroundMusic.style.display = "none";
    overallContainer.appendChild(backgroundMusic);
    backgroundMusic.play();
    document.getElementById("myMusic").loop = true;

};



window.onload = function() {

    pickTheme();

};











