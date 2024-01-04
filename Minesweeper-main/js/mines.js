'use strict'

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

function revealAllMine() {
  // When losing, reveal all the Mines
  var allMines = document.querySelectorAll(".mine");
  allMines.forEach((td) => {
    td.classList.add("opened");
    td.innerHTML = MINE;
  });
}