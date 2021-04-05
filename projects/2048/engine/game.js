class Tile {
    static IDCounter = 0;
    id;
    value;
    index; prevIndex

    constructor(index, value) {
        this.id = Tile.IDCounter++;
        this.value = value;
        this.index = index;
        this.prevIndex = index;
    }

    move(newIndex) {
        if (this.index == newIndex) return false;
        this.prevIndex = this.index;
        this.index = newIndex;
        return true;
    }
}

export default class Game {
    gameState = {
        board: null,
        score: 0,
        won: false,
        over: false,
    };
    size = 0;
    largestTileValue = 0;

    // Tile objects. Main array
    tiles = [];
    // Keeping track of tiles
    movedTiles = [];
    deletedTiles = [];
    newTile;

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
    clearTmpArrays() {
        this.movedTiles = [];
        this.deletedTiles = [];
        this.newTile = null;
    }

    setupNewGame() {
        // Empty everything
        this.gameState = {
            board: new Array(this.size * this.size).fill(0),
            score: 0,
            won: false,
            over: false,
        };
        this.largestTileValue = 0;
        Tile.IDCounter = 0;
        this.tiles = [];
        this.clearTmpArrays();

        // Create new tiles
        // Make sure that indices are unique
        let i1 = Math.floor(Math.random() * this.size * this.size);
        let i2;
        do {
            i2 = Math.floor(Math.random() * this.size * this.size);
        } while(i1 == i2);
        this.tiles.push(new Tile(i1, (Math.random() < 0.1) ? 4 : 2));
        this.tiles.push(new Tile(i2, (Math.random() < 0.1) ? 4 : 2));
    }

    getGameState() {
        this.gameState.board = new Array(this.size * this.size).fill(0);
        this.tiles.forEach(tile => {
            this.gameState.board[tile.index] = tile.value;
        });
        return this.gameState;
    }

    getTiles() {
        return this.tiles;
    }
    getStateTiles() {
        return {
            moved: this.movedTiles,
            deleted: this.deletedTiles
        };
    }
    getNewTile() {
        return this.newTile;
    }

    loadGame(gameState) {
        this.largestTileValue = 0;
        Tile.IDCounter = 0;
        this.tiles = [];
        this.clearTmpArrays();

        this.gameState = gameState;
        for (let i = 0; i < gameState.board.length; i++) {
            if (gameState.board[i] == 0) continue;
            this.tiles.push(new Tile(i, gameState.board[i]));
            this.largestTileValue = Math.max(this.largestTileValue, gameState.board[i]);
        }
    }

    move(direction) {
        // Clear moved, new and delted tiles arrays
        this.clearTmpArrays();

        // If lost - ignore inputs
        if (this.gameState.over) return false;

        // Check direction and move
        switch(direction) {
            case 'up': this.moveUp(); break;
            case 'down': this.moveDown(); break;
            case 'left': this.moveLeft(); break;
            case 'right': this.moveRight(); break;
        }

        // If move does nothing, ignore everything
        if (this.movedTiles.length == 0) return false;

        // Remove delted tiles
        for (let i = 0; i < this.tiles.length; i++) {
            this.deletedTiles.forEach(delTile => {
                if (delTile.id == this.tiles[i].id) {
                    this.tiles.splice(i, 1);
                    i = Math.max(0, i-1);
                }
            });
        }

        // Look for empty space to put rnd tile
        let emptyIndices = Array.from(Array(this.size * this.size).keys());
        this.tiles.forEach(tile => {
            for (let i = 0; i < emptyIndices.length; i++) {
                if (tile.index == emptyIndices[i]) {
                    emptyIndices.splice(i, 1);
                    i--;
                }
            }
        });
        let newTileIndex = emptyIndices[
            Math.floor(Math.random() * emptyIndices.length)
        ];
        let newTile = new Tile(newTileIndex, (Math.random() < 0.1) ? 4 : 2);
        this.tiles.push(newTile);
        this.newTile = newTile;

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
        if (this.largestTileValue >= 2048) {
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
    //========================//

    // Check if board has possible moves
    hasMoves() {
        for (let i = 0; i < this.tiles.length; i++) {
            let tile = this.tiles[i];
            for (let j = 0; j < this.tiles.length; j++) {
                if (i == j) continue;
                let nbr = this.tiles[j];
                // Check if two tile are neighbours
                if ((
                        tile.index == nbr.index + 1
                        || tile.index == nbr.index - 1
                        || tile.index == nbr.index + this.size
                        || tile.index == nbr.index - this.size)                     
                    && !(
                        tile.index % 4 != nbr.index % 4
                        && Math.floor(tile.index / 4) != Math.floor(nbr.index / 4))
                    ) {
                        // If same value - at least one valid move
                        if (tile.value == nbr.value) return true;
                }
            }   
        }
        return false;
    }

    // Shift array left
    shift(dirTiles, offset, dir) {
        // Calcualte new indices
        let indexStep = (dir.includes('x')) ? 1 : this.size;
        let indexStart = offset * ((dir.includes('x')) ? this.size : 1);
        for (let i = 0; i < dirTiles.length; i++) {
            // if (this.movedTiles.includes(dirTiles[i])) continue;

            let scaledIndex = i * indexStep + indexStart;
            if (dir.includes('-'))
                scaledIndex = (this.size - i - 1) * indexStep + indexStart;
            
            // Set new index
            if (dirTiles[i].move(scaledIndex)) {
                this.movedTiles.push(dirTiles[i]);
            }
        }

        return dirTiles;
    }
    // Shift left and combine
    shiftAdd(offset, dir) {
        // Calculate boundaries
        let xOffset = (dir.includes('x')) ? 0 : offset;
        let yOffset = (dir.includes('y')) ? 0 : offset;
        let xDir = (dir.includes('x')) ? 1 : 0;
        let yDir = (dir.includes('y')) ? 1 : 0;
        xDir *= (dir.includes('-')) ? -1 : 1;
        yDir *= (dir.includes('-')) ? -1 : 1;
        // Find the tiles and shift
        let tmp = [];
        this.tiles.forEach(tile => {
            let x = tile.index % this.size;
            let y = Math.floor(tile.index / this.size);
            if (x >= xOffset
                && x <= xOffset + Math.abs(xDir * this.size)
                && y >= yOffset
                && y <= yOffset + Math.abs(yDir * this.size)) {
                    tmp.push(tile);
            }
        });
        tmp.sort((a, b) => a.index - b.index);
        // Reverse if shift in opposite direction
        let dirTiles = tmp;
        if (dir.includes('-')) dirTiles = tmp.reverse();

        // Shift array
        dirTiles = this.shift(dirTiles, offset, dir);

        // Check and combine neighbouring elements
        for (let i = 1; i < dirTiles.length; i++) {
            if (dirTiles[i-1].value == dirTiles[i].value) {
                dirTiles[i-1].value *= 2;

                // Sync movement
                dirTiles[i].index = dirTiles[i-1].index;
                this.movedTiles.push(dirTiles[i]);
                this.deletedTiles.push(dirTiles.splice(i, 1)[0]);

                // Set largest tile
                this.largestTileValue = Math.max(this.largestTileValue, dirTiles[i-1].value);
                // Update score
                this.gameState.score += dirTiles[i-1].value;
            }
        }

        // Second shift
        dirTiles = this.shift(dirTiles, offset, dir);

        // Sync movement
        // this.deletedTiles.forEach(delTile => {
        //     dirTiles.forEach(dirTile => {
        //         if (delTile.index == dirTile.prevIndex)
        //             delTile.index = dirTile.index;
        //     });
        // });
    }

    //=====Move stuff around=====//
    moveUp() {
        for (let col = 0; col < this.size; col++) {
            this.shiftAdd(col, 'y');
        }
    }
    moveDown() {
        for (let col = 0; col < this.size; col++) {
            this.shiftAdd(col, '-y');
        }
    }
    moveLeft() {
        for (let row = 0; row < this.size; row++) {
            this.shiftAdd(row, 'x');
        }
    }
    moveRight() {
        for (let row = 0; row < this.size; row++) {
            this.shiftAdd(row, '-x');
        }
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
