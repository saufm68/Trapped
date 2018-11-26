var overallContainer = document.getElementById("wholecontent");
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
//finding the total number of columns
var totalColumns = Math.floor(screenWidth / 52);
//finding the total number of rows
var totalRows = Math.floor(screenHeight / 53);
var enemyMovements = [];
var seconds = 1;
var jsGrid = [];
var currentCoordinateX;
var currentCoordinateY;
var gameover;
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

var starterEnemy = [
  [1, totalColumns - 1, "ok", "enemy1"],
  [0, 2, "ok"],
  [totalRows - 1, 1, "ok", "enemy2"],
  [2, 0, "ok", "enemy3"]
];

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
};

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
};

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
};

var background = {
  hulk: "rgb(249,192,40)",
  prisoner: "rgb(146,146,146)",
  batman: "rgb(166,165,129)"
};

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
  document.getElementById("initials").addEventListener("change", function() {
    initials = playerInitials.value;
  });

  var hulkCharacter = document.createElement("div");
  hulkCharacter.classList.add("character");
  hulkCharacter.id = "hulk";
  overallContainer.appendChild(hulkCharacter);

  var prisonerCharacter = document.createElement("div");
  prisonerCharacter.classList.add("character");
  prisonerCharacter.id = "prisoner";
  overallContainer.appendChild(prisonerCharacter);

  var batmanCharacter = document.createElement("div");
  batmanCharacter.classList.add("character");
  batmanCharacter.id = "batman";
  overallContainer.appendChild(batmanCharacter);

  var listOfOptions = document.querySelectorAll(".character");

  for (var i = 0; i < listOfOptions.length; i++) {
    listOfOptions[i].addEventListener("click", function() {
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
    });
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
    row.classList.add("rows");
    var gridRow = [];
    jsGrid.push(gridRow);

    for (var j = 0; j < totalColumns; j++) {
      var column = document.createElement("td");
      column.id = "c" + j;
      column.classList.add("columns");
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
  createEnemy(starterEnemy[0]);
  createEnemy(starterEnemy[1]);
  createEnemy(starterEnemy[2]);
  createEnemy(starterEnemy[3]);
  movePlayer();
  enemyBehaviour(starterEnemy[0]);
  enemyBehaviour(starterEnemy[1]);
  enemyBehaviour(starterEnemy[2]);
  enemyBehaviour(starterEnemy[3]);
  createRandomEnemy();
  timer = setInterval(countup, 1000);
}

//creating the starting point of the player
function createPlayer() {
  currentCoordinateY = totalRows - 1;
  currentCoordinateX = totalColumns - 1;
  jsGrid[currentCoordinateY][currentCoordinateX] = "X";

  var mapGridValue = "#r" + currentCoordinateY + " #c" + currentCoordinateX;
  var mapGrid = document.querySelector(mapGridValue);
  var player = document.createElement("img");
  player.id = "player";
  player.src = selectedCharacter.frontView;
  mapGrid.appendChild(player);
}

function createExit() {
  jsGrid[0][0] = "E";
  var exitDom = document.querySelector("#r0 #c0");
  var exit = document.createElement("img");
  exit.id = "exit";
  exit.src = "images/exit.jpg";
  exitDom.appendChild(exit);
}

function createEnemy(enemyId) {
  var enemyCoordinateY = enemyId[0];
  var enemyCoordinateX = enemyId[1];
  jsGrid[enemyCoordinateY][enemyCoordinateX] = "Y";

  var enemyGridValue = "#r" + enemyCoordinateY + " #c" + enemyCoordinateX;
  var enemyGrid = document.querySelector(enemyGridValue);
  var enemy = document.createElement("img");
  enemy.id = enemyId[3];
  enemy.src = selectedEnemy.frontView;
  enemyGrid.appendChild(enemy);
}

function createRandomEnemy() {
  enemyGenerator = setInterval(function() {
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
    var randomPlotEnemy = "#r" + randomOuterGrid + " #c" + randomInnerGrid;
    var randomEnemyGrid = document.querySelector(randomPlotEnemy);
    var randomEnemy = document.createElement("img");
    randomEnemy.id = "randEnemy" + newEnemySpawn;
    enemyNew.push(randomEnemy.id);
    randomEnemy.src = selectedEnemy.frontView;
    randomEnemyGrid.append(randomEnemy);
    addSound("Roundhouse Kick-SoundBible.com-1663225804.mp3");
    newEnemySpawn += 1;

    setTimeout(function() {
      enemyBehaviour(enemyNew);
    }, 500);
  }, 3000);
}

//finding the currnent co-ordinates of the the player
function plottingPlayer(Y, X, view) {
  var mapGridValue = "#r" + Y + " #c" + X;
  var mapGrid = document.querySelector(mapGridValue);
  var player = document.getElementById("player");
  player.src = view;
  mapGrid.appendChild(player);
}

function plottingEnemy(enemyId, Y, X, view) {
  var enemyGridValue = "#r" + Y + " #c" + X;
  var enemyGrid = document.querySelector(enemyGridValue);
  const enemy = document.getElementById(enemyId);
  enemy.src = view;
  enemyGrid.appendChild(enemy);
}

//getting the value of the key pressed and moving the character to the specified direction
function movePlayer() {
  var move = function(event) {
    if (gameover === true) {
      window.removeEventListener("keydown", move);
    }

    var events = event.key;

    if (event.repeat === false) {
      if (events === "ArrowUp" && currentCoordinateY > 0) {
        if (jsGrid[currentCoordinateY - 1][currentCoordinateX] !== "*") {
          if (jsGrid[currentCoordinateY - 1][currentCoordinateX] === "Y") {
            gameOver();
          } else if (
            jsGrid[currentCoordinateY - 1][currentCoordinateX] === "E"
          ) {
            win();
          } else {
            //to plot the co-ordinate of he player before moving
            plottingPlayer(
              currentCoordinateY - 1,
              currentCoordinateX,
              selectedCharacter.backView
            );
            jsGrid[currentCoordinateY - 1][currentCoordinateX] = "X";
            currentCoordinateY -= 1;
            //to plot the co-ordinate of the player after moving
            jsGrid[currentCoordinateY + 1][currentCoordinateX] = " ";
          }
        }
      } else if (
        events === "ArrowDown" &&
        currentCoordinateY < jsGrid.length - 1
      ) {
        if (jsGrid[currentCoordinateY + 1][currentCoordinateX] !== "*") {
          if (jsGrid[currentCoordinateY + 1][currentCoordinateX] === "Y") {
            gameOver();
          } else if (
            jsGrid[currentCoordinateY + 1][currentCoordinateX] === "E"
          ) {
            win();
          } else {
            plottingPlayer(
              currentCoordinateY + 1,
              currentCoordinateX,
              selectedCharacter.frontView
            );
            jsGrid[currentCoordinateY + 1][currentCoordinateX] = "X";
            currentCoordinateY += 1;
            jsGrid[currentCoordinateY - 1][currentCoordinateX] = " ";
          }
        }
      } else if (events === "ArrowLeft" && currentCoordinateX > 0) {
        if (jsGrid[currentCoordinateY][currentCoordinateX - 1] !== "*") {
          if (jsGrid[currentCoordinateY][currentCoordinateX - 1] === "Y") {
            gameOver();
          } else if (
            jsGrid[currentCoordinateY][currentCoordinateX - 1] === "E"
          ) {
            win();
          } else {
            plottingPlayer(
              currentCoordinateY,
              currentCoordinateX - 1,
              selectedCharacter.leftView
            );
            jsGrid[currentCoordinateY][currentCoordinateX - 1] = "X";
            currentCoordinateX -= 1;
            jsGrid[currentCoordinateY][currentCoordinateX + 1] = " ";
          }
        }
      } else if (
        events === "ArrowRight" &&
        currentCoordinateX < jsGrid[0].length - 1
      ) {
        if (jsGrid[currentCoordinateY][currentCoordinateX + 1] !== "*") {
          if (jsGrid[currentCoordinateY][currentCoordinateX + 1] === "Y") {
            gameOver();
          } else if (
            jsGrid[currentCoordinateY][currentCoordinateX + 1] === "E"
          ) {
            win();
          } else {
            plottingPlayer(
              currentCoordinateY,
              currentCoordinateX + 1,
              selectedCharacter.rightView
            );
            jsGrid[currentCoordinateY][currentCoordinateX + 1] = "X";
            currentCoordinateX += 1;
            jsGrid[currentCoordinateY][currentCoordinateX - 1] = " ";
          }
        }
      }
    }
  };

  window.addEventListener("keydown", move);
}

// creating a random number
function randomness(number) {
  var randomNo = Math.floor(Math.random() * number);

  return randomNo;
}

// set timeout to end game after 20s and show stage lvl
function createBoundaries() {
  for (var i = 1; i < totalColumns - 1; i++) {
    if (i % 3 === 0) {
      jsGrid[1][i] = "*";
      jsGrid[totalRows - 2][i] = "*";
      var setBoundariesImageTop = "#r" + 1 + " #c" + i;
      var setBoundariesImageBottom = "#r" + (totalRows - 2) + " #c" + i;
      var obstacleTop = document.querySelector(setBoundariesImageTop);
      obstacleTop.style.backgroundImage = `url(${selectedObstacle.image})`;
      var obstacleBottom = document.querySelector(setBoundariesImageBottom);
      obstacleBottom.style.backgroundImage = `url(${selectedObstacle.image})`;
    }
  }

  for (var i = 1; i < totalRows - 1; i++) {
    if (i % 3 === 0) {
      jsGrid[i][1] = "*";
      jsGrid[i][totalColumns - 2] = "*";
      var setBoundariesImageLeft = "#r" + i + " #c" + 1;
      var setBoundariesImageRight = "#r" + i + " #c" + (totalColumns - 2);
      var obstacleLeft = document.querySelector(setBoundariesImageLeft);
      obstacleLeft.style.backgroundImage = `url(${selectedObstacle.image})`;
      var obstacleRight = document.querySelector(setBoundariesImageRight);
      obstacleRight.style.backgroundImage = `url(${selectedObstacle.image})`;
    }
  }

  jsGrid[0][totalColumns - 1] = "*";
  jsGrid[totalRows - 1][0] = "*";
  var setBoundariesImageTopRight = "#r0 #c" + (totalColumns - 1);
  var setBoundariesImageBottomLeft = "#r" + (totalRows - 1) + " #c0";
  var obstacleTopRight = document.querySelector(setBoundariesImageTopRight);
  obstacleTopRight.style.backgroundImage = `url(${selectedObstacle.image})`;
  var obstacleBottomLeft = document.querySelector(setBoundariesImageBottomLeft);
  obstacleBottomLeft.style.backgroundImage = `url(${selectedObstacle.image})`;

  var totalInnerBoundaries = Math.round(
    ((totalRows - 4) * (totalColumns - 4)) / 5
  );

  for (var i = 0; i <= totalInnerBoundaries; i++) {
    var randomColumn = randomness(totalColumns - 3) + 2;
    var randomRow = randomness(totalRows - 3) + 2;

    while (jsGrid[randomRow][randomColumn] !== " ") {
      randomColumn = randomness(totalColumns - 3) + 2;
      randomRow = randomness(totalRows - 3) + 2;
    }

    jsGrid[randomRow][randomColumn] = "*";
    var onGridValue = "#r" + randomRow + " #c" + randomColumn;
    var onGrid = document.querySelector(onGridValue);
    onGrid.style.backgroundImage = `url(${selectedObstacle.image})`;
  }
}

function enemyBehaviour(enemyId) {
  var moveUp = function(enemyId) {
    if (enemyId[0] > 0) {
      if (
        jsGrid[enemyId[0] - 1][enemyId[1]] !== "*" &&
        jsGrid[enemyId[0] - 1][enemyId[1]] !== "E"
      ) {
        //to plot the co-ordinate of he player before moving
        if (jsGrid[enemyId[0] - 1][enemyId[1]] !== "X") {
          plottingEnemy(
            enemyId[3],
            enemyId[0] - 1,
            enemyId[1],
            selectedEnemy.backView
          );
          jsGrid[enemyId[0] - 1][enemyId[1]] = "Y";
          enemyId[0] -= 1;
          jsGrid[enemyId[0] + 1][enemyId[1]] = " ";
          enemyId[2] = "ok";
        } else {
          gameOver();
        }
      } else {
        enemyId[2] = "notOk";
      }
    } else {
      enemyId[2] = "notOk";
    }
  };

  var moveDown = function(enemyId) {
    if (enemyId[0] < jsGrid.length - 1) {
      if (
        jsGrid[enemyId[0] + 1][enemyId[1]] !== "*" &&
        jsGrid[enemyId[0] + 1][enemyId[1]] !== "E"
      ) {
        //to plot the co-ordinate of he player before moving
        if (jsGrid[enemyId[0] + 1][enemyId[1]] !== "X") {
          plottingEnemy(
            enemyId[3],
            enemyId[0] + 1,
            enemyId[1],
            selectedEnemy.frontView
          );
          jsGrid[enemyId[0] + 1][enemyId[1]] = "Y";
          enemyId[0] += 1;
          jsGrid[enemyId[0] - 1][enemyId[1]] = " ";
          enemyId[2] = "ok";
        } else {
          gameOver();
        }
      } else {
        enemyId[2] = "notOk";
      }
    } else {
      enemyId[2] = "notOk";
    }
  };

  var moveLeft = function(enemyId) {
    if (enemyId[1] > 0) {
      if (
        jsGrid[enemyId[0]][enemyId[1] - 1] !== "*" &&
        jsGrid[enemyId[0]][enemyId[1] - 1] !== "E"
      ) {
        //to plot the co-ordinate of he player before moving
        if (jsGrid[enemyId[0]][enemyId[1] - 1] !== "X") {
          plottingEnemy(
            enemyId[3],
            enemyId[0],
            enemyId[1] - 1,
            selectedEnemy.leftView
          );
          jsGrid[enemyId[0]][enemyId[1] - 1] = "Y";
          enemyId[1] -= 1;
          jsGrid[enemyId[0]][enemyId[1] + 1] = " ";
          enemyId[2] = "ok";
        } else {
          gameOver();
        }
      } else {
        enemyId[2] = "notOk";
      }
    } else {
      enemyId[2] = "notOk";
    }
  };

  var moveRight = function(enemyId) {
    if (enemyId[1] < jsGrid[0].length - 1) {
      if (
        jsGrid[enemyId[0]][enemyId[1] + 1] !== "*" &&
        jsGrid[enemyId[0]][enemyId[1] + 1] !== "E"
      ) {
        //to plot the co-ordinate of he player before moving
        if (jsGrid[enemyId[0]][enemyId[1] + 1] !== "X") {
          plottingEnemy(
            enemyId[3],
            enemyId[0],
            enemyId[1] + 1,
            selectedEnemy.rightView
          );
          jsGrid[enemyId[0]][enemyId[1] + 1] = "Y";
          enemyId[1] += 1;
          jsGrid[enemyId[0]][enemyId[1] - 1] = " ";
          enemyId[2] = "ok";
        } else {
          gameOver();
        }
      } else {
        enemyId[2] = "notOk";
      }
    } else {
      enemyId[2] = "notOk";
    }
  };

  var intervalForMoving = setInterval(function() {
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

        while (enemyId[2] === "notOk") {
          pickRandomMovement = randomness(options.length);
          options[pickRandomMovement](enemyId);
        }
      }
    } else if (valueDifferenceX < valueDifferenceY && differenceX > 0) {
      moveLeft(enemyId);

      if (enemyId[2] === "notOk") {
        var pickRandomMovement = randomness(options.length);
        options[pickRandomMovement](enemyId);

        while (enemyId[2] === "notOk") {
          pickRandomMovement = randomness(options.length);
          options[pickRandomMovement](enemyId);
        }
      }
    } else if (valueDifferenceY < valueDifferenceX && differenceY < 0) {
      moveDown(enemyId);

      if (enemyId[2] === "notOk") {
        var pickRandomMovement = randomness(options.length);
        options[pickRandomMovement](enemyId);

        while (enemyId[2] === "notOk") {
          pickRandomMovement = randomness(options.length);
          options[pickRandomMovement](enemyId);
        }
      }
    } else if (valueDifferenceY < valueDifferenceX && differenceY > 0) {
      moveUp(enemyId);

      if (enemyId[2] === "notOk") {
        var pickRandomMovement = randomness(options.length);
        options[pickRandomMovement](enemyId);

        while (enemyId[2] === "notOk") {
          pickRandomMovement = randomness(options.length);
          options[pickRandomMovement](enemyId);
        }
      }
    } else if (valueDifferenceY === 0 && differenceX > 0) {
      moveLeft(enemyId);

      if (enemyId[2] === "notOk") {
        var pickRandomMovement = randomness(options.length);
        options[pickRandomMovement](enemyId);

        while (enemyId[2] === "notOk") {
          pickRandomMovement = randomness(options.length);
          options[pickRandomMovement](enemyId);
        }
      }
    } else if (valueDifferenceY === 0 && differenceX < 0) {
      moveRight(enemyId);

      if (enemyId[2] === "notOk") {
        var pickRandomMovement = randomness(options.length);
        options[pickRandomMovement](enemyId);

        while (enemyId[2] === "notOk") {
          pickRandomMovement = randomness(options.length);
          options[pickRandomMovement](enemyId);
        }
      }
    } else if (valueDifferenceX === 0 && differenceY > 0) {
      moveUp(enemyId);

      if (enemyId[2] === "notOk") {
        var pickRandomMovement = randomness(options.length);
        options[pickRandomMovement](enemyId);

        while (enemyId[2] === "notOk") {
          pickRandomMovement = randomness(options.length);
          options[pickRandomMovement](enemyId);
        }
      }
    } else if (valueDifferenceX === 0 && differenceY < 0) {
      moveDown(enemyId);

      if (enemyId[2] === "notOk") {
        var pickRandomMovement = randomness(options.length);
        options[pickRandomMovement](enemyId);

        while (enemyId[2] === "notOk") {
          pickRandomMovement = randomness(options.length);
          options[pickRandomMovement](enemyId);
        }
      }
    } else if (valueDifferenceX === valueDifferenceY) {
      var pickRandomMovement = randomness(options.length);
      options[pickRandomMovement](enemyId);

      while (enemyId[2] === "notOk") {
        pickRandomMovement = randomness(options.length);
        options[pickRandomMovement](enemyId);
      }
    }
  }, 290);

  enemyMovements.push(intervalForMoving);
}

var gameOver = function() {
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
  document
    .getElementsByTagName("button")[0]
    .addEventListener("click", function() {
      location.reload();
    });

  for (var i = 0; i < enemyMovements.length; i++) {
    clearInterval(enemyMovements[i]);
  }

  clearInterval(timer);
  clearInterval(enemyGenerator);
};

var win = function() {
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
  if (typeof Storage !== undefined) {
    if (localStorage.getItem("highScore") !== null) {
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
    highScore.innerHTML =
      "LEADERBOARD: " +
      localStorage.getItem("leaderboardInitials") +
      " " +
      localStorage.getItem("highScore");
    highScore.classList.add("highscore");
    overallContainer.appendChild(highScore);
  }

  overallContainer.appendChild(showScore);
  overallContainer.appendChild(restart);
  document
    .getElementsByTagName("button")[0]
    .addEventListener("click", function() {
      location.reload();
    });

  for (var i = 0; i < enemyMovements.length; i++) {
    clearInterval(enemyMovements[i]);
  }

  clearInterval(timer);
  clearInterval(enemyGenerator);
};

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
}

window.onload = function() {
  pickTheme();
};
