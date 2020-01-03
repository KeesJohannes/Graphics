let myCanvas;
let ctx;
let fillColor = "#000000"
let strokeColor = "#000000"

function initCanvas() {
    myCanvas = document.getElementById("myCanvas");
    ctx = myCanvas.getContext("2d");
//    ctx.translate(myCanvas.width/2,myCanvas.height/2);
}

function clear() {
    ctx.clearRect(0,0,myCanvas.width,myCanvas.height);    
}

function fill(color) {
    fillColor = color;
}

function stroke(color) {
    strokeColor = color;
}

function lineWidth(w) {
    ctx.lineWidth = w;
}

function Circle(x,y,r) {
    ctx.beginPath();
    ctx.fillStyle = fillColor;
    ctx.arc(x,y,r,0,2*Math.PI);
    ctx.fill();
}

function lineFromTo(p1,p2) {
    ctx.beginPath();
    ctx.strokeStyle = strokeColor;
    ctx.moveTo(p1.x,p1.y);
    ctx.lineTo(p2.x,p2.y);
    ctx.stroke();
}

function font(f) {
    ctx.font = f;
} 

function textAlign(ta) {
    ctx.textAlign = ta;
}

function textBaseline(bl) {
    ctx.textBaseline = bl
}

function fillText(t,x,y) {
    ctx.fillStyle = fillColor
    ctx.fillText(t,x,y);
}