"use strict";

var gSafeClickCount = 0
var gIsSafeOn = false;

function init() {
  gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    markedMines: 0,
    secsPassed: 0,
  };
  gBoard = createBoard();
  setMines();
  renderBoard(gBoard);
  isFirstClick = true;
  minutesLabel.innerHTML = "00";
  secondsLabel.innerHTML = "00";
  totalSeconds = 0;
  gClicksNum = 0;
  if (gLevel.size === 4) {
    gLives = 2; // For the Beginner level
  } else {
    gLives = 3; // For other levels (Professional and Expert)
  }
  gSafeClickCount = 3
  gHints = 3;
  gIsHint = false;
  renderLives();
  renderHints();
  document.querySelector(".restart-btn").innerText = RESTART;
  clearInterval(gGameInterval);
  gGameInterval = setInterval(startTimer, 3000);
}

function createBoard() {
  var size = gLevel.size;

  // console.log("Creating board with size:", size);

  const board = [];

  for (var i = 0; i < size; i++) {
    board[i] = [];
    for (var j = 0; j < size; j++) {
      const cell = {
        i: i,
        j: j,
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
      board[i][j] = cell;
    }
  }

  //console.log("Board created:", board);
  return board;
}

function revealNegs(cellI, cellJ) {
  gIsHint = false;
  var openedCells = [];
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= gBoard[0].length) continue;
      var elCell = document.querySelector(`.cell-${i}-${j}`);
      if (gBoard[i][j].isMine) elCell.innerHTML = MINE;
      else if (gBoard[i][j].minesAroundCount)
        elCell.innerHTML = gBoard[i][j].minesAroundCount;
      elCell.classList.add("opened");
      openedCells.push({ i, j });
    }
  }
  setTimeout(() => {
    for (var i = 0; i < openedCells.length; i++) {
      var currCell = openedCells[i];
      var elCell = document.querySelector(`.cell-${currCell.i}-${currCell.j}`);
      if (!gBoard[currCell.i][currCell.j].isShown) {
        elCell.classList.remove("opened");
        elCell.innerHTML = "";
      }
    }
    gHints--;
    document.querySelector(".hints").innerHTML = HINT.repeat(gHints);
  }, 1000);
}

function restartButton() {
  clearInterval(gGameInterval); // Clear the timer interval
  gClicksNum = 0;
  document.querySelector(".restart-btn").innerText = RESTART;
  init(); // Reinitialize the game
}

function checkVictory() {
  if (gGame.shownCount + gGame.markedMines === gLevel.size * gLevel.size) {
    var sound = new Audio('Audio/win.mp3')
    sound.play()
    gGame.isOn = false;
    clearInterval(gGameInterval);
    document.querySelector(".restart-btn").innerText = WON;
  } else if (gLives === 0) {
    gGame.isOn = false;
    clearInterval(gGameInterval);
    document.querySelector(".restart-btn").innerText = DEAD;
  }
}
