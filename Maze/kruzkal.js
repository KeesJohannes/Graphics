var groepen;

function initdbK() {
    for (var f in fieldList) {
        f.maze = false;
        f.gr1 = false;
        f.gr2 = false;
        f.groepnr = -1;
    }
    for (var d in doors) {
        d.mark = false;
    }
}

function drawTheGameK() {
    for (var h of fieldList) h.drawC(drawKField);
    for (var d of doors) d.drawC(drawKWall);
}

function* kruzkal() {
    groepen = fieldList.slice().map(kf => [kf]);
    groepen.forEach((kf_list, n) => {
        kf_list[0].groepnr = n;
    });
    reportProd(0)
    yield 0; // kruzkal ready
    // shuffle the array
    var doorsToChooseFrom = shuffle(doors.filter(d => !d.deur && !d.zijkant));
    doorsToChooseFrom.forEach(d=>d.mark=true);
    while (doorsToChooseFrom.length > 0) {
        var pDoor = doorsToChooseFrom.pop();
        pDoor.mark = false;
        // cellen naar het zelfde groepnummer zetten
        var xyb = pDoor.xyFieldsBothSides();
        c1 = lookUpField[xyb.fp1.x][xyb.fp1.y];
        c2 = lookUpField[xyb.fp2.x][xyb.fp2.y];
        if (c1.groepnr != c2.groepnr) {
            // merge de groepen g1 en g2 in  tot groep g1. 
            var g1 = c1.groepnr;
            var g2 = c2.groepnr;
            if (groepen[g2].length > groepen[g1].length) {
                // wissel g1,c1 met g2,c2
                var t = g1;
                g1 = g2;
                g2 = t;
                t = c1;
                c1 = c2;
                c2 = t;
            }
            c1.grp1 = true;
            c2.grp2 = true;
            groepen[g1].forEach(g=>{g.grp1=true;g.grp2=false})
            groepen[g2].forEach(g=>{g.grp1=false;g.grp2=true})
            // g2 is de kleinere groep;
            c1.maze = true;
            c2.maze = true;
            reportProd(1,pDoor)
            yield 1;
            pDoor.deur = true;
            groepen[g2].forEach(g => g.groepnr = g1);
            groepen[g1] = groepen[g1].concat(groepen[g2]);
            groepen[g2] = [];
            groepen[g1].forEach(g=>{g.grp1=true;g.grp2=false})
            // pijltjes tonen van leaf naar top. c2 wijst mogelijk er naar 
            if (c1.ri === null ) { // c1 is top; 
                c1.ri = c2.p.copy().sub(c1.p); // c1 wijst naar c2
            } else if (c2.ri === null) {
                c2.ri = c1.p.copy().sub(c2.p); // c2 wijst naar c1
            } else { // c1 en c2 zijn beide leaves; c2 wordt gekeerd en gaat naar c1 wijzen.
                //var v;
                var st = []; // stack om de velden op volgorde tijdelijk op te slaan.
                var c = c2; // wordt gekeerd.
                while (c.ri !== null) {
                    st.push(c);
                    var v = c.p.copy().add(c.ri);
                    c = lookUpField[v.x][v.y];
                } // c bevat het veld zonder ri verwijzing. De top dus, nu wordt een leave.
                while (st.length > 0) {
                    var cx = st.pop();
                    c.ri = cx.p.copy().sub(c.field.p);
                    c = cx;
                }
                cx.ri = c1.p.copy().sub(cx.p); // omgekeerde wijst naar c1
            }
            reportProd(2,pDoor)
            yield 2;
            groepen[g1].forEach(g=>g.grp1=false);
        } else {
            reportProd(3,pDoor);
            yield 3;
        }
    }
    reportProd(4)
    yield 4;
}

function drawKField(fld) {
    push()
    textSize(20)
    if (fld.grp1) kleur = "#00FF0090"
    if (fld.grp2) kleur = "#00990090"
    if (fld.grp1 || fld.grp2) rhoek(fld.p,kleur);
    if (fld.maze) {
        //print(fld)
        ball(fld.p, "#FF0000", 0.5); //color(255,0,0));
    }
    pop();
}

function drawKWall(d) {
    push();
    stroke(markwall);
    stroke("white")
    if (d.zijkant) {
        stroke("white")
        strokeWeight(3);
    } else if (!d.mark) {
        //stroke("white")
        stroke(markwall);
    } else strokeWeight(2);
    if (even(d.x)) {
        if (d.deur) {
            line(todx(d.x), tody(d.y - 1), todx(d.x), tody(d.y-0.5))
            line(todx(d.x), tody(d.y+0.5), todx(d.x), tody(d.y+1));
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