function getSymbol(i, j) { // returns a symbol or number according to the gBoard
    var cell;
    cell = gBoard[i][j];
    if (cell.isShown) { // WHEN VISIBLE
        switch (cell.isMine) {
            case (true):
                return ('💣');
                break;
            case (false):
                if (cell.minesAroundCount != 0) {
                    return (cell.minesAroundCount)
                } else return ('');
                break;
            default:
                return ('n');
        }
    } else { //  WHEN COVERED
        if(cell.isMarked){return '🚩'}
        return ' '
    }
}

function isOnBoard(i, j) {
    if (j < gLevel.SIZE && j > (-1) && i < gLevel.SIZE && i > (-1)) {
        return true
    } else {
        return false
    }
}

function putMine(i, j) {
    gBoard[i][j].isMine = true;
    setMinesNegsCount(i, j);
    
    
}

function putMines(i, j) {
    var randX = j;
    var randY = i;

    while (randX == j && randY == i) { // make sure we dont put a mine where the user first clicked
        randX = Math.floor(Math.random() * gLevel.SIZE);
        randY = Math.floor(Math.random() * gLevel.SIZE);
    }
    
    putMine(randY, randX);

    randX = j;
    randY = i;

    while ((randX == j && randY == i) || (gBoard[randY][randX].isMine===true)) { // make sure we dont put a mine where the user first clicked OR not where mine
         randX = Math.floor(Math.random() * gLevel.SIZE);
         randY = Math.floor(Math.random() * gLevel.SIZE);
     }

     putMine(randY, randX);



}

function revealCell(elCell, i, j) {
    elCell.classList.add('uncovered');
    elCell.innerHTML = getSymbol(i, j);
}