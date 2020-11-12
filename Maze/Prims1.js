var cv;
var ch;
var factorx;
var factory;
var cellen;
var cbinnen;
var groepen;
var muren;
var wallslist; 
var cnvs;
var aantal;
var opdemap;
var curwal = null;
var curpijl = null;

// initieer de database: muren, cellen en groepen.
function init() {

    cv = 8; // aantal cellen horizontaal
    ch = 8; // aantal cellen vertikaal

    aantal =  2*cv*ch+1; // watchdoc
    opdemap = 0;

    factorx = width/(ch+2); // omzetting muurcoord naar canvas coord.
    factory = height/(cv+2);; // idem

    wal.vnr = createVector(1,0); // hulp variabelen in klasse wal.
    wal.vnb = createVector(0,1); // idem

    // de cellen
    cellen = [];
    // x=-1, y=-1, x==ch en y==cv bevatten de buitengebieden.
    // het veld 
    var x = -1;
    while (x<=ch) {
        var y = -1;
        while (y<=cv) {
            cellen.push(new cel(x,y++)); // x,y het adres van de cel. (lb)
            // in cel worden 2 attributen aangemaakt:
            // buiten => is true voor buitengbied
            // groep => = x*cv+y+1 voor  x>=0, x<=ch en y>0, y<cv
            //          = -1 in andere gevallen
            // mark => false (cel is op de map)
        }
        x++;
    }

    // de groepen
    // initieel heeft elke cel van het binnen gebied zijn eigen groep. 
    // Het begrip <groep> wordt bij Prim niet gebruikt.
    groepen = Array(cv*ch+1);
    groepen[0] = null;
    cellen.filter(c=>!c.buiten).forEach(c=>groepen[c.groep] = [c]);

    // de muren
    // De muren hebben het linksboven punt als kenmerk. (p1)
    // Tevens is dat het beginpunt van de muur. Het eindpunt wordt aangegeven door p2.
    muren = []; 
    x = 0;
    while (x<ch) {
        var y = 0;
        while (y<cv) {
            muren.push(new wal(createVector(x,y),wal.vnr)); // vnr is eenheidsvector ri oost
            muren.push(new wal(createVector(x,y),wal.vnb)); // vnb is eenheidsvektor ri zuid
            y++;
        }
        x++;
    }
    for (var x=0;x<ch;x++) {
        muren.push(new wal(createVector(x,cv),wal.vnr)); // het horizontale buitengebied
    }
    for (var y=0;y<cv;y++) {
        muren.push(new wal(createVector(ch,y),wal.vnb)); // het vertikale buitengebied
    }


    // De array buren (van een wal instance) verwijst naar de cellen die zich aan beide 
    // kanten van de muur bevinden.
    // De array muren (van een cel instance) verwijst naar de muren die de cel afbakenen.
    muren.forEach(muur=>{
        muur.buren[0] = fetchCel(muur.p1);
        muur.buren[0].muren.push(muur);
        var dif = p5.Vector.sub(muur.p2,muur.p1);
        muur.buren[1] = fetchCel(p5.Vector.sub(muur.p1,createVector(dif.y,dif.x)));    
        muur.buren[1].muren.push(muur);
    })

    // Prim's specific:list of walls to deal with
    pijltjes = [];
    wallslist = [];
    // only inner cels are to look at and may have doors.
    cbinnen = cellen.filter(c=>!c.buiten);
    // choose an innerdoor and his walls as the starting point.
    var cl = random(cbinnen);
    cl.mark = true; // things todo
    addwallstolist(cl);

} // init

// stop de muren van de meegegeven cel in de werklijst.
function addwallstolist(c) {
    for (m of c.muren) {
        if ((!m.isOnlLst && !m.zijkant)) { // not already on the list and not a border
            wallslist.push(m);
            m.isOnList = true;
        }
    }
}

// shuffle de lijst.
function randomize(li) {
    var ret = []; 
    while (li.length>0) {
        ret.push(li.splice(floor(random(li.length)),1)[0]);
    }
    return ret;
}

// haal een cel op m.b.v. zijn id (p1:positie begin muur)
function fetchCel(p) { // the groups has tobe totally clean.
    var xi = cellen.findIndex(q=>q.x==p.x && q.y == p.y); // the first on a given positionning.
    if (xi<0) { // something is wrong!!)
        console.log("niet gevonden:",p);
        return null; 
    };
    
    return cellen[xi];
}


function setup() {

    cnvs = createCanvas(500,500);
    cnvs.parent("myCanvas")

    frameRate(10);

    init();

    background(0);
    strokeWeight(1)
    stroke(255);

    for (var m of muren) {
        m.draw();
    }

    noFill()
    textSize(15)
    
    te = new pijltje();
    
}

function draw() {
    
    if (aantal<0) {
        console.log("muren:",opdemap)
        console.log("aantal onder 0")
        noLoop();
        return;
    }
    aantal--;

    noFill();
    textSize(15);
    rectMode(CENTER)

    // Search for an arbitraly entry where the marks of the two neighbouring cells are different.
    // Each selected entry is always removed from the list.
    var gadoor = true;
    var cur = null;
    while (gadoor && wallslist.length>0) {
        var curi = floor(random(wallslist.length));
        cur = wallslist.splice(curi,1)[0];
        gadoor = !((!cur.buren[0].mark && cur.buren[1].mark)||
                    (cur.buren[0].mark && !cur.buren[1].mark));
    }
    // de huidige nog niet behandelde muren die een map-cel met een niet map-cel verbinden
    if (!gadoor) {
        cur.isOnMap = true; // muur wordt gebruikt
        curwal = cur;
        opdemap++;
        var curcel;
        var celfrom;
        if (!cur.buren[0].mark) {
            celfrom = cur.buren[1]; // deze cel is al op de map
            curcel = cur.buren[0] // deze cel is nog niet op de map
        }
        if (!cur.buren[1].mark) {
            celfrom = cur.buren[0];  // deze cel is al op de map
            curcel = cur.buren[1] // deze cel is nog niet op de map
        }
        curpijl = ({p:celfrom,q:curcel});
        
        curcel.mark = true; // cel op map
        cur.present = false; // een deur

        addwallstolist(curcel)

    } else {
        console.log(`no more solutions. Number of doors: ${opdemap}.`);
        noLoop();
    }  

    var p1 = curwal.p1;
    var p2 = curwal.p2;
    noStroke()
    fill(0)
    var pm = p5.Vector.add(p1,p2).mult(0.5);
    var v = (p1.x==p2.x)
    // clear the port
    rect((pm.x+1)*factorx,(pm.y+1)*factory,v?0.1*factorx:0.7*factorx,v?0.7*factory:0.1*factory)

    fill(color(255,0,0))
    stroke(color(255,0,0))
    te.draw(curpijl.p,curpijl.q) // teken een pijltje

    stroke(255);
}

function mline(p1,p2) {
    line((p1.x+1)*factorx,(p1.y+1)*factory,(p2.x+1)*factorx,(p2.y+1)*factory);
}
