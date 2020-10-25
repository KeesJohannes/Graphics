var cv;
var ch;
var factorx;
var factory;
var cellen;
var cbinnen;
var groepen;
var muren;
var wallslist; 

var aantal;
var opdemap;

// initieer de database: muren, cellen en groepen.
function init() {

    cv = 16; // aantal cellen horizontaal
    ch = 16; // aantal cellen vertikaal

    aantal =  2*cv*ch+1; // watchdoc
    opdemap = 0;

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
        m.buren[0].muren.push(m);
        var dif = p5.Vector.sub(m.p2,m.p1);
        m.buren[1] = fetchCel(p5.Vector.sub(m.p1,createVector(dif.y,dif.x)));    
        m.buren[1].muren.push(m);
    })

    // 
    wallslist = [];
    cbinnen = cellen.filter(c=>!c.buiten);
    var cl = random(cbinnen);
    cl.mark = true;
    addwallstolist(cl);

} // init

// hang de muren van de meegegeven cel in de lijst.
function addwallstolist(c) {
    for (m of c.muren) {
        if (!m.isOnlLst && !m.zijkant) {
            wallslist.push(m);
            m.isOnList = true;
//            console.log("wal toegevoegd:",m)
        }
    }
}

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


function setup() {

    var cnvs = createCanvas(500,500);
    cnvs.parent("myCanvas")
    background(color(100,25,0));
    frameRate(10);

    init();

    background(0);
    stroke(255);
    strokeWeight(1)
    noFill()
    textSize(15)
    
    //teken(); // draw the board inlusive the groupnumbers
    
}

function draw() {
    if (aantal<0) {
        console.log("muren:",opdemap)
        console.log("aantal onder 0")
        noLoop();
        return;
    }
    aantal--;

    background(0);
    stroke(255);
    strokeWeight(1)
    noFill()
    textSize(15)

    var cur = wallslist.filter(w=>((w.buren[0].mark && !w.buren[1].mark)||
                                   (!w.buren[0].mark && w.buren[1].mark)) &&
                                   !w.isOnMap);
    if (cur.length>0) { // alleen muren die een map cel en een niet map cel scheidn. 
        cur = cur[floor(random(cur.length))]; // cur is een muur.
        cur.isOnMap = true;
        opdemap++;
        var curcel;
        //console.log("cur",cur)
        if (!cur.buren[0].mark) {
            curcel = cur.buren[0]
        }
        if (!cur.buren[1].mark) {
            curcel = cur.buren[1]
        }
        curcel.mark = true; // cel op map
        cur.present = false; // een deur
        
        for (var m of curcel.muren) {
            if (!m.isOnList && !m.zijkant) {
                wallslist.push(m);
            }
        };
    } else {
        console.log(`no more solutions. Number of doors: ${opdemap}.`);
        noLoop();
    }  

    teken();

    //noLoop();

}

function teken() {

    for (var i=0;i<muren.length;i++) {
        var m = muren[i];
        if (m.present) {
            m.draw();
        } else {
//            console.log(m);
        }
    }

//    cellen.filter(c=>!c.buiten).forEach(c=>c.drawtext());
}

function mline(p1,p2) {
    line((p1.x+1)*factorx,(p1.y+1)*factory,(p2.x+1)*factorx,(p2.y+1)*factory);
}
