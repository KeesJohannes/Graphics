let myC = null;
const PI = Math.PI;

let event;
let tijd = 500
let stat = 1;

let butRun = {}

let adrestekst;
let pretekst;
let yieldorig;

function OnStart() {
let base, height;
let rect;

    adrestekst = document.getElementById("pretext");
    pretekst = adrestekst.innerHTML.split("\n");
    yieldorig = pretekst[4].replace("<br>","")
    console.log(yieldorig)
    
    initCanvas();
    [base, height] = initSier();

    rect = myC.myCanvas.getBoundingClientRect();
    myC.myCanvas.addEventListener("mousedown", (e) => getMousePosition(e,rect));


    Sierpinsky(base,height,4,100);

}

function getMousePosition(e,rect) {
    let x = e.clientX-rect.left;
    let y = e.clientY-rect.top;
    if (x>=butRun.x && x<butRun.x+butRun.w && y>=butRun.y && y<butRun.y+butRun.h) {
        stat = 1 - stat;
        myC.font("14px Arial");
        myC.ctx.clearRect(butRun.x,butRun.y,butRun.w, butRun.h);
        myC.fillText(stat==0?"Run":"Stap",butRun.x+butRun.w/2,butRun.y+butRun.h/2);
        myC.font("20px Arial");    
    } else {
        DoStap();
    }
}

function initCanvas() {
    myC = new Canvas();
    if (window.innerWidth<window.innerHeight) {
        myC.myCanvas.width = window.innerHeight*0.7
        myC.myCanvas.height = window.innerWidth*0.5
    } else {
        myC.myCanvas.width = window.innerWidth*0.5
        myC.myCanvas.height = window.innerHeight*0.7    
    }
    myC.width = myC.myCanvas.clientWidth;
    myC.height = myC.myCanvas.clientHeight;

    butRun = {x:myC.width*9/12,y:myC.height/12,w:myC.width/12,h:myC.height/12};

    myC.font("14px Arial");
    myC.textAlign("center")
    myC.textBaseline("middle")
    myC.stroke("white")
    
    myC.Rect(butRun.x,butRun.y,butRun.w,butRun.h);
    myC.fillText(stat==0?"Run":"Stap",butRun.x+butRun.w/2,butRun.y+butRun.h/2)
    myC.font("20px Arial");
}

class Canvas {
    constructor() {
        this.myCanvas = document.getElementById("myCanvas");
        this.ctx = myCanvas.getContext("2d");
        this.width = this.myCanvas.clientWidth
        this.height = this.myCanvas.clientHeight;
        this.strokeColor = "#FFFFFF"
        this.fillColor = "#FFFFFF"
    }

    fill(color) {
        this.fillColor = color;
    }

    stroke(color) {
        this.strokeColor = color;
    }

    lineWidth(w) {
        this.ctx.lineWidth = w;
    }

    Rect(x,y,w,h) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.rect(x,y,w,h);
        this.ctx.stroke();
    }

    Circle(x, y, r) {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.fillColor;
        this.ctx.arc(x, y, r, 0, 2 * PI);
        this.ctx.fill();
    }

    lineFromTo(p1, p2) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
    }

    clear() {
        this.ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    }

    font(f) {
        this.ctx.font = f;
    }

    textAlign(ta) {
        this.ctx.textAlign = ta;
    }

    textBaseline(bl) {
        this.ctx.textBaseline = bl
    }

    fillText(t, x, y) {
        this.ctx.fillStyle = this.fillColor
        this.ctx.fillText(t, x, y);
    }

} // class Canvas

