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
        this.setValue(va);
    }

    calcValue(yr) {
        let p = Math.min(Math.max((yr-this.posmi)/(this.posma-this.posmi),0),1);
        return p*(this.ma-this.mi)+this.mi;
    }

    MouseClick(x,y,action) {
        let yr = y - this.y;
        if (yr>=this.display.y && yr<=this.display.y+this.display.h) {
            let sv = false;
            if (this.mousestat==1 && action=="m") {
                sv = true;
            } else if (this.mousestat==0 && action=="d") {
                this.mousestat = 1;
                sv = true;
            } else if (action=="u") {
                this.mousestat = 0;
                sv = true;
            }
            if (sv) this.setValue(this.calcValue(yr));
        } else this.mousestat = 0;
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

    getValue() {
        return this.va;
    }
    
}

