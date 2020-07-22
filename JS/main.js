'use strict';

var gBoard; //  A 2D Matrix containing cell objects: Each has a cell object
var gFirstClick = true;

//var cell = {  ===>  Example
//    minesAroundCount: 4,
//    isShown: true,
//    isMine: false,
//    isMarked: true
//}

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function initGame(size) {
    gLevel.SIZE = size;
    gBoard = buildBoard(gLevel.SIZE);
    renderBoard(gBoard);
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
            tableStr += `<td class="cell`;
            if (gBoard[i][j].isShown == true) {
                tableStr += ` uncovered`
            }
            tableStr += `" onclick ="cellClicked(this,${i},${j})">  ${getSymbol(i,j)}  </td>`;
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

    gBoard[i][j].isShown = true; // update data
    if (gFirstClick) {
        putMines(i, j);
        gFirstClick = false;
    }



    renderBoard(); // redraw DOM
}