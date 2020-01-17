class spinner {
    constructor(myCanvas,x, y, w, h) {
        this.canvas = myCanvas;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.maxva = 7;
        this.minva = 1;
        this.va = 1;
        this.pw = this.w*2/8;
        this.p1 = {x:this.pw/2,y:0};
        this.p2 = {x:0,y:this.h/2}
        this.p3 = {x:this.pw,y:this.h/2};
        this.pdx = this.x+this.w-this.pw;
        this.pdy = this.y;
        this.pl1 = {x:this.p1.x+this.pdx,y:this.p1.y+this.pdy+1}
        this.pl2 = {x:this.p2.x+this.pdx,y:this.p2.y+this.pdy}
        this.pl3 = {x:this.p3.x+this.pdx-2,y:this.p3.y+this.pdy}
        this.pl4 = {x:this.pl1.x,y:this.pl1.y+this.h-2}
    }

    mouseclick(x,y) {
        if (y>=this.pl2.y && x>=this.pl2.x) {
            this.va = Math.max(this.va-1,this.minva);
        } else if (y<this.pl2.y && x>=this.pl2.x) {
            this.va = Math.min(this.va+1,this.maxva);
        }
        this.draw();
    }

    drawText() {
        this.canvas.save();
        this.canvas.clearRect(this.x+1,this.y+1,this.w-this.pw-4,this.h-2);
        this.canvas.stroke("white");
        this.canvas.fill("white");
        this.canvas.fillText(this.va,this.x+(this.w-this.pw)/2,this.y+this.h/2);
        this.canvas.restore();
    }

    drawArrows() {
        this.canvas.save();
        this.canvas.clearRect(this.pl2.x,this.pl1.y,this.pl3.x-this.pl2.x,this.pl4.y-this.pl1.y);
        this.canvas.fill("gray");
        this.canvas.stroke("white")
        if (this.va<this.maxva) {
            this.canvas.fillTriangle(
                this.pl1.x,
                this.pl1.y,
                this.pl2.x,
                this.pl2.y,
                this.pl3.x,
                this.pl3.y);
        }
        if (this.va>this.minva) {
            this.canvas.fillTriangle(
                this.pl4.x,
                this.pl4.y,
                this.pl2.x,
                this.pl2.y,
                this.pl3.x,
                this.pl3.y);
        }
        this.canvas.restore();
    }

    setValue(n) {
        this.va = Math.max(Math.min(n,this.maxva),this.minva);
    }

    getValue() {
        return this.va;
    }

    draw() {
        this.canvas.save();
        this.canvas.lineWidth(1);
        this.canvas.stroke("white");
        this.canvas.clearRect(this.x+1,this.y+1,this.w-2,this.h-2)
        this.canvas.Rect(this.x,this.y,this.w,this.h)
        this.canvas.lineFromTo(
            {x:this.pl2.x-2,y:this.y},
            {x:this.pl2.x-2,y:this.y+this.h});
        this.drawArrows();
        this.drawText();
        this.canvas.restore();

    }
}  // class spinner