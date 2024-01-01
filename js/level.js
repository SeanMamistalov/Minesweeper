'use strict'

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