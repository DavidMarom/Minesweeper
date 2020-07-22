function getSymbol(i, j) {
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

function putMine(y, x) {
    gBoard[y][x].isMine = true;
    setMinesNegsCount(y, x);
}

function putMines(i, j) {
    var randX = j;
    var randY = i;
    
    while (randX == j) {
        randX = Math.floor(Math.random() * gLevel.SIZE);
    }

    while (randY == i) {
        randY = Math.floor(Math.random() * gLevel.SIZE);
    }

    putMine(randY, randX);

    randX = Math.floor(Math.random() * gLevel.SIZE);
    randY = Math.floor(Math.random() * gLevel.SIZE);
    putMine(randX, randY);

}