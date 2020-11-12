class cel {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.v = createVector(x,y);
        this.maze = false;
        this.mark = false; // op de map.
        this.buiten = x<0||y<0||x>=ch||y>=cv;
        this.groep = this.buiten?-1:x*cv+y+1;
        this.notext = false;
        this.muren = []; // the walls that surround a cel
    }

    drawtext() {
        //return;
        if (this.notext) return;
        var h = this.v;
        mtext(this.groep,h);
    }

} // cel

class wal {
    static vnr = null; // createVector(1,0);
    static vnb = null; // createVector(0,1);

    constructor(lb,offs) {
        this.p1 = lb.copy(); // begin van de muur
        this.p2 = p5.Vector.add(this.p1,offs); // eindpunt van de muur
        this.present = true; // muur aanwezig: true
        this.zijkant = 
            (this.p1.x==0 && this.p2.x==0) || (this.p1.y==0 && this.p2.y==0) ||
            (this.p1.x==ch && this.p2.x==ch) || (this.p1.y==cv && this.p2.y==cv)
        this.visited = false;
        this.buren = []; // the two cells at each side of the wall.
        this.isOnList = false; // Prim: op de lijst of op de lijst gestaan
        this.isOnMap = false; // Prim: op de map
    }

    draw() {
        if (this.present) {
            if (this.zijkant) {push();strokeWeight(3)};
            mline(this.p1,this.p2)
            if (this.zijkant) {pop()};
        }
    }
}

class pijltje {
    static pijldikte = 0.05;
    static pijllengte = 0.7;
    static arrowdikte = 0.15;
    static arrowlengte = 0.2;

    constructor() {
        this.p = [];
        this.p[0] = createVector(0,-pijltje.pijldikte/2);
        this.p[1] = createVector(pijltje.pijllengte,this.p[0].y);
        this.p[2] = createVector(this.p[1].x,this.p[1].y-pijltje.arrowdikte);
        this.p[3] = createVector(this.p[2].x+pijltje.arrowlengte,0);
        this.p[4] = createVector(this.p[2].x,-this.p[2].y);
        this.p[5] = createVector(this.p[1].x,-this.p[1].y);
        this.p[6] = createVector(this.p[0].x,-this.p[0].y);
    }

    draw(b,e) {
        var ri;
        if (b.x==e.x) {
            if (b.y>e.y) ri = 1; else ri = 3;
        } else {
            if (b.x>e.x) ri = 2; else ri = 0;
        }
        beginShape();
        for (var h of this.p) {
            var k = h.copy().rotate(-ri*PI*0.5);
            vertex((b.x+k.x+1.5)*factorx,(b.y+k.y+1.5)*factory);
        }
        endShape(CLOSE)
    }
} // pijltje
