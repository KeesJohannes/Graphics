class turtle {
    constructor(m,p,a) {
        this.canvas = m;
        this.pos = {x:p.x,y:p.y};
        this.angle = a;
    }

    reset(p,a) {
        this.pos = {x:p.x,y:p.y};
        this.angle = a;
    }

    draw(l) {
        let ri = {x:Math.cos(this.angle),y:Math.sin(this.angle)};
        let npos = {x:ri.x*l+this.pos.x,y:ri.y*l+this.pos.y}
        this.canvas.lineFromTo(this.pos,npos);
        this.pos = npos;
    }

    move(l) {
        let ri = {x:Math.cos(this.angle),y:Math.sin(this.angle)};
        let npos = {x:ri.x*l+this.pos.x,y:ri.y*l+this.pos.y}
        this.pos = npos;
    }

    rotate(a) {
        this.angle -= a;
        if (this.angle<-Math.PI*2) this.angle += Math.PI*2;
        if (this.angle>Math.PI*2) this.angle -= Math.PI*2;
    }
}