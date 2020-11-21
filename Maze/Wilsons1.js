class pijltje {
    static pijldikte = 0.05;
    static pijllengte = 0.7;
    static arrowdikte = 0.15;
    static arrowlengte = 0.2;

    constructor() {
        this.p = [];
        this.p[0] = createVector(0, -pijltje.pijldikte / 2);
        this.p[1] = createVector(pijltje.pijllengte, this.p[0].y);
        this.p[2] = createVector(this.p[1].x, this.p[1].y - pijltje.arrowdikte);
        this.p[3] = createVector(this.p[2].x + pijltje.arrowlengte, 0);
        this.p[4] = createVector(this.p[2].x, -this.p[2].y);
        this.p[5] = createVector(this.p[1].x, -this.p[1].y);
        this.p[6] = createVector(this.p[0].x, -this.p[0].y);
    }

    draw(b, e) {
        var ri;
        if (b.x == e.x) {
            if (b.y > e.y) ri = 1;
            else ri = 3;
        } else {
            if (b.x > e.x) ri = 2;
            else ri = 0;
        }
        beginShape();
        for (var h of this.p) {
            var k = h.copy().mult(2).rotate(-ri * PI * 0.5);
            vertex((b.x + k.x + 2) * factorx, (b.y + k.y + 2) * factory);
        }
        endShape(CLOSE)
    }
} // pijltje

class field {
    constructor(x, y) {
        this.x = x
        this.y = y;
        this.p = createVector(x, y);
        this.ri = null; // de richting dat het pad volgt.
        this.mark = false; // er wordt een pad gebouwd met dit element
        this.maze = false; // is onderdeel van de maze
        this.firstmaze = false; // the first maze. 
        this.first = false; // is het eerste field van een pad
    }

    draw() {
        push()
        if (this.maze && this.firstmaze) {
            ball(this.p, mazekleur, 0.5); //color(255,0,0));
        } else if (this.mark) {
            if (this.first) {
                ball(this.p, firstkleur, 0.5); //color(255,0,255)
            } else {
                ball(this.p, pathkleur, 0.5); // color(200,100,100)
            }
        }
        pop();

        if (this.ri) {
            push();
            var c;
            if (this.mark) c = pathkleur;
            else if (this.maze) c = mazekleur;
            if (this.mark || this.maze) {
                stroke(c);
                fill(c);
            };
            var p1 = this.p.copy().add(this.ri);
            pijl.draw(this.p, p1, color(0, 255, 0));
            pop();
        }
    } // draw
} // field

class door {
    constructor(x, y) {
        this.x = x
        this.y = y;
        this.p = createVector(x, y);
        this.deur = false;
        this.zijkant = (x==0) || (y==0) || (x==2*ch) || (y==2*cv)
     }

    draw() {
        push();
        if (this.zijkant) strokeWeight(3);
        if (even(this.x)) {
            if (this.deur) {
                line(todx(this.x), tody(this.y - 1), todx(this.x), tody(this.y - 0.5));
                line(todx(this.x), tody(this.y + 0.5), todx(this.x), tody(this.y + 1));
            } else {
                line(todx(this.x), tody(this.y - 1), todx(this.x), tody(this.y + 1));
            }
        } else {
            if (this.deur) {
                line(todx(this.x - 1), tody(this.y), todx(this.x - 0.5), tody(this.y));
                line(todx(this.x + 0.5), tody(this.y), todx(this.x + 1), tody(this.y));
            } else {
                line(todx(this.x - 1), tody(this.y), todx(this.x + 1), tody(this.y));
            }
        }
        pop();
    }
} // door
