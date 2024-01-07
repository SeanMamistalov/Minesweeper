'use strict'


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
        checkVictory();

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

function onCellClicked(elCell, i, j) {
    if (!gGame.isOn) return;
    var currCell = gBoard[i][j];
    if (currCell.isMarked) return; // Dont allow to click on marked cell
    if (gIsHint) {
        return revealNegs(i, j);
    }
    if (currCell.isShown || currCell.isMarked) return
    showCell (elCell, i , j);
    isFirstClick = false;
    checkVictory(); // Another check for win
    
}

function showCell (elCell, i , j ) {
    var cell = gBoard[i][j] 
    cell.isShown = true;
    if (cell.isMine) {
        isLose(cell, elCell);
        if (gLives === 0) {
            noLives();
        }
    } else if (cell.minesAroundCount) {
        gGame.shownCount++;
        renderCell(cell, cell.minesAroundCount); // When clicking on cell with Negs only show the Num
    } else {
        expandMines(gBoard, i, j) // When clicking on cell without Negs, start showing  
        gGame.shownCount++;
        gClicksNum++;
    }
    elCell.classList.add("opened");
}

function handleFirstClick(cell) {
    gGameInterval = setInterval(startTimer, 3000);
    gBoard = createBoard();
    setMines(cell);
    renderBoard(gBoard);
    isFirstClick = false;
    gClicksNum--;
    gGame.shownCount--;
    // startTimer();
    var elCell = document.querySelector(`.cell-${cell.i}-${cell.j}`);
    onCellClicked(elCell, cell.i, cell.j);
}

function isLose(cell , elCell) {
    if (isFirstClick) {
        return handleFirstClick(cell);
    }

    // Model
    cell.isShown = true;
    // DOM
    elCell.innerHTML = MINE;
    gLives--; 
    renderLives();
    if (gLives === 0) {
        noLives();
    }
}


function noLives() {
    revealAllMine();
    gGame.isOn = false;
    document.querySelector(".restart-btn").innerText = DEAD; // Put a BOMBED face
    var sound = new Audio('audio/losegame.wav') 
    sound.play()
    clearInterval(gGameInterval); // Stop the timer
    return; // Exit the function or handle any other actions needed
}
