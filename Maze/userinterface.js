var pos = {}
const keuze = ['Prim','Kruskal','Wilson']
var gekozen = '';
var Desc = []
var textTable;
const txtSpeed = 'speed'
const txtStart = 'Start'
const txtPause = 'Pause'
const txtCont = 'Continue'

function reportProd(code,x,y,z) {
    setInfo(textTable[code](x,y,z));
}

function oStr(o) {
    return `(${o.x},${o.y})`
}

function oStrLst(ol) {
    return "["+ol.map(d=>`(${d.x},${d.y})`).join(",") + "]"
}

function initUI() {

    Desc[keuze[0]] = { // prim
        alg: [  
            `Description of Algorithm ${keuze[0]}`,
            `Choose a cell randomly`,
            `Mark this cell as part of the maze and add its walls to the wall list.`,
            `Choose randomly a wall from the walllist and remove this wall from the wallist.`,
            `If the neighbouring cells are both on the map or both are not on the map continue with step 3.`,
            `If one is on the map and the other not then put the latter one on the map. ` +
            `Then make a door in the wall and mark both cells as part of the maze.`,
            `Add the other doors to the walllist. Continu with 3.`
            ],
        prog: { init : initdbP,
                gameplay : drawTheGameP,
                prog : prim,
                ylt : [],
                demotext: [
                    (o,wlist) =>`The random field ${oStr(o)} is added to the maze.` + `<br>` +
                            `The wallist is initiated with ${wlist}`, // 0
                    (w,f,wlist) =>`The wall ${oStr(w)} is selected.` + '<br>' +  
                                  `The field (${oStr(f)}}) is added to the maze` + `<br>` + 
                                  `The wallist is extended with the walls ${wlist}`, // 1
                    (w) => `Wall ${oStr(w)} is removed from the walllist. `, // 2
                    () => `The maze is finished` // 3        
                ]
              }
        } // prim
    Desc[keuze[1]] = { //kruskal
        alg: [
            `Description of Algorithm ${keuze[1]}`,
            'Generate for each cel a group with a list of just that one cel.',
            'Walk through all the  walls in a randomized order.',
            'Look for the first wall in this list where the groupnumber of the two cells are different.',
            'if not found, than finished',
            'Otherwise: merge the lists of the two groups into one. Goto step 3.'
            ],
        prog: { init : initdbK,
                gameplay : drawTheGameK,
                prog : kruzkal,
                ylt : [],
                demotext : [
                    () => `Each field has its own group. All the walls are in a randomized list.`,      
                    (d) => `Wall ${oStr(d)} has been selected.` + "<br>" + 
                           `The fields on both sides of the wall belong to different groups.`,      
                    (d) => `The two groups have been merged into one.` + "<br>" +
                          `The door in wall ${oStr(d)} is now open.`,      
                    (d) => `Wall ${oStr(d)} has been selecte.` + "<br>" +
                           `The fields on both sides of the wall belong to the same group.`,      
                    () => `The maze is finished`      
                    ]
              }
        }, // kruskal
    Desc[keuze[2]] = { // wilson
        alg: [
            `Description of Algorithm `, //${keuze[2]}`,
            `Mark a random cel as part of the maze.`,
            `Choose a random unmarked cel as the start of a randomised path`,
            `Generate this randomised path but stop when the path reaches a marked cel.` + "<br>" +
            `Remove all the loops and mark the whole path as part of the maze.`,
            `If there are still unmarked cells, continue with 2.`
            ],
        prog: { init : initdbW,
                gameplay : drawTheGameW,
                prog : wilsons,
                ylt : [],
                demotext : [
                    (d) => `A random field ${oStr(d)} is choosen as part of the maze.`,      
                    (d) => `The first field ${oStr(d)} of a random walk is randomly choosen.` ,       
                    (d) => `The next field ${oStr(d)} of the random path is choosen` + 
                           ` until a maze field is found`,      
                    (d) => `The random path ${d} (without the loops) added to the maze.`,      
                    () => `The maze is finished`      
                ]
            }
        } // wilson
    // het canvas

    var cvs = createCanvas(breedte,hoogte);
    cvs.parent("myCanvas")
    setCanvas();
    // selectie algorithme (selection)
    var t1 = createSelect("Algorithm");
    t1.parent("keuze");
    t1.class("txt")
    for (let i=0;i<keuze.length;i++) {
        t1.option(keuze[i]);    
    };
    t1.changed(()=>{
        ChoiceAlgorithm(t1.value());
    })
    // omschrijving algorithme (p tag)
    var t2 = createP("Deel 2");
    t2.parent("stuur");
    t2.class("txt");
    // grootte van het vierkant (text + slider + resultaat)
    var ss = new slidor({
        position: {
            x: 0,
            y: 0
        },
        name: "Size of square",
        slider: {
            low: 2,
            high: 16,
            def: cv,
            step: 1
        },
        change: () => {
        ch = ss.getValue();
        cv = ch
        noLoop();
        }
    });
    // snelheid (text + slider + resultaat)
    var t3 = new slidor({
                    name:txtSpeed,
                    position: {
                        x: 0,
                        y: 0
                    },
                    slider: {
                        low: 1,
                        high: 20,
                        def: speed,
                        step: 1
                    },
                    change: () => {
                        speed = t3.getValue();
                        frameRate(speed)
                    }
                });

    // start knop (button)
    var b1 = createButton(txtStart);
    b1.parent("stuur");
    b1.class("txt4");
    b1.attribute("kleur","donker")
    b1.mousePressed(() => {
        maze_run = false;
        letsGo(txtPause);
        loop();
    })
    
    // pauze knop (button)
    var b2 = createButton(txtPause);
    b2.parent("stuur");
    b2.class("txt4");
    b2.attribute("kleur","donker")
    b2.mousePressed(() =>  {
        if (b2.elt.innerHTML==txtPause) {
            if (!maze_run) {
                letsGo(txtCont);    
            }
            checkPause(txtCont)
            maze_run = true;
            maze_pause = true;
            maze_step = false; 
            noLoop();
        } else {
            checkPause(txtPause)
            maze_pause = false
            maze_run = true;
            maze_step = false;
            loop();
        }
    });
    
    // step knop (button)
    var b3 = createButton("Step");
    b3.parent("stuur");
    b3.class("txt4");
    b3.attribute("kleur","donker")
    b3.mousePressed(() => {
        if (!maze_run) {
            letsGo(txtCont);
        }
        checkPause(txtCont)
        maze_step = true;
        print(maze_run,maze_pause,maze_step)
        loop();
    });

    function checkPause(b2t) {
        if (b2.elt.innerHTML!=b2t) {
            b2.elt.innerHTML = b2t
            maze_pause = (b2t==txtCont);
            if (!maze_pause) {
                maze_step = false;
                b2.attribute("kleur","donker")
            } else {
                b2.attribute("kleur","licht")
            }
        }
    }

    function letsGo() {
        if (!maze_run) {
            ChoiceAlgorithm(t1.value());
            checkPause(txtPause);
            maze_run = true;
        }
    }

    var t5 = createP("commentaar");
    t5.parent("stuur");
    t5.class("txt1");


    pos = {t1,t2,ss,t3,b1,b2,b3,t5}

    ChoiceAlgorithm(keuze[0]);
    calcPositions();

}

function setInfo(t) {
    pos.t5.elt.innerHTML = t;
} 

function calcPositions() {
    const px = breedte + 10;
    const py = 5;

    var posx = px;
    var posy = py;

    pos.t1.position(posx,posy); // select

    posy += pos.t1.size().height+5;
    pos.t2.position(posx,posy); // description

    posy += pos.t2.size().height+5;
    pos.ss.position(posx,posy); // size
    
    posy += pos.ss.size().height - 4;
    pos.t3.position(posx,posy); // speed

    posy += pos.t3.size().height+18;
    pos.b1.position(posx,posy); // start
    
    posx += pos.b1.size().width+10;
    pos.b2.position(posx,posy); // pause
    
    posx += pos.b2.size().width+30;
    pos.b3.position(posx,posy); // step

    posx = px;
    posy += pos.b1.size().height+10;
    pos.t5.position(posx,posy); // start
}

function ChoiceAlgorithm(value) {
    gekozen = value;
    var opt = Desc[gekozen]
    pos.t2.elt.innerHTML = makeList(opt.alg)
    initdbase = opt.prog.init;
    gameplay = opt.prog.gameplay;
    textTable = opt.prog.demotext;
    gmfun = opt.prog.prog;
    initdb();
    initdbase();
    initDraw();

    calcPositions();
    gm = gmfun();
    maze_pause = false;
    maze_run = false;
    maze_step = false;
    gameplay()

    //loop();
}
/*
function restartAlgorithm() {
    //gekozen = value;
    //var opt = Desc[gekozen]
    //pos.t2.elt.innerHTML = makeList(opt.alg)
    //staps = opt.steps;
    //demo = false;
    //pos.t4.elt.innerHTML = '<br>';
    //initdbase = opt.prog.init;
    //gameplay = opt.prog.gameplay;
    //gmfun = opt.prog.prog;
    initdb();
    initdbase();
    initDraw();

    gm = gmfun();

    //loop();

    //calcPositions();
}
*/

function makeList(tb) {
    var t = tb[0]+'<ol class="txt"><li style="line-height: 1;">'
    t += tb.slice(1).join('</li><li style="line-height: 1;">')
    t += "</li></ol>"
    return t;
}
/*
function makeList2(tb,start=1) {
    var t = `<ol class="txt" start="${start}"><li style="line-height: 1;">`
    t += tb.join('</li><li style="line-height: 1;">')
    t += "</li></ol>"
    return t;
}
*/
/*
function enable(clist) {
    for (c of clist) c.removeAttribute("disabled");
}
*/
/*
function disable(clist) {
    for (c of clist) c.attribute("disabled", true);
}
*/
class slidor {
    constructor(values = {
        position: {
            x: 0,
            y: 0
        },
        name: "slidor",
        slider: {
            low: 0,
            high: 10,
            def: 0,
            step: 1
        },
        change: () => null,
        //disabled: false
    }) {

        this.tk = createP(values.name);
        this.tk.parent("stuur");
        this.tk.class("txt");

        this.sc = createSlider(
            values.slider.low,
            values.slider.high,
            values.slider.def,
            values.slider.step);
        this.sc.parent("stuur");
        
        this.sc.elt.addEventListener("change", () => {
            this.tk2.elt.innerHTML = `${this.sc.value()}`
            values.change();
        });

        // next value of slider
        this.tk2 = createP(`${values.slider.def}`);
        this.tk2.parent("stuur");
        this.tk2.class("txt");

        this.position(values.position.x,values.position.y)
    }

    position(x,y) {
        this.formx = x;
        this.formy = y;

        this.px = x;
        this.py = y;

        this.tk.position(this.px, this.py);
        this.px += this.tk.size().width + 20;
        this.sc.position(this.px,this.py+18);

        this.px += this.sc.size().width+20;
        this.tk2.position(this.px,this.py);

        this.px += this.tk2.size().width;
        this.py += this.sc.size().height+18;
    }

    size() {
        return {width:this.px-this.formx,height:this.py-this.formy};
    }

    getValue() {
        return this.sc.value();
    }

    removeAttribute(att) {
        this.sc.removeAttribute(att);
    }

    attribute(name, value) {
        if (arguments.length > 1) {
            return this.sc.attribute(name, value); // result: set value
        } else {
            return this.sc.attribute(name); // result: attribute value
        }
    }
}
