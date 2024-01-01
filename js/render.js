'use strict'

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

function renderLives() {
  document.querySelector(".lives").innerText = LIVE.repeat(gLives);
}

function renderHints() {
  document.querySelector(".hints").innerText = HINT.repeat(gHints);
}