'use strict';

var gBoard; //  A 2D Matrix containing cell objects: Each has a cell object
var gFirstClick = true;
var gIsHintMode = false;
var gHistory = [];
var gDuringHint = false;
var gUsedHint;
var gStatusBar;
var gSmileyIndicator;
var gFlags = 0; // total flags on map - not necessarily correct
var gFlaggedMines = 0; // total currect flags
var gTimer;
var gOpenCell;
var gEmpty;


//var cell = {  ===>  Example
//    minesAroundCount: 4,
//    isShown: true,
//    isMine: false,
//    isMarked: true
//}

var gLevel = {
    SIZE: 4,
    MINES: 2,
    LIVES: 3,
    SMOVES: 3
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function initGame(size) {
    gGame.isOn = true;
    gFirstClick = true;
    gLevel.SIZE = size;
    gLevel.MINES = 2;
    gBoard = buildBoard(gLevel.SIZE);
    renderBoard(gBoard);
    gStatusBar = document.querySelector(".statusBar");
    gSmileyIndicator = document.querySelector(".smiley");
    gStatusBar.innerHTML = 'Click anywhere on the board...';
    gSmileyIndicator.innerHTML = '😃';
    gFlags = 0; // total flags on map - not necessarily correct
    gFlaggedMines = 0;
    gUsedHint = 0;
    gLevel.LIVES = 3;
    gIsHintMode = false;
    gLevel.SMOVES = 3;
    document.querySelector('.safe-move').innerText = `Safe Move (${gLevel.SMOVES} left)`;
    clearInterval(gTimer);

    //gOpenCell = 0;
    //gEmpty = (gLevel.SIZE*gLevel.SIZE) - gLevel.MINES  ;
    //console.log('gEmpty: ', gEmpty);
    document.querySelector('.hintBar').classList.add("hide");

    document.querySelector('.hint1').classList.remove('hide');
    document.querySelector('.hint2').classList.remove('hide');
    document.querySelector('.hint3').classList.remove('hide');
    document.querySelector('.hint1').classList.remove('mark');
    document.querySelector('.hint2').classList.remove('mark');
    document.querySelector('.hint3').classList.remove('mark');

}

function buildBoard(size) { // Builds the data structure
    var board = [];
    for (var i = 0; i < size; i++) { // put empty cells in the data array
        board.push([]);
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
        }
    }
    return (board);
}

function renderBoard(board) {
    var size = gLevel.SIZE;
    var tableStr = '<table>';

    for (var i = 0; i < size; i++) {
        tableStr += '<tr>';
        for (var j = 0; j < size; j++) {
            tableStr += `<td class="cell c${i}${j}`;
            if (gBoard[i][j].isShown == true) {
                tableStr += ` uncovered`
            }
            tableStr += `" data-i=${i} data-j=${j} onclick ="cellClicked(this,${i},${j})">${getSymbol(i,j)}</td>`;
        }
        tableStr += '</tr>';
    }

    tableStr += '</table>'

    var boardEl = document.querySelector(".board");
    boardEl.innerHTML = tableStr;
}

function setMinesNegsCount(i, j) { // goes around a mine and increases the minesAroundCount to +1
    for (var y = i - 1; y < (i + 2); y++) {
        for (var x = j - 1; x < (j + 2); x++) {
            if (isOnBoard(y, x)) {
                gBoard[y][x].minesAroundCount++;
            }
        }
    }
}

function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return;
    if (gDuringHint) return;

    if (gIsHintMode === true) {
        gDuringHint = true; // this var allows disabling everything else durig the 1 sec when the hint is shown
        var temp = [];
        var ii = 0;

        for (var y = i - 1; y < i + 2; y++) { // save a snapshot of the hint area
            for (var x = j - 1; x < j + 2; x++) {
                if (isOnBoard(y, x)) {
                    temp.push(gBoard[y][x].isShown);
                    gBoard[y][x].isShown = true;
                }
            }
        }

        renderBoard(gBoard);

        setTimeout(function () {

            for (var y = i - 1; y < i + 2; y++) { // restore the revealed hint cells
                for (var x = j - 1; x < j + 2; x++) {
                    if (isOnBoard(y, x)) {
                        gBoard[y][x].isShown = temp[ii];
                        ii++;
                    }
                }
            }
            renderBoard(gBoard);
            gIsHintMode = false;
            gDuringHint = false;
            gUsedHint.classList.add("hide");
            if (gGame.isOn) gStatusBar.innerHTML = 'Back to the game...';

        }, 1000);
    } else { // not asking for hint - regular game

        if (gBoard[i][j].isMarked) return;

        if (gFirstClick) {
            putMines(i, j); // put mines anywhere BUT i,j
            gFirstClick = false;
            renderBoard(gBoard);
            var hintEl = document.querySelector('.hintBar');
            hintEl.classList.remove("hide"); //show the bulbs after the first click
            gStatusBar.innerHTML = 'Now you can use the hints';
            timer();
        }

        if (gBoard[i][j].minesAroundCount < 1) { // if negs==0 - go recursion!
            expandShown(i, j);
        }

        gBoard[i][j].isShown = true; // update data

        renderBoard(gBoard);
        revealCell(elCell, i, j);

        if (gBoard[i][j].isMine) {
            gLevel.LIVES--;
            document.querySelector('.lives-monitor').innerText = `Lives: ${gLevel.LIVES} `;
            gStatusBar.innerHTML = 'BOOM!  Lives left: ' + gLevel.LIVES;
            elCell.classList.add('mark');

            if (gLevel.LIVES < 1) {
                gGame.isOn = false;
                gSmileyIndicator.innerHTML = '😵';
                gStatusBar.innerHTML = 'Game Over';
                clearInterval(gTimer);

            }
        }
    }
    if (checkWin()) doWin();
}

function showHint(element) {
    if (!gGame.isOn) return;

    if (gIsHintMode) return;
    if (gFirstClick) return;
    element.classList.add('mark');
    gIsHintMode = true;
    gUsedHint = element;
    gStatusBar.innerHTML = 'Click anywhere on the board to get a hint';
}

function rightClickFunc(element) {
    if (!gGame.isOn) return;
    if (element == undefined) {
        return;
    }

    var i = +element.toElement.dataset.i;
    var j = +element.toElement.dataset.j;

    if (gBoard[i][j].isMarked) { // if already has flag
        gBoard[i][j].isMarked = false; // unflag it
        gFlags--; // total --
        if (gBoard[i][j].isMine) {
            gFlaggedMines--;
        }
    } else { // if no flag
        gBoard[i][j].isMarked = true; //  flag it!
        gFlags++;
        if (gBoard[i][j].isMine) {
            gFlaggedMines++;
        }
    }


    renderBoard(gBoard);
    if (checkWin()) doWin();
}

function checkWin() {
    var shownNonMine = 0;

    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if ((gBoard[i][j].isShown == true) && (gBoard[i][j].isMine === false)) {
                shownNonMine++;
            }
        }
    }

    var NonMines = (gLevel.SIZE * gLevel.SIZE) - gLevel.MINES;

    if ((gFlaggedMines == gFlags) && (gFlaggedMines == gLevel.MINES) && (shownNonMine == NonMines)) return true
    else return false

}

function doWin() {
    gGame.isOn = false;
    gStatusBar.innerText = 'You made it, soldier!';
    gSmileyIndicator.innerHTML = '😎';
    clearInterval(gTimer);

}

function expandShown(i, j) {

    if (!isOnBoard(i, j)) return;
    if (gBoard[i][j].isShown === true) return; // prevents endless recursion
    if (gBoard[i][j].minesAroundCount > 0) {
        gBoard[i][j].isShown = true;
        return;
    }

    gBoard[i][j].isShown = true;
    //renderBoard(gBoard);

    expandShown(i - 1, j);
    expandShown(i + 1, j);
    expandShown(i, j - 1);
    expandShown(i, j + 1);
}

function safeMove() {

    if (gFirstClick) {
        document.querySelector('.statusBar').innerText = 'This is only available after the first move';
        return;
    }

    if (gLevel.SMOVES < 1) return;

    // create an array of arrays of relevant cells
    var bank = [];

    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if ((!gBoard[i][j].isMarked) && (!gBoard[i][j].isShown) && (!gBoard[i][j].isMine)) {
                bank.push([i, j]);
            }
        }
    }

    if (bank.length === 0) {
        document.querySelector('.statusBar').innerText = 'There are no more safe moves...';
        return;
    }

    //make a random number betwen 0 and the array length
    var rand = Math.floor(Math.random() * bank.length);


    // mark the cell 
    var y = bank[rand][0];
    var x = bank[rand][1];



    var tempString = "c" + y + x;

    var cellEl = document.querySelector(`.${tempString}`);
    cellEl.classList.add("mark-safe");

    gLevel.SMOVES--;
    document.querySelector('.safe-move').innerText = `Safe Move (${gLevel.SMOVES} left)`;



}