var ch = 5;
var cv = 5;
var ph = 2 * (ch + 2);
var pv = 2 * (cv + 2);
var fieldList;
var lookUpField = [];
var doors; // list of all doors
var lookUpDoor = []; // x,y entry for each door.
var currentpad;
var pijl; // = new pijltje();

function initdb() {
    ph = 2 * (ch + 2);
    pv = 2 * (cv + 2);
    maxh = 2 * ch - 1;
    maxv = 2 * cv - 1;

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
}

class field {

    constructor(x, y) {
        this.x = x
        this.y = y;
        this.p = createVector(x, y);
        this.ri = null; // de richting dat het pad volgt.
        this.mark1 = false; // mark er wordt een pad gebouwd met dit element
        this.mark2 = false; // maze is onderdeel van de maze
        this.mark3 = false; // firstmaze the first maze. 
        this.mark4 = false; // first is het eerste field van een pad
        // Kruzkal specific
        this.prop1 = -1; // groepnr = -1
        this.prop2 = false; // light = False;
    
        this.field = this

    }

    drawC(drawf) {
        drawf(this)
    }

    draw() {
        push()
        textSize(20)
        if (this.maze) {
            ball(this.p, mazekleur, 0.5); //color(255,0,0));
        } else if (this.mark) {
            ball(this.p, markkleur, 0.5); // color(200,100,100)
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
            //pijl.draw(this.p, p1, color(0, 255, 0));
            pop();
        }
    } // draw

    
    xyWalls() {
        var fld = this;
        return [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}].map(ri=>{
                    var pf = fld.p.copy().add(createVector(ri.x,ri.y));
                    return {x:pf.x,y:pf.y};
                });
    } // xyWalls
} // field

class door {
    constructor(x, y) {
        this.x = x
        this.y = y;
        this.p = createVector(x, y);
        this.deur = false;
        this.mark1 = false;
        this.zijkant = (x==0) || (y==0) || (x==2*ch) || (y==2*cv)

        this.door = this;
     }

     drawC(drawf) {
        drawf(this)
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
        var d = this;
        if (d.y==0) {
            fill("white");
            strokeWeight(1);
            stroke("white");
            textAlign(CENTER)
            textSize(12);
            text(`${d.x}`,todx(d.x),tody(d.y-0.3));
        }
        if (d.x==0) {
            fill("white");
            strokeWeight(1);
            stroke("white");
            textAlign(CENTER)
            textSize(12);
            text(`${d.y}`,todx(d.x-0.5),tody(d.y));
        }
            pop();
    }

    xyFieldsBothSides() {
        var c1;
        var c2;
        if (even(this.p.x)) { // cellen links en rechts van de muur
            c1 = createVector(this.p.x - 1,this.p.y);
            c2 = createVector(this.p.x + 1,this.p.y);
        } else {
            c1 = createVector(this.p.x,this.p.y - 1);
            c2 = createVector(this.p.x,this.p.y + 1);
        }
        return {fp1:c1,fp2:c2};
    }
} // door
