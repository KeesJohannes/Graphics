var ch = 7;
var cv = 7;
var maxh = 2 * ch - 1;
var maxv = 2 * cv - 1;
var ph = 2 * (ch + 2);
var pv = 2 * (cv + 2);
const breedte = 600;
const hoogte = 600;
var factorx = breedte / ph;
var factory = hoogte / pv;
const mazekleur = "#FF0000"; //color(255,0,0);
const firstkleur = "#FF00FF"; //color(255,0,255)
const pathkleur = "#EE9999"; // color(200,100,100)
const pijldikte = 0.05;
const pijllengte = 0.7;
const arrowdikte = 0.15;
const arrowlengte = 0.2;
const maxaantal = 30;

function calcvars() {
    maxh = 2 * ch - 1;
    maxv = 2 * cv - 1;
    ph = 2 * (ch + 2);
    pv = 2 * (cv + 2);
    factorx = breedte / ph;
    factory = hoogte / pv;
}

var speed = 2;
var cnvs;
var fieldList;
var lookUpField = [];
var doors; // list of all doors
var lookUpDoor = []; // x,y entry for each door.
var currentpad;
var pijl; // = new pijltje();
var gendraw;
var aantal = maxaantal
var txtDiv;


function getField(x, y) {
    return lookUpField[x][y];
}

function even(x) {
    return (2 * int(x / 2) == x)
}

function todx(x) {
    return (x + 2) * factorx;
}

function tody(y) {
    return (y + 2) * factory;
}

function ball(p, c, r = 0.7) {
    fill(c)
    noStroke();
    circle(todx(p.x), tody(p.y), factorx * r)
}

function drawgame() {
    clear()
    background(0)
    stroke(255);
    fill(0);

    drawgame1();
}

function drawgame1() {

    for (var h of fieldList) h.draw();
    for (var d of doors) d.draw();
}

function init() {

    calcvars();

    cnvs = createCanvas(breedte, hoogte);
    cnvs.parent("myCanvas");

    frameRate(speed);


    WStuurElementen();

    restart();

}

function restart() {

    background(0);
    stroke(255);
    fill(0);

    // generate the field objects
    lookUpField = Array(ph);
    for (var x = 1; x < ph; x += 2) {
        var h = Array(pv);
        lookUpField[x] = h;
    }
    fieldList = [];
    for (var x = 1; x <= maxh; x += 2) {
        for (var y = 1; y <= maxv; y += 2) {
            var h = new field(x, y);
            fieldList.push(h);
            lookUpField[x][y] = h;
        }
    }

    // generate the door/walls objects
    // the verticals
    lookUpDoor = Array(ph)
    for (var x = 0; x < ph - 2; x++) {
        var h = Array(pv);
        lookUpDoor[x] = h;
    }
    doors = []
    for (var x = 0; x < ph - 2; x += 2) {
        for (var y = 1; y < pv - 3; y += 2) {
            var d = new door(x, y);
            doors.push(d);
            lookUpDoor[x][y] = d;
        }
    }
    // the horizontals
    for (var x = 1; x < ph - 3; x += 2) {
        for (var y = 0; y < pv - 2; y += 2) {
            var d = new door(x, y);
            doors.push(d)
            lookUpDoor[x][y] = d;
        }
    }

    gendraw = gdraw();

    drawgame()

} // retstart

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
        this.first = false; // is het eerste field van een pad
    }


    draw() {
        push()
        if (this.maze) {
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

function setup() {

    pijl = new pijltje();

    init();
    // x coordinaat oneven, y coordinaat even: vertikale afscheiding
    // x coordinaat even, y coordinaat oneven: horizontale afscheiding
    // x coordinaat even, y coorinaat even: centre cel


} // setup


function getFirstPad() {

    var h = random(fieldList.filter(h => !h.maze && !h.mark));
    if (h) {
        h.mark = true;
        h.first = true;
    }
    return h;
}

function getBuren(f) {
    return [
            [-2, 0],
            [0, -2],
            [2, 0],
            [0, 2]
        ].map(g => f.p.copy().add(createVector(g[0], g[1])))
        .filter(s => s.x >= 1 && s.x <= maxh && s.y >= 1 && s.y <= maxv);
}

function getNext(f) {
    var keuze = random(getBuren(f));
    return getField(keuze.x, keuze.y);
}

function afstand(p1, p2) {
    return abs(p1.x - p2.x) + abs(p1.y - p2.y);
}

function shortestPathToMaze(f) {
    var targets = fieldList.filter(fld => fld.maze); // list of fields of the maze
    var begins = getBuren(f); // list of vectors of the neighbours
    var afs = begins.reduce((r, e) => {
        let af = targets.reduce((a, v) => {
            return min(a, afstand(e, v.p))
        }, Infinity);
        if (af < r.r) {
            return {
                b: e,
                r: af
            }
        } else {
            return r;
        }
    }, {
        b: null,
        r: Infinity
    });
    return getField(afs.b.x, afs.b.y);
}

function opendoor(p, ri) {
    var w = ri.copy().mult(0.5).add(p);
    var d = lookUpDoor[w.x][w.y]
    d.deur = true;
}

function consolodatePath() {
    var cur = fieldList.filter(f => f.first);
    if (!cur) {
        print("error1");
        return
    };
    cur = cur[0];
    while (cur.mark && !cur.maze) {
        cur.first = false;
        cur.mark = false;
        cur.maze = true;
        opendoor(cur.p, cur.ri);
        var next = cur.p.copy().add(cur.ri);
        cur = getField(next.x, next.y);
    }
    fieldList.filter(f => f.mark).forEach(f => {
        f.mark = false;
        if (!f.maze) f.ri = null
    });
    return cur;
}


function* gdraw() {
    yield 0; // drawgame empty

    // the first field of the game
    var mm = random(fieldList)
    mm.maze = true

    yield 1; // the first maze is there

    while (fieldList.filter(f => !f.maze).length > 0) { // as long as there are empty fields
        currentpad = getFirstPad(); //  use the first available nomarkt field.
        if (!currentpad) {
            return 4; // error exit // none availailsble
        }
        while (!(currentpad.mark && currentpad.maze)) { // zolang maze niet gevonden (maze EN mark)
            var next;
            if (aantal > 0) { // zolang aantal boven 0 zoeken naar maze. Bij aantal == 0 direct er op af 
                next = getNext(currentpad);
                aantal--;
            } else {
                if (aantal == 0) print("direct to maze")
                next = shortestPathToMaze(currentpad);
                aantal--;
            }
            if (!next) {
                // this is wrong. there should be a next;
                //noLoop();
                return 6;
            }
            currentpad.ri = next.p.copy().sub(currentpad.p);
            next.mark = true;
            currentpad = next;
            yield 5; //progress: pad verlengd met 1 field
        }
        yield 7; // maze gevonden
        consolodatePath();
        aantal = maxaantal;
        yield 8; // pad gemaakt
    }
    return 9;
    // done wordt true
} // gdraw

//var info
function draw() {

    clear()
    background(0)
    stroke(255);
    fill(0);

    var info = gendraw.next();
    drawgame1();
    if (info.value == 4) {
        print("finished with error");
        noLoop();
        return
    };
    if (info.value == 6) {
        print("finished with error");
        noLoop();
        return
    };
    if (info.value == 8) {
        print("searching");
    };
    if (info.value == 9) {
        print("finished without error");
        noLoop();
        return
    };
    if (info.done) {
        print("finished without error");
        noLoop()
    };
    return;

}