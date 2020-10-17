stack = [];
level = 1;
alpha = null;

function setup() {
    
    createCanvas(500,500);
    //colorMode(HSB)
    background(0);
    frameRate(25);
    noFill();
    stroke(255);
    
    translate(width/2,height/2);
    alpha = PI/3;
    level = 13;
    
    let p1 = createVector(-30,-220);
    let p2 = createVector(30,-220);
    mline(p1,p2);
    stack = [{p1,p2,fig:"vk",level,alpha}];

}


function draw() {
    
    translate(width/2,height/2);
    stroke(255);
    
    if (stack.length>0) {
        let hs = stack.length-1;
        //hs = floor(random(stack.length));
        let elm = stack[hs];
        stack.splice(hs,1);
        if (elm.fig=="vk") {
            dovierkant(elm.p1,elm.p2,elm.alpha,elm.level);    
        } else if (elm.fig=="dh") {
            dodriehoek(elm.p1,elm.p2,elm.alpha,elm.level);                
        }
    } else {
        console.log("einde");
        noLoop();
    }
}

function dovierkant(p1,p2,alpha,level) {
    if (level<=0) return
    level--;
    let l = p1.dist(p2);
    let helling = p2.copy().sub(p1).heading();
    let pb = mkbasisvk(l,helling); 
    let rt = obj_translate(pb,p1);
    mline(rt[0],rt[1]);
    mline(rt[1],rt[2]);
    mline(rt[2],rt[3]);
    if (rt[1].dist(rt[2])>=5) { 
        append(stack,{p1:rt[1],p2:rt[2],fig:"dh",level,alpha});
    }
}

function dodriehoek(p1,p2,alpha,level) {
    let l = p1.dist(p2);
    let helling = p2.copy().sub(p1).heading();
    let pb = mkbasisdh(l,helling,alpha); 
    let rt = obj_translate(pb,p1);
    mline(rt[0],rt[1]);
    mline(rt[1],rt[2]);
    append(stack,{p1:rt[0],p2:rt[1],fig:"vk",level,alpha:PI-alpha});
    append(stack,{p1:rt[1],p2:rt[2],fig:"vk",level,alpha:PI-alpha});
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

function mline(p1,p2) {
    line(p1.x,-p1.y,p2.x,-p2.y);
}

function mcircle(p,r) {
    circle(p.x,-p.y,r);    
}

function cx(p) {
    return p.x;    
}

function cy(p) {
    return -p.y;    
}
