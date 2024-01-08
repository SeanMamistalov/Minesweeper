'use strict'

function safeMode() {
    if (!gSafeClickCount) return;
    if (!gGame.isOn) return
    gIsSafeOn = true;
    var safeClicks = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j];
            if (!currCell.isMine && !currCell.isShown && !currCell.isMarked) {
                safeClicks.push({ i, j });
                var sound = new Audio('audio/safe.mp3')
                sound.volume = 0.1;
                sound.play()
            }
        }
    }
    shuffleArray(safeClicks);
    var safeClick = safeClicks.pop();
    var i = safeClick.i;
    var j = safeClick.j
    var elCell = document.querySelector(`.cell-${i}-${j}`)
    elCell.innerText = 'SAFE'; elCell.style.color = 'blue'
    var elCell = document.querySelector(`.cell-${i}-${j}`);
    // console.log(elCell); 
    // if (!elCell) {
    //     //console.error('No matching element found for selector');
    //     return;

    setTimeout(function () {

    }, 3000)
    gSafeClickCount--
    gIsSafeOn = false;
    document.querySelector('.safe-counter').innerText = gSafeClickCount;

}