siCanvas = 500;
stand  = 0;
ori = null;

base = [];
basepart = 0;
model = [];
depth = 0;

curlength = 0;
teller = 0;
curpos = null;
firstpos = null;
depth = 5

formPosx = 0;
formPosy = 0;
formPosdy = 20;

function OnOriChange() {
    location.reload();
}

function txtA(s) {
    return `levels: ${s}`
}

function herstart() {

    teller = 0;
    basepart = 0;
    let rescalcsize = calcsize();
    curlength = rescalcsize.factor;
    
    teller = 0;
    basepart = 0;
    curpos = createVector(siCanvas/2-rescalcsize.shx,siCanvas/2-rescalcsize.shy);
    firstpos = curpos.copy();
    
    clear();
    background(0);
    loop();

}

function addelements() {


    textSize(18);

    figcnt = 0
    hfatxtX = formPosx
    hfatxtY = formPosy
    hfatxt = createP(txtA(4))
    hfatxt.class("txt")
    hfatxt.position(hfatxtX,hfatxtY)

    figcnt += 1
    coefAValueX = hfatxtX + hfatxt.size().width + 15;
    coefAValueY = formPosy + hfatxt.size().height;
    hsaslider = createSlider(2,10,5,1)
    hsaslider.position(coefAValueX,coefAValueY); 
    hsaslider.value(depth)
    hsaslider.elt.addEventListener("change",()=>{sa = hsaslider.value();depth = sa; hfatxt.elt.innerHTML = txtA(sa);})
    coefAValueSize = hsaslider.size() 

    figcnt += 1
    but1 = createButton("Restart")
    but1.position(formPosx,formPosy+figcnt*formPosdy)
    but1.class("txt2")
    but1.mousePressed(herstart)

}


function setup() {

    ori = window.matchMedia("(orientation: landscape)");
    ori.addListener(OnOriChange)

    if (windowWidth > windowHeight) {
        stand = 1; // (landscape)
    } else {
        stand = 0; //(portrait)
    }
    createCanvas(siCanvas,siCanvas);
    if (stand==0) { // portrait
        formPosx = 10
        formPosy = 520
    } else { // landscape
        formPosx = 520
        formPosy = 10
    }
    
    background(0);
    stroke(255);
    angleMode(RADIANS);

    addelements();
        
    base[0] = -1;
    base[1] = +0.5
    base[2] = 0;
    base[3] = -0.5;
    basepart = 0;
    
    model[0] = 0.25;
    //model[1] = 0.75;
    //model[2] = -0.75;
    model[1] = -0.25;

    depth = 4;

    let rescalcsize = calcsize();
    curlength = rescalcsize.factor;
    
    teller = 0;
    basepart = 0;
    curpos = createVector(siCanvas/2-rescalcsize.shx,siCanvas/2-rescalcsize.shy);
    firstpos = curpos.copy();
    
}

function draw() {

    stroke(255);

    let newpos = p5.Vector.add(curpos,fetchri().mult(curlength));
    line(curpos.x,curpos.y,newpos.x,newpos.y);
    
    curpos = newpos;
    if (!nextstep()) {
       line(curpos.x,curpos.y,firstpos.x,firstpos.y); 
       noLoop();        
    }   
}

function calcsize() {
    teller = 0;
    basepart = 0;
    let left = 0; //Infinity;
    let right = 0; //-Infinity;
    let top = 0; //Infinity;
    let bottom = 0; //-Infinity;
    curpos = createVector(0,0);
    do {
        let fcri = fetchri();
        let newpos = p5.Vector.add(curpos,fcri);
        left = min(left,newpos.x);
        right = max(right,newpos.x);
        top = min(top,newpos.y);
        bottom = max(bottom,newpos.y); 
        curpos = newpos.copy();
    } while (nextstep());
    
    let factor = siCanvas*0.9/(right-left);
    let shx = (left+right)*factor/2;
    let shy = (top+bottom)*factor/2;
    return {factor,shx,shy};
}

function converttoarray(nummer,digits) {
    let res = Array(digits);
    for (let d=0;d<digits;d++) {
        res[d] = nummer%2;
        nummer = floor(nummer/2);
    }
    return res;
}

function calcangle(cntr) {
    angle = 0;
    for (let i=0;i<cntr.length;i++) {
        angle += model[cntr[i]];
    }
    return angle;
}

function fetchri() {
    let counter = converttoarray(teller,depth);
    let angle = calcangle(counter);
    let curri = createVector(1,0).rotate((base[basepart]+angle)*PI); //.mult(curlength);
    return curri;    
}

function nextstep() {
    teller += 1;
    if (teller>=pow(2,depth)) {
        teller = 0;
        basepart += 1;
        if (basepart>=base.length) {
            nogeens = true;
           return false; 
        }
    }    
    return true;
}

