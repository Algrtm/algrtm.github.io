export default class Board {
    game;
    tiles = [];

    dom = $("#board");
    ambientLight = false;

    fps = 60;
    duration = 3;
    frames;
    delay;

    constructor(game) {
        this.game = game;
        // Setup JQuery tiles (divs)
        for (let i = 0; i < 16; i++) {
            let tile = $("<div>")
                .attr("id", `${i}`)
                .addClass("tile border");
            this.tiles.push(tile);
            this.dom.append(tile);
        }

        // Animation setup
        this.frames = this.fps * this.duration;
        this.delay = 1000 / this.fps;

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
                $("#board").css("box-shadow", "");
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
            this.game.setupNewGame();
            $(document.body).removeClass("win");
            $("#board").css("background-color", "");
            $("#board").css("box-shadow", "");
            this.update();
        });
        //====================//
    }

    move(direction) {
        // Move and check if cant move - skip
        if (!this.game.move(direction)) return;
        this.update();
    }

    update() {
        let gameState = this.game.getGameState();

        // Set score
        $("#score_input").text(gameState.score);

        let gameBoard = gameState.board;
        // Tile tiles
        for (let i = 0; i < this.tiles.length; i++) {
            let value = gameBoard[i];
            // Set tile's value
            if (value != 0)
                this.tiles[i].text(value)
            this.tiles[i].removeAttr('style');
    
            // Decorate
            if (value != 0) {
                this.tiles[i].addClass("active");
                this.tiles[i].css("background-color", colorToCSS(getTileColor(value), 1));
    
            } else
                this.tiles[i].removeClass("active"); 
        }

        if (!this.ambientLight) return;
        // Ambient lighting
        this.showAmbientLight();
    }

    showFlashScreen(text, subtext) {
        // Blur background
        $("#board").addClass("blur");
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
        $("#board").removeClass("blur");
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
        $("#board").css("box-shadow", `0 0 40px 40px ${colorToCSS(ambientLight, 0.5)}`);
    }
}

// Account for vertical positioning
let UIOffset = 0;
// Create button element
function createButton(text, id) {
    return $("<div>")
        .attr('id', id)
        .addClass("ui button shadow border")
        .text(text)
        .css("top", `${(UIOffset++) * 15 + 5}%`);
}
// Create toggle element
function createToggle(text, id) {
    return $("<div>")
        .attr('id', id)
        .addClass("ui toggle shadow border")
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
