class button {
    constructor(m,t,x,y,w,h) {
        this.canvas = m;
        this.text = t;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.clicked = false;
    }

    draw() {
        this.canvas.save();
        this.canvas.stroke("white")
        this.canvas.lineWidth(1);
        this.canvas.font("14px Arial");
        this.canvas.Rect(this.x,this.y,this.w,this.h);
        this.canvas.fillText(this.text,this.x+this.w/2,this.y+this.h/2)
        this.canvas.restore();    
    }

    redraw() {
        this.canvas.clearRect(this.x,this.y,this.w,this.h);
        this.draw();
    }

    isClicked(x,y) {
        return (x>=this.x && x<this.x+this.w && y>=this.y && y<this.y+this.h)
    }

    click() {
        this.clicked = !this.clicked;
    }
}