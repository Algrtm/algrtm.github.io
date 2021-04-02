import Game from "./engine/game.js";
import Board from "./view.js";

// OnLoad
$(function() {
    $("body").removeClass("fade");

    // Generic game setup
    let game = new Game(4);
    
    let board = new Board(game);
    
    // Initial board update
    board.update();

    // Shhhhhh... listen carefully
    document.addEventListener("keydown", async function(e) {
        switch(e.key) {
            case "ArrowUp": await board.move('up'); break;
            case "ArrowDown": await board.move('down'); break;
            case "ArrowLeft": await board.move('left'); break;
            case "ArrowRight": await board.move('right'); break;
        }
    }, false);
});
