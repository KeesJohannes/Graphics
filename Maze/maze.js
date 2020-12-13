/* Combinations:
| run | pause | step |
|-----|-------|------|
|  F  |   F   |   F  | Nothng is shown
|-----|-------|------|
|  T  |   F   |   F  | No interrupts: from start to finish
|-----|-------|------|
|  T  |   T   |   F  | Movement has beenn started. Now paused
|-----|-------|------|
|  T  |   T   |   T  | After one draw cycle the loop stopes again. 
|-----|-------|------|
*/
var maze_run = false;
var maze_pause = false;
var maze_step = false;
var gmfun;
var initdbase;
var gameplay;
var gm;

function setup() {

    initdb();
    initDraw();
    initUI();

    frameRate(speed);

    gameplay();
}

function draw() {
    if (maze_run) {
        clear();
        setCanvas();
        var r = gm.next();
        gameplay();
        if (r.done) {
            noLoop();
            maze_run = false;
            maze_step = false;
            maze_pause = false;
            return;
        }
        if (maze_step || maze_pause) {
            noLoop();
        }
    }
}

