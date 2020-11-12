stack = [];
level = 7;
alpha = 3.14/2;//(90+0)*3.14/180
wissel = false;
keepAR = true;
genroutine = null;
//fun = null;
enable_items = null
disable_item = null;
schuif = null;
factorb = null;
factorh = null;
factor = null;

function setup() {
    
    ori = window.matchMedia("(orientation: landscape)");
    ori.addListener(()=>location.reload());

    if (windowWidth > windowHeight) {
        stand = 1; // (landscape)
    } else {
        stand = 0; //(portrait)
    }

    if (stand==0) { // portrait
        formPosx = 10
        formPosy = 520
    } else { // landscape
        formPosx = 520
        formPosy = 10
    }
 
    cv = createCanvas(500,500);
    cv.parent("myc");

    StuurElementen();
    alpha = (90+0)*PI/180; //PI/2+PI/6;
    //colorMode(HSB,100)
    startup();
}

function startup() {

    clear();
    background(200);
    frameRate(25);
    noFill();
    stroke(255);
    
    translate(width/2,height/2);

    rsizefuns = defsize();
    
    disable(enable_items());
    enable(disable_item());

    genroutine = gentree(level,alpha); 
}


function draw() {
    
    translate(width/2,height/2);
    stroke(255);
    rsizefuns.fillscreen(); // scales, translates 

    let res = genroutine.next();
    if (res.done) {
        noLoop();
        enable(enable_items());
        disable(disable_item());
        return;    
    }
    let h = res.value;
    mshape(h.rt)
}


function mkbasisvk(l,h) {
    let tb = [
        createVector(0,0),
        createVector(0,1),
        createVector(1,1),
        createVector(1,0),
    ];    
    return mkbasis(tb,l,h);
}

function mkbasisdh(l,h,a) {
    let tb = [
        createVector(0,0),
        createVector((cos(a)+1)*0.5,sin(a)*0.5),
        createVector(1,0)
    ];
    return mkbasis(tb,l,h);
    
}

function mkbasis(tb,l,h) {
    let ret = [];
    for (let i=0;i<tb.length;i++) {
        append(ret,tb[i].copy().rotate(h).mult(l));    
    }
    return ret;
}

function obj_translate(obj,p) {
    let ret = [];   
    for (let i=0;i<obj.length;i++) {
        let res = obj[i].copy().add(p);
        append(ret,res.copy());    
    }
    return ret;
}

function mshape(pa) {
    push()
    let v = rsizefuns.colorcoord(pa[0]);
    if (pa.length==4) fill(color((v.vx+v.vy)/2,v.vx,v.vy));
    else fill(color(v.vy,0,0))
    beginShape();
    for (p of pa) {
        vertex(p.x,p.y);
    }
    endShape(CLOSE)
    pop()
}

function StuurElementen() {
    
    // label Angle:
    let tk = createP("Angle:");
    tk.parent("stuur");
    tk.class("txt");
    tk.position(formPosx,formPosy);

    // Next slider
    let sc = createSlider(-30,30,0,1);
    sc.parent("stuur"); // x += tk.width
    sc.position(formPosx+60,formPosy+20);
    sc.elt.addEventListener("change",()=>{
        let v = sc.value();
        tk2.elt.innerHTML = `${v}`;
        alpha = (90+v)*PI/180;
    });

    // next value of slider
    let tk2 = createP("0");
    tk2.parent("stuur");
    tk2.class("txt");
    tk2.position(formPosx+230,formPosy);
    
    // volgende regel:label Diepte: 
    formPosy += 30;

    let tk3 = createP("Depth:");
    tk3.parent("stuur");
    tk3.class("txt");
    tk3.position(formPosx,formPosy);

    // next slider
    let sc1 = createSlider(0,14,7,1);
    sc1.parent("stuur");
    sc1.position(formPosx+60,formPosy+20);
    sc1.elt.addEventListener("change",()=>{
        let v = sc1.value();
        tk4.elt.innerHTML = `${v}`;
        level = int(v);
    });

    // next value of slider kleur
    let tk4 = createP("7");
    tk4.parent("stuur");
    tk4.class("txt");
    tk4.position(formPosx+230,formPosy);

    // volgende regel
    formPosy +=  50;

    let wi = createCheckbox("Wissel",false);
    wi.parent("stuur");
    wi.class("txt");
    wi.position(formPosx,formPosy);
    wi.changed(()=>{
        wissel = wi.checked();
    })

    // apct ratio behouden
    let ar = createCheckbox("keep AR",true);
    ar.parent("stuur");
    ar.class("txt");
    ar.position(formPosx+100,formPosy);
    ar.changed(()=>{
        keepAR = ar.checked();
    })

    formPosy += 40;
    
    let rn = createButton("Run");
    rn.parent("stuur");
    rn.class("txt");
    rn.position(formPosx,formPosy);
    rn.mousePressed(()=>{
        startup();
        disable([rn,wi,ar,sc1,sc,tk]);
        enable([st]);
        loop();
    });

    let st = createButton("Stop");
    st.parent("stuur");
    st.class("txt");
    st.position(formPosx+60,formPosy);
    st.mousePressed(()=>{
        noLoop();
        enable([rn,wi,ar,sc1,sc,tk]);
        disable([st]);
    });

    // de volgende regel
    formPosy += 40;

    enable_items = (function() {return [rn,wi,ar,sc1,sc,tk]});
    disable_item = (function() {return [st]});

    disable([rn,wi,ar,sc1,sc,tk])
    enable([st]);

}

function enable(clist) { 
    for (c of clist) c.removeAttribute("disabled");
}

function disable(clist) {
    for (c of clist) c.attribute("disabled",true);
}