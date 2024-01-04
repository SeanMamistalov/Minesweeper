'use strict'

var gIsHint;
var totalSeconds = 0;
var gHints;
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var gLives;
var gTimer;
var gBoard;
var gSafeClickCount = 0
var gIsSafeOn = false;
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
