'use strict'

function onHintClick() {
    if (gHints > 0 && !gIsHint) {
  
      var nonMineCells = [];
      for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
          if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
            nonMineCells.push({ i, j });
          }
        }
      }
  
      if (nonMineCells.length > 0) {
        var randomIndex = Math.floor(Math.random() * nonMineCells.length);
        var randomCell = nonMineCells[randomIndex];
        var elCell = document.querySelector(`.cell-${randomCell.i}-${randomCell.j}`);
        cellClicked(elCell, randomCell.i, randomCell.j);
        
        gHints--; 
      }
    }
  
    renderHints();
  }
  