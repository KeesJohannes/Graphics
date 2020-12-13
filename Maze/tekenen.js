const breedte = 500;
const hoogte = 500;
const mazekleur = "#FF0000"; //color(255,0,0);
const firstkleur = "#FF00FF"; //color(255,0,255)
const pathkleur = "#EE9999"; // color(200,100,100)
const markkleur = "#00FF00";
const markwall = "#9999FF";
const pijldikte = 0.05;
const pijllengte = 0.7;
const arrowdikte = 0.15;
const arrowlengte = 0.2;
const maxaantal = 30;

var maxh; // = 2 * ch - 1;
var maxv; // = 2 * cv - 1;
var factorx; // = breedte / ph;
var factory; //s = hoogte / pv;
var speed = 4;
var cnvs;
var pijl //= new pijltje();

// inits functions
var setCanvas = () =>{
    background(0)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
    stroke(255);
    fill(0);
}

function initDraw() {
    factorx = breedte / (ph-2);
    factory = hoogte / (pv-2);

    setCanvas();
}

function getField(x, y) {
    return lookUpField[x][y];
}

function even(x) {
    return (2 * int(x / 2) == x)
}

function todx(x) {
    return (x + 1) * factorx;
}

function tody(y) {
    return (y + 1) * factory;
}

function ball(p, c, r = 0.7) {
    stroke(c)
    fill(c);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
    circle(todx(p.x), tody(p.y), factorx * r)
}

function rhoek(p,kleur) {
    push()
    rectMode(CORNERS)
    fill(kleur);
    noStroke()
    rect(todx(p.x-0.8),tody(p.y-0.8),todx(p.x+0.8),tody(p.y+0.8));
    pop();
}

function drawTheGame() {

    for (var h of fieldList) h.draw()
    for (var d of doors) d.draw();
}

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
            vertex((b.x + k.x + 1) * factorx, (b.y + k.y + 1) * factory);
        }
        endShape(CLOSE)
    }
} // pijltje
