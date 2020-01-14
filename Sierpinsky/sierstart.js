let myC = null;
const PI = Math.PI;
let base, height;

let event;
let gensier;
let tijd = 500
let stat = 1;
let speed = 1;
let duur = 1000/speed;

let butRun = {}
let slSpeed = {};

let adrestekst;
let pretekst = [];
let yieldorig;

function OnStart() {
let rect;

    adrestekst = document.getElementById("pretext");
    pretekst = adrestekst.innerHTML.split("\n");
    yieldorig = pretekst[4].replace("<br>","")
    
    initCanvas();

    rect = myC.myCanvas.getBoundingClientRect();
    myC.myCanvas.addEventListener("mousedown", (e) => getMousePosition(e,rect,"d"));
    myC.myCanvas.addEventListener("mouseup", (e) => getMousePosition(e,rect,"u"));
    myC.myCanvas.addEventListener("mousemove", (e) => getMousePosition(e,rect,"m"));

    [base, height] = initSier();
    Sierpinsky(base,height,4);
}

function StartTimer() {
    event = setInterval(()=>{ 
        let v = gensier.next();
        if (v.done) clearInterval(event);
    },duur)
}

function initStapRun() {
    if (stat==0) { // running
        StartTimer();
    } else { // mouseclick
        clearInterval(event);
    }
    myC.font("14px Arial");
    myC.ctx.clearRect(butRun.x+1,butRun.y+1,butRun.w-2, butRun.h-2);
    myC.fillText(stat==0?"Run":"Stap",butRun.x+butRun.w/2,butRun.y+butRun.h/2);
    myC.font("20px Arial");
}

function getMousePosition(e,rect,action) {
    let x = e.clientX-rect.left;
    let y = e.clientY-rect.top;
    if (x>=butRun.x && x<butRun.x+butRun.w && y>=butRun.y && y<butRun.y+butRun.h && action=="d") {
        stat = 1 - stat;
        initStapRun();
    } else if (x>=butRst.x && x<butRst.x+butRst.w && y>=butRst.y && y<butRst.y+butRst.h && action=="d") {
        stat = 1;
        initStapRun();
        myC.clear();
        DrawCanvas();
    } else if (x>=slSpeed.x && x<slSpeed.x+slSpeed.w && y>=slSpeed.y && y<slSpeed.y+slSpeed.h) {
        mySlider.MouseClick(x,y,action)    
    } else if (action=="d") {
        DoStap();
    }
}

function DrawCanvas() {
    myC.lineWidth(1);
    myC.font("14px Arial");
    myC.textAlign("center")
    myC.textBaseline("middle")
    myC.stroke("white")
    
    // Step/Run button
    myC.Rect(butRun.x,butRun.y,butRun.w,butRun.h);
    myC.fillText(stat==0?"Run":"Stap",butRun.x+butRun.w/2,butRun.y+butRun.h/2)
    // Restart button
    myC.Rect(butRst.x,butRst.y,butRst.w,butRst.h);
    myC.fillText("Restart",butRst.x+butRst.w/2,butRst.y+butRst.h/2)
    
    myC.font("16px Arial");

    mySlider = new slider(myC,myC.width*10.5/12,butRun.y,myC.width/18,myC.height*2/12,1,10,speed);
    slSpeed = {x:mySlider.x,y:mySlider.y,w:mySlider.w,h:mySlider.h};
    mySlider.draw();

    [base,height] = initSier()
    Sierpinsky(base,height,4);

}

function initCanvas() {
    myC = new Canvas();
    if (window.innerWidth<window.innerHeight) {
        myC.myCanvas.width = screen.width*0.8;
        myC.myCanvas.height = screen.availHeight*0.3;
} else {
        myC.myCanvas.width = screen.width*0.5
        myC.myCanvas.height = screen.availHeight*0.7    
    }
    myC.width = myC.myCanvas.clientWidth;
    myC.height = myC.myCanvas.clientHeight;

    butRun = {x:myC.width*9/12,y:myC.height*2/12,w:myC.width/12,h:myC.height/12};
    butRst = {x:myC.width*9/12,y:myC.height*1/12,w:myC.width*2/12,h:myC.height*0.8/12};

    DrawCanvas();
    
}

class slider {
    constructor(myCanvas,x,y,w,h,mi,ma,va) {
        this.canvas = myCanvas;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.mi = mi;
        this.ma = ma;
        this.posma = this.h/15;
        this.posmi = this.h-this.h/15;
        this.pos = this.posmi;
        this.mousestat = 0; // geen mousedown geweest
        this.handle = { // origin is x,y of slider
            x:this.w/5,y:this.pos-this.h/60,
            w:this.w*3/5,h:this.h/30}
        this.display = { // origin is x,y of slider
            x:this.handle.x,
            y:this.posma-this.handle.h/2,
            w:this.handle.w,
            h:this.posmi-this.posma+this.handle.h}
        this.handlew = this.w*3/5;
        this.handleh = this.h/30;
        this.setValue(va);
    }

    MouseClick(x,y,action) {
        if (y>=this.y && y<=this.y+this.h) {
            let yr = y - this.y;
            if (yr>=this.display.y && yr<=this.display.y+this.display.h) {
                let p;
                if (this.mousestat==1 && action=="m") {
                    p = Math.min(Math.max((yr-this.posmi)/(this.posma-this.posmi),0),1);
                    this.setValue(p*(this.ma-this.mi)+this.mi);
                } else if (this.mousestat==0 && action=="d") {
                    this.mousestat = 1;
                    p = Math.min(Math.max((yr-this.posmi)/(this.posma-this.posmi),0),1);
                    this.setValue(p*(this.ma-this.mi)+this.mi);
                } else if (action=="u") {
                    this.mousestat = 0;
                    console.log(this.va,this.ma)
                    speed = this.va;
                    duur = 1000/speed;
                }
            } else this.mousestat = 0;
        }
    }

    draw() {
        this.canvas.save();
        this.canvas.stroke("white");
        this.canvas.clearRect(this.x,this.y,this.w,this.h)
        this.canvas.Rect(this.x,this.y,this.w,this.h)
        this.canvas.stroke("grey")
        this.canvas.lineWidth(1);
        this.canvas.lineFromTo(
            {x:this.x+this.w/2+1,y:this.y+this.posmi},
            {x:this.x+this.w/2+1,y:this.y+this.posma});
        this.canvas.fill("white");
        this.canvas.fillRect(
            this.x+this.handle.x,
            this.handle.y+this.y,
            this.handle.w,
            this.handle.h);
        this.canvas.restore();
    }

    setValue(va) {
        this.canvas.save();
        this.canvas.clearRect(
            this.x+this.display.x,
            this.y+this.display.y-1,
            this.display.w,
            this.display.h+2);
        this.canvas.stroke("grey")
        this.canvas.lineWidth(1);
        this.canvas.lineFromTo(
            {x:this.x+this.w/2+1,y:this.y+this.posmi},
            {x:this.x+this.w/2+1,y:this.y+this.posma});
        this.va = Math.max(Math.min(va,this.ma),this.mi);
        let p = (this.va-this.mi)/(this.ma-this.mi)
        this.pos = p*(this.posma-this.posmi)+this.posmi;
        this.handle.y = this.pos-this.h/60;
        this.canvas.fill("white");
        this.canvas.fillRect(
            this.x+this.handle.x,
            this.handle.y+this.y,
            this.handle.w,
            this.handle.h);
        this.canvas.clearRect(this.x,this.y+this.h+5,this.w,30);
        this.canvas.fillText(this.va.toFixed(0),this.x+this.w/2,this.y+this.h+25);
        this.canvas.restore();
    }
}

class Canvas {
    constructor() {
        this.myCanvas = document.getElementById("myCanvas");
        this.ctx = myCanvas.getContext("2d");
        this.width = this.myCanvas.clientWidth
        this.height = this.myCanvas.clientHeight;
        this.strokeColor = "#FFFFFF"
        this.fillColor = "#FFFFFF"
        this.queue = [];
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

    fillRect(x,y,w,h) {
        this.ctx.fillStyle = this.fillColor;
        this.ctx.fillRect(x,y,w,h);
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

    clearRect(x,y,w,h) {
        this.ctx.clearRect(x,y,w,h);
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

    save() {
        this.queue.push({strokeColor:this.strokeColor,fillColor:this.fillColor});
        this.ctx.save();
    }

    restore() {
        this.ctx.restore();
        if (this.queue.length>0) {
            let x = this.queue.pop();
            this.strokeColor = x.strokeColor;
            this.fillColor = x.fillColor;
        }
    }

} // class Canvas

