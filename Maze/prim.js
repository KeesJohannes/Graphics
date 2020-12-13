
function initdbP() {
    for (f of fieldList) {
        f.maze = false; // onderdeel van de maze
        f.mark = false; // mark er wordt een pad gebouwd met dit element
        f.first = false; // first is het eerste field van een pad
    }

    // generate the door/walls objects
    for (d of doors) {
        d.mark = false;
    }

}

function drawTheGameP() {

    for (var h of fieldList) h.drawC(drawPField);
    for (var d of doors) d.drawC(drawPWall);
}

function* prim() {
    // maintain a list of walls to process
    var wallist = [];
    // choose a field randomly and mark it as belonging to the maze.
    var fld = random(fieldList);
    fld.maze = true;
    // add's its walls to the walllist
    wallist = wallist.concat(fld.xyWalls().map(xyw=>lookUpDoor[xyw.x][xyw.y])
                            .filter(f=>!f.zijkant));
    wallist.forEach(w=>w.wlist=true)
    reportProd(0,fld,oStrLst(wallist))
    yield 0 // random field is chosen
    while (wallist.length>0) {
        var w_index = floor(random(wallist.length));
        var w = wallist.splice(w_index,1)[0]; // w is now the deleted element
        w.wlist = false;
        w.mark = true; // do not enter this wall in the list again
        // fetch the fields on both sides of the wall
        var bb = w.xyFieldsBothSides();
        var c1 = lookUpField[bb.fp1.x][bb.fp1.y]
        var c2 = lookUpField[bb.fp2.x][bb.fp2.y]
        var c_erbij = null; // the one who is to be added
        if (c1.maze && !c2.maze) c_erbij = c2;
        else if (!c1.maze && c2.maze) c_erbij = c1; 
        if (c_erbij) {
            c_erbij.maze = true;
            w.deur = true;
            var wl = c_erbij.xyWalls().map(xyw=>lookUpDoor[xyw.x][xyw.y])
                     .filter(d=>!d.zijkant && !d.mark);
            wl.forEach(d => d.wlist=true);
            wallist = wallist.concat(wl);
            reportProd(1,w,c_erbij,oStrLst(wl));
                //"["+wl.map(d=>`(${d.x},${d.y})`).join(",") + "]")
            yield 1 //field added
        } else {
            reportProd(2,w)
            yield 2 // no field added; 1 wall removed from list
        }
    }
    reportProd(3);
    yield 3 // all fields are added 
} // prim

function drawPField(fld) {
    push()
    textSize(20)
    if (fld.maze) {
        ball(fld.p, mazekleur, 0.5); //color(255,0,0));
    }
    pop();
}

function drawPWall(d) {
    push();
    if (d.zijkant) strokeWeight(3);
    else if (d.wlist) stroke("red")
    else if (d.mark) stroke(markwall);
    else strokeWeight(2);
    if (even(d.x)) {
        if (d.deur) {
            line(todx(d.x), tody(d.y - 1), todx(d.x), tody(d.y - 0.5));
            line(todx(d.x), tody(d.y + 0.5), todx(d.x), tody(d.y + 1));
            push()
            stroke(mazekleur);
            strokeWeight(2);
            line(todx(d.x-1),tody(d.y),todx(d.x+1),tody(d.y))
            pop();
        } else {
            line(todx(d.x), tody(d.y - 1), todx(d.x), tody(d.y + 1));
        }
    } else {
        if (d.deur) {
            line(todx(d.x - 1), tody(d.y), todx(d.x - 0.5), tody(d.y));
            line(todx(d.x + 0.5), tody(d.y), todx(d.x + 1), tody(d.y));
            push()
            stroke(mazekleur);
            strokeWeight(2);
            line(todx(d.x),tody(d.y-1),todx(d.x),tody(d.y+1))
            pop();
        } else {
            line(todx(d.x - 1), tody(d.y), todx(d.x + 1), tody(d.y));
        }
    }
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
