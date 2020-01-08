let myC = null;
const PI = Math.PI;

let event;
let tijd = 500

function OnStart() {

    initCanvas();
    initSier();

    Sierpinsky(5,100);

//    let event = setTimeout(Siernext,tijd);

}

'==================================================================================='
queue = [];

function step() {
    if (queue.length > 0) {
        let p = queue.pop();
        if (p.n > 0) {
            let q = DrawInnerTriangle(p.p1, p.p2, p.p3)
            if (p.n > 1) {
                queue.push({ stat: 0, p1: q.p31, p2: q.p23, p3: p.p3, n: p.n - 1 })
                queue.push({ stat: 0, p1: q.p12, p2: p.p2, p3: q.p23, n: p.n - 1 });
                queue.push({ stat: 0, p1: p.p1, p2: q.p12, p3: q.p31, n: p.n - 1 });
            }
        }
    } else {
        clearInterval(event);
    }
}

function DrawSier(n) {
    queue = [];
    let base = myC.width * 0.8;
    let p1 = { x: myC.width * 0.1, y: myC.height * 0.9 };
    let p2 = { x: p1.x + base, y: p1.y }
    let p3 = { x: (p1.x + p2.x) / 2, y: p1.y - base * Math.tan(-Math.PI * 2 / 3) / 2 };
    myC.lineFromTo(p1, p2);
    myC.lineFromTo(p2, p3);
    myC.lineFromTo(p3, p1);
    queue.push({ stat: 0, p1, p2, p3, n })
}

function SierCut(p1, p2, p3, n) {
    if (n > 0) {
        let p = DrawInnerTriangle(p1, p2, p3)
        SierCut(p1, p.p12, p.p31, n - 1);
        SierCut(p.p12, p2, p.p23, n - 1);
        SierCut(p.p31, p.p23, p3, n - 1);
    }
}

function DrawInnerTriangle(p1, p2, p3) {
    let p12 = half(p1, p2);
    let p23 = half(p2, p3);
    let p31 = half(p3, p1);
    myC.lineFromTo(p12, p23)
    myC.lineFromTo(p23, p31);
    myC.lineFromTo(p31, p12);
    return { p12, p23, p31 }
}

function initSier() {
    myC.stroke("#FF0000");
    myC.lineWidth(2);
    //    myC.lineFromTo({x:0,y:0},{x:200,y:200})
}

function half(p1, p2) {
    return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }
}

function initCanvas() {
    myC = new Canvas();
    myC.font("20px Arial");
    myC.textAlign("center")
    myC.textBaseline("middle")
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

