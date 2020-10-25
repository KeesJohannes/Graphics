class cel {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.v = createVector(x,y);
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
        //console.log("this",this);
        if (this.present) {
            if (this.zijkant) {push();strokeWeight(3)};
            mline(this.p1,this.p2)
            if (this.zijkant) {pop()};
        }
    }

}
