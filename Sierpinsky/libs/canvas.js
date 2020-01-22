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

    Triangle(x1,y1,x2,y2,x3,y3) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.moveTo(x1,y1)
        this.ctx.lineTo(x2,y2);
        this.ctx.lineTo(x3,y3);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    fillTriangle(x1,y1,x2,y2,x3,y3) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.fillStyle = this.fillColor;
        this.ctx.moveTo(x1,y1)
        this.ctx.lineTo(x2,y2);
        this.ctx.lineTo(x3,y3);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }

    Circle(x, y, r) {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.fillColor;
        this.ctx.arc(x, y, r, 0, 2 * Math.PI);
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
