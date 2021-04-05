import Game from "./engine/game.js";
import Board from "./view.js";

// OnLoad
$(function() {
    $("body").removeClass("fade");

    // Generic game setup
    let game = new Game(4);

    game.loadGame({
        board: [
            2, 0, 0, 0,
            2, 1024, 512, 0,
            2, 0, 0, 512,
            2, 0, 0, 8,
        ],
        score: 0,
        won: false,
        over: false,
    });
    
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

    // Mobile swipe events
    let startX, startY;
    document.addEventListener("touchstart", function(e) {
        startX = e.changedTouches[0].clientX;
        startY = e.changedTouches[0].clientY;
    })
    document.addEventListener("touchend", async function(e) {
        let dx = e.changedTouches[0].clientX - startX;
        let dy = e.changedTouches[0].clientY - startY;

        // If short movement - skip;
        if (length([dx, dy]) < 80) return;

        let norm = normalize([dx, dy]);

        let threshold = 0.90;
        if (dot(norm, upVector) >= threshold)
            await board.move('up');
        else if (dot(norm, downVector) >= threshold)
            await board.move('down');
        else if (dot(norm, leftVector) >= threshold)
            await board.move('left');
        else if (dot(norm, rightVector) >= threshold)
            await board.move('right');
    }, false);
});

let upVector = [0, -1];
let downVector = [0, 1];
let leftVector = [-1, 0];
let rightVector = [1, 0];
function length(v) {
    return Math.sqrt(v[0]*v[0] + v[1]*v[1]);
}
function normalize(v) {
    let l = length(v);
    return [v[0] / l, v[1] / l];
}
function dot(v1, v2) {
    return (v1[0]*v2[0] + v1[1]*v2[1]);
}
