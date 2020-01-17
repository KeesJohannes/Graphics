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
        this.pl11 = {x:this.x+this.pw/2,y:this.y};
        this.pl12 = {x:this.x,y:this.y+this.h};
        this.pl13 = {x:this.x+this.pw,y:this.y+this.h};
        this.pl21 = {x:this.x+this.w-this.pw/2,y:this.y+this.h};
        this.pl22 = {x:this.x+this.w-this.pw,y:this.y};
        this.pl23 = {x:this.x+this.w,y:this.y};
    }

    mouseclick(x,y) {
        if (x>=this.pl12.x && x<=this.pl13.x) {
            this.va = Math.min(this.va+1,this.maxva);
        } else if (x>=this.pl22.x && x<=this.pl23.x) {
            this.va = Math.max(this.va-1,this.minva);
        }
        this.draw();
    }

    drawText() {
        this.canvas.save();
        this.canvas.clearRect(this.pl13.x+1,this.y+1,this.w-2*this.pw-4,this.h-2);
        this.canvas.stroke("white");
        this.canvas.fill("white");
        this.canvas.fillText(this.va,(this.pl13.x+this.pl22.x)/2,this.y+this.h/2);
        this.canvas.restore();
    }

    drawArrows() {
        this.canvas.save();
        this.canvas.stroke("white")
        if (this.va<this.maxva) {
            this.canvas.fill("gray");
        } else {
            this.canvas.fill("black");
        }
        this.canvas.fillTriangle(
            this.pl11.x,
            this.pl11.y,
            this.pl12.x,
            this.pl12.y,
            this.pl13.x,
            this.pl13.y);
        if (this.va>this.minva) {
            this.canvas.fill("gray");
        } else {
            this.canvas.fill("black");
        }
        this.canvas.fillTriangle(
            this.pl21.x,
            this.pl21.y,
            this.pl22.x,
            this.pl22.y,
            this.pl23.x,
            this.pl23.y);
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
        this.drawArrows();
        this.drawText();
        this.canvas.restore();

    }
}  // class spinner