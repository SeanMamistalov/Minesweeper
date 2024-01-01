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
        } else expandMines(gBoard, i, j); // When clicking on cell without Negs, start showing  
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
