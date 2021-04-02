export default class Game {

    size = 0;
    gameState = {
        board: null,
        score: 0,
        won: false,
        over: false,
    };
    largestTile = 0;

    moveListeners = [];
    winListeners = [];
    loseListeners = [];
    
    constructor(size) {
        this.size = size;
        this.setupNewGame();
    }

    //===Listeners===//
    onMove(callback) {
        this.moveListeners.push(callback);
    }
    onWin(callback) {
        this.winListeners.push(callback);
    }
    onLose(callback) {
        this.loseListeners.push(callback);
    }
    //===============//

    //===== Main methods =====//
    setupNewGame() {
        this.gameState.board = new Array(this.size * this.size).fill(0);
        this.gameState.score = 0,
        this.gameState.won = false;
        this.gameState.over = false;
        this.largestTile = 0;

        // Make sure that indices are unique
        let i1 = Math.floor(Math.random() * this.size * this.size);
        let i2;
        do {
            i2 = Math.floor(Math.random() * this.size * this.size);
        } while(i1 == i2);
        this.gameState.board[i1] = (Math.random() < 0.1) ? 4 : 2;
        this.gameState.board[i2] = (Math.random() < 0.1) ? 4 : 2;
    }

    loadGame(gameState) {
        this.gameState = gameState;
    }

    move(direction) {

        // If lost - ignore inputs
        if (this.gameState.over) return false;

        //Board backup to check against later
        let prevBoard = [...this.gameState.board];

        // Check direction and move
        switch(direction) {
            case 'up': this.moveUp(); break;
            case 'down': this.moveDown(); break;
            case 'left': this.moveLeft(); break;
            case 'right': this.moveRight(); break;
        }

        // If move does nothing, ignore everything
        let skipMove = true;
        for (let i = 0; i < prevBoard.length; i++) {
            if (prevBoard[i] != this.gameState.board[i]) {
                skipMove = false;
                break;
            }
        }
        if (skipMove) return false;

        // Look for empty space to put rnd tile
        let emptyIndices = [];
        for (let i = 0; i < this.size * this.size; i++)
            if (this.gameState.board[i] == 0) emptyIndices.push(i);
        // Literal random shenanigans
        let newTilePosition = emptyIndices[
            Math.floor(Math.random() * emptyIndices.length)
        ];
        let newTileValue = (Math.random() < 0.1) ? 4 : 2;
        this.gameState.board[newTilePosition] = newTileValue;

        // Call move listeners
        this.moveListeners.forEach(callback =>
            callback(this.gameState)
        );

        // Check and call lose listeners
        if (emptyIndices.length == 1 && !this.hasMoves()) {
            this.gameState.over = true;
            this.loseListeners.forEach(callback =>
                callback(this.gameState)
            );
        }

        // Check and call win listeners
        if (this.largestTile >= 2048) {
            // Workaround to call win once
            let prevState = this.gameState.won;
            this.gameState.won = true;
            if (prevState != this.gameState.won) {
                this.winListeners.forEach(callback =>
                    callback(this.gameState)
                );
            }
        }

        return true;
    }

    getGameState() {
        return this.gameState;
    }
    //========================//

    // Check if board has possible moves
    hasMoves() {
        let board = boardToMatrix(this.gameState.board, this.size);
        // This looks like ..., 
        // but it is faster than nested if-else's in a loop.
        // Check inner matrix
        for (let y = 1; y < board.length - 1; y++) {
            for (let x = 1; x < board[0].length - 1; x++) {
                // console.log(board[y][x]);
                if (board[y][x] == board[y-1][x] || 
                    board[y][x] == board[y+1][x] || 
                    board[y][x] == board[y][x-1] || 
                    board[y][x] == board[y][x+1])
                    return true;
            }
        }
        // Quick check corners
        let hasMoves = 
            board[0][0] == board[1][0] ||
            board[0][0] == board[0][1] ||
            board[board.length-1][0] == board[board.length-2][0] ||
            board[board.length-1][0] == board[board.length-1][1] ||
            board[0][board.length-1] == board[1][board.length-1] ||
            board[0][board.length-1] == board[0][board.length-2] ||
            board[board.length-1][board.length-1] == board[board.length-2][board.length-1] ||
            board[board.length-1][board.length-1] == board[board.length-1][board.length-2];
        // Check perimeter
        for (let i = 1; i < this.size; i++) {
            if (board[0][i-1] == board[0][i] ||
                board[this.size-1][i-1] == board[this.size-1][i] ||
                board[i-1][0] == board[i][0] ||
                board[i-1][this.size-1] == board[i][this.size-1])
                return true;
        }

        return hasMoves;
    }

    // Shift array left
    shift(arr) {
        let shifted = [];
        // Shift left
        arr.forEach(num => {
            if (num != 0) shifted.push(num);
        });
        return shifted;
    }
    // Shift left and combine
    shiftAdd(arr) {
        // Initial shift
        let shifted = this.shift(arr);

        // Check and combine neighbouring elements
        for (let i = 1; i < shifted.length; i++) {
            if (shifted[i-1] == shifted[i]) {
                shifted[i-1] *= 2;
                shifted[i] = 0;
                // Set largest tile
                this.largestTile = Math.max(this.largestTile, shifted[i-1]);
                // Update score
                this.gameState.score += shifted[i-1];
            }
        }

        // Final shift
        shifted = this.shift(shifted);

        // Fill in zeros
        let d = arr.length - shifted.length;
        for (let i = 0; i < d; i++) shifted.push(0);
        return shifted;
    }

    //=====Move stuff around=====//
    moveUp() {
        // Transpose board matrix to get columns
        let cols = matTranspose(boardToMatrix(this.gameState.board, this.size));
        let newCols = [];
        cols.forEach(col => newCols.push(this.shiftAdd(col)));
        // Rasterize matrix
        this.gameState.board = matrixToBoard(matTranspose(newCols));
    }
    moveDown() {
        // Transpose board matrix to get columns
        let cols = matTranspose(boardToMatrix(this.gameState.board, this.size));
        let newCols = [];
        // Double reverse to shift in opposite direction
        cols.forEach(col => 
            newCols.push(
                this.shiftAdd(col.reverse()).reverse())
        );
        // Rasterize matrix
        this.gameState.board = matrixToBoard(matTranspose(newCols));
    }
    moveLeft() {
        let rows = boardToMatrix(this.gameState.board, this.size);
        let newRows = [];
        rows.forEach(row => newRows.push(this.shiftAdd(row)));
        // Rasterize matrix
        this.gameState.board = matrixToBoard(newRows);
    }
    moveRight() {
        let rows = boardToMatrix(this.gameState.board, this.size);
        let newRows = [];
        // Double reverse to shift in opposite direction
        rows.forEach(row => 
            newRows.push(
                this.shiftAdd(row.reverse()).reverse())
        );
        // Rasterize matrix
        this.gameState.board = matrixToBoard(newRows);
    }
    //===========================//

    // Just print
    toString() {
        let str = "";
        for (let row = 0; row < this.size; row++) {
            let rowStr = "";
            for (let col = 0; col < this.size; col++) {
                let n = this.gameState.board[row * this.size + col];
                rowStr += "[" + n + "]\t";
            }
            str += rowStr + "\n";
        }
        return str;
    }
}

// NEED THIS
// Raster to square matrix
function boardToMatrix(board, size) {
    let matrix = new Array(size);
    for (let row = 0; row < size; row++) {
        matrix[row] = new Array(size);
        for (let col = 0; col < size; col++) {
            matrix[row][col] = board[row * size + col];
        }
    }
    return matrix;
}

// AND THIS
// Matrix to raster
function matrixToBoard(board) {
    let size = board.length;
    let raster = [];
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            raster.push(board[row][col]);
        }
    }
    return raster;
}

// THAT TOO
// Matrix transpose
function matTranspose(mat) {
    let matrix = new Array(mat[0].length);
    for (let row = 0; row < matrix.length; row++) {
        matrix[row] = new Array(mat.length);
        for (let col = 0; col < matrix[0].length; col++) {
            matrix[row][col] = mat[col][row];
        }
    }
    return matrix;
}
