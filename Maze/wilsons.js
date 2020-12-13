function initdbW() {
    for (f of fieldList) {
        f.maze = false; // onderdeel van de maze
        f.mark = false; // mark er wordt een pad gebouwd met dit element
        f.first = false; // first is het eerste field van een pad
    }

    // generate the door/walls objects
    for (d of doors) {
        d.mark = false;
    }

    pijl = new pijltje();
}

function drawTheGameW() {

    for (var h of fieldList) h.drawC(drawAField);
    for (var d of doors) d.drawC(drawAWall);
}
// attributes:
// maze: definitief onderdeel van de maze
// mark: opbouw willekeerig pad naar een maze (tijdellijk)
// first: het eerste element van dat pad (tesamen meet mark) (tijdelijk)
// mark en maze is het laatste element van dat pad. (tijdelijjk)
function* wilsons() {
    // maintain a list of walls to process
    var wallist = [];
    // choose a field randomly and mark it as belonging to the maze.
    var fld = random(fieldList);
    fld.maze = true;
    reportProd(0,fld);
    yield 0 // laat begin van maze zien.
    // Doe totdat alle velden het attribute maze hebben.
    fieldsToChooseFrom = fieldList.filter(f=>!f.maze);
    while (fieldsToChooseFrom.length>0) {
        fld = random(fieldsToChooseFrom);
        fld.mark = true; // onderdeel pad
        fld.first = true; // eerste van het pad
        reportProd(1,fld)
        yield 1 // laat first van pad zien.
        // zoek path vanaf fld naar een veld van de maze
        var bur = fld;
        var maxloop = 5; // na 5 random stappen een stap naar een maze veld. 
        var cntloop = maxloop;
        stop = false
        while (!stop) {
            var burold = bur;
            cntloop--;
            if (cntloop>0) { // random stap
                // kies een random buur
                var bxy = [[2,0],[-2,0],[0,2],[0,-2]].map(ri=>createVector(ri[0],ri[1]).add(bur.p))
                    .filter(v=>v.x>0 && v.x<=maxh && v.y>0 && v.y<=maxv)
                bxy = random(bxy);
                bur = lookUpField[bxy.x][bxy.y];
            } else { // kies een veld in de richting van een maze veld
                maxloop = max(--maxloop,0) // volgende keer eerder met deze methofe
                cntloop = maxloop;
                var bxy = fieldList.filter(f=>f.maze).map(f=>{
                    return {f,d:abs(f.x-bur.x)+abs(f.y-bur.y)}
                }).reduce((rd,fd)=>{
                    if (rd.d<fd.d) {return rd}
                    else {return fd};
                },{f:null,r:Infinity}); // de dichtsbijzijnde maze
                var ri = bxy.f.p.copy().sub(bur.p);
                if (abs(ri.x)>abs(ri.y)) {
                    ri.x = Math.sign(ri.x)*2
                    ri.y = 0;
                } else {
                    ri.y = Math.sign(ri.y)*2;
                    ri.x = 0;
                } // ri is nu eenheidsvector in richting bxy
                bxy = ri.add(bur.p)
                bur = lookUpField[bxy.x][bxy.y]; 
            } // volgend veld van pad laten zien
            bur.mark = true; // deel van pad
            burold.ri = bur.p.copy().sub(burold.p);
            stop = bur.maze;
            reportProd(2,bur)
            yield 2 // show growth path
        }
        // het directe pad wordt aan de maze toegevoegd
        // en de deuren worden geopend
        bur = fld // begin toevoeging
        fldadded = [bur]
        while (!bur.maze) { // nog niet het einde bereikt
            bur.mark = false;
            bur.maze = true; // first bestaat nog  steeds
            var dxy = bur.p.copy().add(bur.ri.copy().mult(0.5)); // de deur
            lookUpDoor[dxy.x][dxy.y].deur = true;
            var bxy = bur.p.copy().add(bur.ri);
            bur = lookUpField[bxy.x][bxy.y]; // het volgende veld
            fldadded.push(bur);
        }
        bur.mark = false; // alleen nog restjes mark
        //fldadded = fieldList.filter(f=>f.mark)
        fieldList.filter(f=>f.mark).forEach(f=>{
            f.mark=false;
            f.ri = null;
        });
        // alleen maze over (en first)
        fieldsToChooseFrom = fieldList.filter(f=>!f.maze);
        print(fldadded)
        reportProd(3,oStrLst(fldadded))
        yield 3 // laat maze zien
        fld.first = false;
    }
    reportProd(4)
    yield 4 // laat de maze zien
}

// maze: definitief onderdeel van de maze
// mark: opbouw willekeerig pad naar een maze (tijdellijk)
// first: het eerste element van dat pad (tesamen meet mark) (tijdelijk)
// mark en maze is het laatste element van dat pad. (tijdelijk)
function drawAField(fld) {
    push()
    textSize(20)
    if (fld.first) {
        ball(fld.p, "green", 0.5); //color(255,0,0));
    } else if (fld.maze && !fld.mark) {
        ball(fld.p, mazekleur, 0.5); //
    } else if (fld.mark) {
        ball(fld.p, "blue", 0.5);
    }
    pop();

    if (fld.ri) {
        push();
        var c;
        if (fld.mark && !fld.maze) c = pathkleur;
        else if (fld.maze) c = mazekleur;
        if (fld.mark || fld.maze) {
            stroke(c);
            fill(c);
        };
        var p1 = fld.p.copy().add(fld.ri);
        pijl.draw(fld.p, p1, c);
        pop();
    }
}

function drawAWall(wal) {
    wal.draw();
}