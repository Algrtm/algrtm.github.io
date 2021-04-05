export default class Board {
    game;
    JTiles = [];

    boardDOM = $("#board");
    ambientLight = false;

    animationDuration = 0.15; // Seconds
    isMoving;

    boardGap = 20; // Pixels
    tileSize;

    constructor(game) {
        this.game = game;

        //=== Game listeners ===//
        game.onMove(gameState => {
            // this.update();
        });
        game.onWin(gameState => {
            $(document.body).addClass("win");
            this.timeoutFlashScreen("You WON!", "You may continue playing", 2000);
        });
        game.onLose(gameState => {
            this.timeoutFlashScreen("You lost :(", "But you can always try again :)", 2000);
        });
        //======================//

        //===== Setup UI =====//
        // Ambient light toggle
        $(document.body).append(createToggle("Ambient light", "ambient"));
        // Reset button event
        $(document.body).on("click", "#ambient", (event) => {
            if (this.ambientLight) {
                this.ambientLight = false;
                this.boardDOM.css("box-shadow", "");
                $("#ambient").removeClass("on");
            } else {
                this.ambientLight = true;
                this.showAmbientLight();
                $("#ambient").addClass("on");
            }
        });

        // Help button
        $(document.body).append(createButton("How to", "help"));
        // Hover over help button
        document.getElementById("help").addEventListener("mouseover", e => {
            this.showFlashScreen("How to play: Use your arrow keys to move the tiles. Tiles with the same number merge into one when they touch.", "Add them up to reach 2048!");
        });
        document.getElementById("help").addEventListener("mouseout", e => {
            this.hideFlashScreen();
        });

        // Reset button
        $(document.body).append(createButton("Reset", "reset"));
        // Reset button event
        $(document.body).on("click", "#reset", (event) => {
            $(document.body).removeClass("win");
            this.boardDOM
                .css("background-color", "")
                .css("box-shadow", "");
            this.game.setupNewGame();
            this.setup();
            this.update();
        });
        //====================//

        this.setup();
    }

    setup() {
        this.JTiles.forEach(tile => {
            tile.remove();
        });
        this.JTiles = [];
        // Setup JQuery tiles (divs)
        this.game.getTiles().forEach(tile => {
            this.JTiles.push(this.createJTile(tile));
        });
        this.boardDOM.append(this.JTiles);

        document.body.onresize = (event) => this.resize();
        this.resize();

        this.isMoving = false;
    }
    resize() {
        let boardSize;

        //=== Desktop version ===//
        if (document.body.clientWidth > document.body.clientHeight) {
            // UI
            $("header").removeAttr("style");
            $("#score").removeAttr("style");
            $("#ambient")
                .addClass("use_hover")
                .css("top", `${(0) * 15 + 5}%`)
                .css("left", "");
            $("#help")
                .addClass("use_hover")
                .css("top", `${(1) * 15 + 5}%`)
                .css("left", "");
            $("#reset")
                .addClass("use_hover")
                .css("top", `${(2) * 15 + 5}%`)
                .css("left", "");
            $("#flash_screen").removeAttr("style");

            // Board
            this.boardGap = 20; // Pixels
            let boardWidth = document.body.clientWidth * 0.8;
            let boardHeight = document.body.clientHeight * 0.8;
            boardSize = Math.min(boardWidth, boardHeight);
        }
        //=== Mobile version ===//
        else {
            // UI
            $("header")
                .css("top", "6%")
                .css("right", "0")
                .css("left", "50%")
                .css("transform", "translate(-50%, -50%)");
            $("#score")
                .css("top", "15%")
                .css("right", "0")
                .css("left", "50%")
                .css("transform", "translate(-50%, -50%)");
            $("#ambient")
                .removeClass("use_hover")
                .css("top", "78%")
                .css("left", "5%");
            $("#help")
                .removeClass("use_hover")
                .css("top", "88%")
                .css("left", "35%");
            $("#reset")
                .removeClass("use_hover")
                .css("top", "88%")
                .css("left", "5%");
            $("#flash_screen")
                .css("width", "100%")
                .css("font-size", "30pt");

            // Board
            this.boardGap = 10; // Pixels
            let boardWidth = document.body.clientWidth;
            let boardHeight = document.body.clientHeight;
            boardSize = Math.min(boardWidth, boardHeight);
        }

        this.boardDOM.css("width", boardSize).css("height", boardSize);

        this.tileSize = boardSize/4 - this.boardGap*5/4;
        this.game.getTiles().forEach(tile => {
            let JTile = this.getJTileById(tile.id);
            let pos = this.getOnBoardPos(tile.index);
            JTile
                .css("width", `${this.tileSize}px`)
                .css("height", `${this.tileSize}px`)
                .css("left", `${pos.x}px`)
                .css("top", `${pos.y}px`); 
        });
    }

    move(direction) {
        return new Promise((resolve, reject) => {
            // If is moving - skip
            if (this.isMoving) return;
            this.isMoving = true;
            // Move and check if cant move - skip
            if (!this.game.move(direction)) {
                this.isMoving = false;
                return;
            }

            let stateTiles = this.game.getStateTiles();
            stateTiles.moved.forEach(tile => {
                let newPos = this.getOnBoardPos(tile.index);
                this.getJTileById(tile.id)
                    .css("left", `${newPos.x}px`)
                    .css("top", `${newPos.y}px`);
            });

            setTimeout(() => {
                stateTiles.deleted.forEach(tile => {
                    this.getJTileById(tile.id).remove();
                });
                this.update();
                this.isMoving = false;
            }, this.animationDuration * 1000);
        });
    }

    update() {
        // Set score
        $("#score_input").text(this.game.getGameState().score);

        if (this.game.getNewTile() != null) {
            let newTile = this.createJTile(this.game.getNewTile());
            this.JTiles.push(newTile);
            this.boardDOM.append(newTile);
        }
        
        // Tile tiles
        this.game.getTiles().forEach(tile => {
            let JTile = this.getJTileById(tile.id);
            // Set tile's value
            JTile.text(tile.value);
            // Decorate
            JTile.css("background-color", colorToCSS(getTileColor(tile.value), 1));
        });

        if (!this.ambientLight) return;
        // Ambient lighting
        this.showAmbientLight();
    }

    createJTile(tile) {
        let pos = this.getOnBoardPos(tile.index);
        return $("<div>")
            .text(tile.value)
            .attr("id", `${tile.id}`)
            .addClass("tile border")
            .css("transition", `all ${this.animationDuration}s ease`)
            .css("width", `${this.tileSize}px`)
            .css("height", `${this.tileSize}px`)
            .css("left", `${pos.x}px`)
            .css("top", `${pos.y}px`);
    }
    getJTileById(id) {
        return $(`#${id}`);
    }
    getOnBoardPos(index) {
        let col = index % 4;
        let row = Math.floor(index / 4);
        return {
            x: col * (this.tileSize + this.boardGap) + this.boardGap,
            y: row * (this.tileSize + this.boardGap) + this.boardGap
        };
    }

    showFlashScreen(text, subtext) {
        // Blur background
        this.boardDOM.addClass("blur");
        // Show text
        let fs = $("#flash_screen");
        fs.text(text);
        fs.addClass("show");
        fs.append($("<div>").attr("id", "flash_screen_subtext").text(subtext));
    }
    hideFlashScreen() {
        // Hide text
        $("#flash_screen").removeClass("show");
        // Remove blur
        this.boardDOM.removeClass("blur");
    }
    timeoutFlashScreen(text, subtext, timeout) {
        // Show text
        this.showFlashScreen(text, subtext)
        // Hide text
        setTimeout(() => {
            this.hideFlashScreen();
        }, timeout);
    }
    showAmbientLight() {
        let average = 0;
        let total = 0;
        this.game.getGameState().board.forEach(value => {
            if (value != 0) {
                average += value;
                total++;
            }
        });
        average /= total;
        let ambientLight = getTileColor(average);
        this.boardDOM.css("box-shadow", `0 0 40px 40px ${colorToCSS(ambientLight, 0.5)}`);
    }
}

// Account for vertical positioning
let UIOffset = 0;
// Create button element
function createButton(text, id) {
    return $("<div>")
        .attr('id', id)
        .addClass("ui use_hover button shadow border")
        .text(text)
        .css("top", `${(UIOffset++) * 15 + 5}%`);
}
// Create toggle element
function createToggle(text, id) {
    return $("<div>")
        .attr('id', id)
        .addClass("ui use_hover toggle shadow border")
        .text(text)
        .css("top", `${(UIOffset++) * 15 + 5}%`);
}

// Tile colors (rgb vectors)
// Gradients from uiGradients.com
let gradient = [
    // JShine
    [18, 194, 233], [196, 113, 237], [246, 79, 89],
    // Wedding Day Blues
    [64, 224, 208], [255, 140, 0], [255, 0, 128],
];
function getGradeing(value, shiftScale) {
    // Math magic
    // Calculate coloring percentage and cgardient shift
    // Yes, this is totally necessary
    let p = value / shiftScale;
    let shift = Math.floor(p);
    p = p % 1;

    // Find two colors to blend
    let g1 = shift % gradient.length;
    let g2 = (shift + 1) % gradient.length;

    // Blend
    return blend(gradient[g1], gradient[g2], p);
}

// Color linear blending
function blend(color1, color2, p) {
    return [
        (1-p) * color1[0] + p * color2[0],
        (1-p) * color1[1] + p * color2[1],
        (1-p) * color1[2] + p * color2[2]
        ];
}

// Tile color according to gradient
function getTileColor(tileValue) {
    return getGradeing(valueToLog2(tileValue), 12.0 / gradient.length);
}

// Convert vector to CSS text
function colorToCSS(color, alpha) {
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
}

// Get the scaled log2 of value
// Board is log scale from 2 to 2048
// Returns linear values from 0 to 11
function valueToLog2(value) {
    return (Math.log2(value) - 1);
}
