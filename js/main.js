"use strict";

const MINE = "💣";
const FLAG = "🚩";
const LIVE = "💙";
const WON = "🏆 You WON congrats! 🏆";
const HINT = "💡";
const RESTART = "↻";
const DEAD = "💀 Game Over 💀";

var gIsHint;
var totalSeconds = 0;
var gHints;
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var gLives;
var gTimer;
var gBoard;
var gClicksNum;
var isFirstClick;
var gLevel = {
  size: 4,
  mines: 2,
};

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  minesAroundCount: 4,
  isShown: false,
  isMine: false,
  isMarked: true,
};

var gGameInterval = 0;

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
  gHints = 3;
  gIsHint = false;
  renderLives();
  renderHints();
  document.querySelector(".restart-btn").innerText = RESTART;
  clearInterval(gGameInterval);
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
function renderBoard(board) {
  var strHTML = "";
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>";
    for (var j = 0; j < board[0].length; j++) {
      var currCell = gBoard[i][j];
      var className = getClassName({ i, j });
      if (currCell.isMine) className += " mine"; // Add 'mine' class for every Mine
      var minesCount = setMinesNegsCount(board, i, j);
      currCell.minesAroundCount = minesCount; // Add the negMines to every cell object
      strHTML += `<td class="cell ${className}"
      onclick="cellClicked(this, ${i},${j})"
      oncontextmenu="onRightClick(this, ${i},${j}, event)" ></td>`;
    }
    strHTML += "</tr>";
  }
  const elBoard = document.querySelector(".board");
  elBoard.innerHTML = strHTML;
}

function expandMines(board, rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue;
      if (j < 0 || j >= board[0].length) continue;
      var currCell = board[i][j];
      if (!currCell.isMine && !currCell.isMarked && !currCell.isShown) {
        // Reach only Empty/Negs Cells
        // Model
        currCell.isShown = true;
        gGame.shownCount++;
        //DOM
        document.querySelector(".cell-" + i + "-" + j).classList.add("opened");
        if (currCell.minesAroundCount)
          renderCell(currCell, currCell.minesAroundCount); // Cell with Negs
        else expandMines(gBoard, i, j); // Cell without Negs, run the show again 😎
      }
    }
  }
}
function setMinesNegsCount(board, rowIdx, colIdx) {
  var minesCountAround = 0;
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i >= 0 && i < board.length && j >= 0 && j < board[0].length) {
        if (board[i][j].isMine) {
          minesCountAround++;
        }
      }
    }
  }
  console.log(`Mines around cell[${rowIdx}][${colIdx}]: ${minesCountAround}`);

  return minesCountAround;
}

function setMines() {
  var minesNum = gLevel.mines;
  var minesPlaced = 0;

  while (minesPlaced < minesNum) {
    var randRow = getRandomInt(0, gBoard.length);
    var randCol = getRandomInt(0, gBoard[0].length);

    if (!gBoard[randRow][randCol].isMine) {
      gBoard[randRow][randCol].isMine = true;
      minesPlaced++;
    }
  }
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

function onRightClick(elCell, i, j) {
  event.preventDefault();
  if (gBoard[i][j].isMarked) {
    // Right click on a Marked cell
    gGame.markedCount--;
    // Model
    gBoard[i][j].isMarked = false;
    //DOM
    elCell.innerHTML = "";
    gClicksNum++;
    if (gBoard[i][j].isMine) gGame.markedMines--;
  } else {
    // Right click on any other cell
    if (gGame.markedCount === gLevel.mines) return; // Dont allow to use more flag than mines
    gClicksNum++;
    startTimer();
    gGame.markedCount++;
    if (gBoard[i][j].isMine) gGame.markedMines++;
    // Model
    gBoard[i][j].isMarked = true;
    //DOM
    elCell.innerHTML = FLAG;
    checkVictory()
  }
}

function cellClicked(elCell, i, j) {
  if (!gGame.isOn) return;
  var currCell = gBoard[i][j];
  if (currCell.isMarked) return; // Dont allow to click on marked cell
  if (gIsHint) {
    return revealNegs(i, j);
  }
  if (!currCell.isShown) {
    // Model
    currCell.isShown = true;
    // DOM
    elCell.classList.add("opened");
    gClicksNum++;
    gGame.shownCount++;
    startTimer(); // Start timer only on first click
    checkVictory(); // Check maybe its the last cell
    if (currCell.isMine) {
      //  console.log('game over') // When clicking on Mine
      if (isFirstClick) {
        return handleFirstClick(currCell);
      }
      // Model
      gBoard[i][j].isShown = true;
      // DOM
      elCell.innerHTML = MINE;
      gLives--; // Remove one Life
      renderLives();
      if (gLives === 0) {
        revealAllMine();
        gGame.isOn = false;
        document.querySelector(".restart-btn").innerText = DEAD; // Put a BOMBED face
        clearInterval(gGameInterval); // Stop the timer
        return; // Exit the function or handle any other actions needed
      }
    } else if (currCell.minesAroundCount) {
      renderCell(currCell, currCell.minesAroundCount); // When clicking on cell with Negs only show the Num
    } else expandMines(gBoard, i, j); // When clicking on cell without Negs, start the Show 😎
  }
  isFirstClick = false;
  checkVictory(); // Another check for win
}

function handleFirstClick(cell) {
  gBoard = createBoard();
  setMines(cell);
  renderBoard(gBoard);
  isFirstClick = false;
  gClicksNum--;
  gGame.shownCount--;

  var elCell = document.querySelector(`.cell-${cell.i}-${cell.j}`);
  cellClicked(elCell, cell.i, cell.j);
}

function drawCell() {
  var randIdx = getRandomInt(0, gBoard.length);
  var rand2ndIdx = getRandomInt(0, gBoard.length);
  var randCell = gBoard[randIdx][rand2ndIdx];
  return randCell;
}

function revealAllMine() {
  // When losing, reveal all the Mines
  var allMines = document.querySelectorAll(".mine");
  allMines.forEach((td) => {
    td.classList.add("opened");
    td.innerHTML = MINE;
  });
}

function startTimer() {
  if (gClicksNum === 1) gGameInterval = setInterval(setTime, 1000);
}

function setTime() {
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

function changeLevel(el) {
  if (el.innerText === "Beginner") {
    gLevel.size = 4;
    gLevel.mines = 2;
  } else if (el.innerText === "Professional") {
    gLevel.size = 8;
    gLevel.mines = 14;
  } else if (el.innerText === "Expert") {
    gLevel.size = 12;
    gLevel.mines = 32;
  }
}

function restartButton() {
  clearInterval(gGameInterval); // Clear the timer interval
  gClicksNum = 0;
  document.querySelector(".restart-btn").innerText = RESTART;
  init(); // Reinitialize the game
}

function renderLives() {
  document.querySelector(".lives").innerText = LIVE.repeat(gLives);
}

function renderHints() {
  document.querySelector(".hints").innerText = HINT.repeat(gHints);
}

function onHintClick() {
  gIsHint = true;
}
  function checkVictory() {
    if (gGame.shownCount + gGame.markedMines === gLevel.size * gLevel.size) {
      gGame.isOn = false;
      clearInterval(gGameInterval);
      document.querySelector(".restart-btn").innerText = WON;
    } else if (gLives === 0) {
      gGame.isOn = false;
      clearInterval(gGameInterval);
      document.querySelector(".restart-btn").innerText = DEAD;
    }
  }