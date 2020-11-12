/*
Kruskals algorithme:
0. initieel: alle cellen behoren tot een eigen groep: dus evenveel groepen als cellen.
1. zoek een willekeurige niet al bezochte muur.
2. zijn de groepen aan beide zijden van de muur verschillend, merge ze dan in 1 groep. 
   De muur krijgt een deur.
   De muur is nu bezocht.
3. Zijn er nog niet bezochte muren ga dan verde met 1, anders klaar. 
*/

var cv;
var ch;
var factorx;
var factory;
var cellen;
var groepen;
var muren; 
var aantal;
var wallstoselect
var te;
var pg1;
var pg2;
var pg;

// initieer de database: muren, cellen en groepen.
function init() {
    aantal = 2*17*17+1; // watchdoc

    cv = 8; // aantal cellen horizontaal
    ch = 8; // aantal cellen vertikaal

    factorx = width/(ch+2); // omzetting muurcoord naar canvas coord.
    factory = height/(cv+2);; // idem

    wal.vnr = createVector(1,0); // hulp variabelen in klasse wal.
    wal.vnb = createVector(0,1); // idem

    // de cellen
    cellen = [];
    // x=-1, y=-1, x==ch en y==cv bevatten de buitengebieden.
    var x = -1;
    while (x<=ch) {
        var y = -1;
        while (y<=cv) {
            cellen.push(new cel(x,y++)); // x,y het adres van de cel. (lb)
            // in cel worden 2 attributen aangemaakt:
            // buiten => is true voor buitengbied
            // groep => = x*cv+y+1 voor  x>=0, x<=ch en y>0, y<cv
            //          = -1 in andere gevallen
        }
        x++;
    }

    // de groepen
    // initieel heeft elke cel van het binnen gebied zijn eigen groep. 
    groepen = Array(cv*ch+1);
    groepen[0] = null;
    cellen.filter(c=>!c.buiten).forEach(c=>groepen[c.groep] = [c]);

    // de muren
    // De muren hebben hun linksboven punt als kenmerk. (p1)
    // Tevens is dat het beginpunt van de muur. Het eindpunt wordt aangegevn door p2.
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

    // buren verwijzen naar de cellen die zich aan beide kanten van de muur bevinden.
    muren.forEach(m=>{
        m.buren[0] = fetchCel(m.p1);
        var dif = p5.Vector.sub(m.p2,m.p1);
        m.buren[1] = fetchCel(p5.Vector.sub(m.p1,createVector(dif.y,dif.x)));    
    })

    // de lijst van muren waar het algorithme van Kruskal willekeurig doorheen loopt.
    wallstoselect = randomize(muren.filter(m=>!m.zijkant));

    te = new pijltje();

} // init

// shuffle de lijst.
function randomize(li) {
    var ret = []; 
    var cnt = li.length+1;
    while (li.length>0 && cnt > 0) {
        cnt--;
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

// entry function of P5;
function setup() {

    var cnvs = createCanvas(500,500);
    cnvs.parent("myCanvas");

    frameRate(10);

    init();

    background(0);
    stroke(255);
    strokeWeight(1)
    noFill()
    textSize(15)

    teken(); // draw the board without the groupnumbers
    
}

// entry point for P5 to draw on the canvas multiple times
function draw() { 
    if (aantal==0) {
        console.log("Exit door aantal.")
        noLoop();
        return;
    }
    aantal--;
    var wi = 0;
    var wl = [];
    // get the next wall to check for a door.
    if (wallstoselect.length>0) {
        wi = wallstoselect.findIndex(w=>w.buren[0].groep != w.buren[1].groep);
        if (wi<0) { // no more doors to make.
            wallstoselect = [];
            wl = [];
        } else { // get the first wall
            wl = wallstoselect.splice(0,wi+1);
            wl = wl[wi]
        }
    }
    //console.log("erna:",wallstoselect.length);
    
    if (wallstoselect.length==0) {
        console.log("Exit door 0 non-visited walls")
        noLoop();
        return;
    }

    var rnl;
    if (wl.buren[0].groep != wl.buren[1].groep) { // groups to combine 
        wl.present = false; // hak een deur in de muur
        var curpijl = {p:wl.buren[0],q:wl.buren[1]};
        if (curpijl.p.groep>curpijl.q.groep) {
            curpijl = {p:curpijl.q,q:curpijl.p};
        }
        var curwal = wl; // een gat in de muur
        rnl = groeprename(wl.buren[1].groep,wl.buren[0].groep);
        rnl.forEach(c=>c.notext = true); // indicatie the wall has changed 

        var p1 = curwal.p1;
        var p2 = curwal.p2;
        noStroke()
        fill(0)
        var pm = p5.Vector.add(p1,p2).mult(0.5);
        var v = (p1.x==p2.x)
        // clear the port
        rectMode(CENTER)
        rect((pm.x+1)*factorx,(pm.y+1)*factory,v?0.1*factorx:0.7*factorx,v?0.7*factory:0.1*factory)
    
        fill(color(255,0,0))
        stroke(color(255,0,0))
        te.draw(curpijl.p,curpijl.q) // teken een pijltje
    
    }

    //clear();
    //background(0);
    stroke(255);
    strokeWeight(1)
    noFill()
    textSize(12)
    //teken(); // drae the changed board.

    //noLoop();

}

function groeprename(nrvan,nrnaar) {

    //console.log(`Van ${nrvan} naar ${nrnaar}`);
    let glvan = groepen[nrvan];
    let glnaar =  groepen[nrnaar];
    glvan.forEach(g=>g.groep = nrnaar);
    groepen[nrnaar] = glnaar.concat(glvan);
    groepen[nrvan] = null;
/*    let nnold = [];
    let nn = cellen.filter(c=>c.groep==nrvan).forEach(c=>{
        nnold.push(c);
        c.groep=nrnaar;
    });
*/
    return groepen[nrnaar];

}

function teken() {

    for (var i=0;i<muren.length;i++) {
        muren[i].draw();
    }

    //cellen.filter(c=>!c.buiten).forEach(c=>c.drawtext());
}


function mline(p1,p2) {
    line((p1.x+1)*factorx,(p1.y+1)*factory,(p2.x+1)*factorx,(p2.y+1)*factory);
}


function mtext(t,p) {
    text(t,(p.x+1.2)*factorx,(p.y+1.6)*factory);
}
