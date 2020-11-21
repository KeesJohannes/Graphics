var gmparts = [];
var showstep = 0;
var showdet = false;
var tsh1;
var tsb1;
var tsb2;
var fpx;
var fpy;
var stopnbrs = [];

class gamepart {

    static opgestart = 0;
    static firstmaze = 1;
    static paditem = 5;
    static foundmaze = 7;
    static padmade = 8;
    static mazedone = 9; 

    constructor(t) {
        this.t = t; // een lijst van textregels.
        this.stop = [];
    }

    add(t) {
        this.t = this.t.concat(t);
    }

    getText() {
        return this.t.join("</br>");
    }

    setStand(s) {
        this.stand = s;
    }

    getStand() {
        return this.stand;
    }
}

function showVarText(txt) {
    tsh1.elt.innerHTML = txt;
    tsb1.position(fpx,fpy+tsh1.size().height+10)
    tsb2.position(fpx+tsb1.size().width+20,fpy+tsh1.size().height+10)
}

function showall() {
    var gm = gmparts[showstep];
    showVarText(gm.getText());
    stopnbrs = gm.stop;
}

function setupshow(xfp,yfp) {    
var tekst = [
        {t:["1: Genereer een willekeurig eerste veld dat onderdeel wordt van de maze."],
        s:[1,5,7,8,9]},
        {t:["2: Genereer een willekeurig pad dat begint in een willekeurig niet Maze veld en eindigt in een maze veld.",
            "Onthoud bij elke stap van het pad de richting van veld naar veld."],
        s:[7,8,9]},
        {t:["3: Mogelijke loops worden verwijderd zodat alleen het direkte pad overblijft naar de maze."],
        s:[8,9]},
        {t:["4: Herhaal de vorige 2 regels totdat alle velden tot de maze behoren."],
        s:[9]}    
    ]

    fpx = xfp;
    fpy = yfp;

    for (hh of tekst) {
        var h = new gamepart(hh.t);
        h.stop = hh.s;
        gmparts.push(h);

    }

    showstep = 0;
    
    tsh1 = createP("Tekst")
    tsh1.parent("stepwise")
    tsh1.class("txt")
    tsh1.position(fpx,fpy);

    fpy += tsh1.size().height;

    tsb1 = createButton("Show me");
    tsb1.parent("stepwise");
    tsb1.class("txt");
    tsb1.position(fpx,fpy+tsh1.size().height);
    tsb1.mousePressed(()=>{
        disable([tsb1])
        loop();
    })

    tsb2 = createButton("Next");
    tsb2.parent("stepwise");
    tsb2.class("txt");
    tsb2.position(fpx+tsb1.size().width+20,fpy+tsh1.size().height);
    tsb2.mousePressed(()=>{
        enable([tsb1]);
        showstep += 1;
        if (showstep>=gmparts.length) {
            showstep = 0;
        }
        noLoop();
        showall()
    })

    var hh = (txt)=>{
        tsh1.elt.innerHTML = txt;
        tsb1.position(fpx,fpy+tsh1.size().height)
        tsb2.position(fpx+tsb1.size().width+20,fpy+tsh1.size().height)
    };

    showall();

    return function() {
        tsb2.remove();
        tsb1.remove();
        tsh1.remove();
    }
}

