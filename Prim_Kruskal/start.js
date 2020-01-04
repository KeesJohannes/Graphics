let algol = 0; // 0=Kruska; 1=Prim
let justclicked = false;
let nodes;
let groep;
let edges;
let sedges;
let mstnodes = [];

function setup() {

    [nodes, edges] = ReadData(dbs);
    //    [nodes,edges] = GenNw();

    initDraw()
    if (algol == 0) {
        initKruskal()
        drawNw();
        drawKruskalInfo();
    } else {
        initPrim();
        drawNw();
        drawPrimInfo()
    }

    rect = myCanvas.getBoundingClientRect();

    myCanvas.addEventListener("mousedown", (e) => getMousePosition(e));

}

function getMousePosition(event) {
    let x = (event.x - rect.left) - but0.x;
    let y = (event.y - rect.top) - but0.y;
    if (x >= 0 && x < but0.w && y >= 0 && y <= but0.h) {
        algol = 1 - algol;
        justclicked = true;
        if (algol == 0) {
            initKruskal();
            drawNw();
            drawKruskalInfo();
        } else {
            initPrim();
            drawNw();
            drawPrimInfo()
        }
        return;
    }
    x = (event.x - rect.left) - but1.x;
    y = (event.y - rect.top) - but1.y;
    if (x >= 0 && x < but1.w && y >= 0 && y <= but1.h) {
        [nodes, edges] = GenNw();
        initDraw()
        if (algol == 0) {
            initKruskal()
            drawNw();
            drawKruskalInfo();
        } else {
            initPrim();
            drawNw();
            drawPrimInfo()
        }
    } else {
        x += but1.x;
        y += but1.y;
        if (x >= ctox(-1) && x < ctox(cols - 1) && y > rtoy(-1) && y < rtoy(rows - 1)) {
            if (algol == 0) {
                stepKruskal();
            } else {
                stepPrim();
            }
        }
    }
};

function imageClick(e) {
    if (justclicked) {
        justclicked = false;
        return;
    }
    if (algol == 0) {
        //        stepKruskal();
    } else {
        //        stepPrim();
    }
}

function OnStart() {

    initCanvas();
    frameCount = 0;
    setup();

}


