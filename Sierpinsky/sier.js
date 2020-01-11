function initSier() {
    myC.stroke("#FF0000");
    myC.lineWidth(2);
    let b = 0.9*myC.width;
    let angle = Math.PI*2/3; // 120gr)
    let h = b*Math.tan(-angle)/2;
    if (h>myC.height*0.9) {
        h = myC.height*0.9;
        b = 2*h/Math.tan(-angle)
    }    
    return [b,h];
}

function Sierpinsky(base,h,n,duur) {
    let xleft = (myC.width-base)/2;
    let ytop = (myC.height-h)/2;
    let pl = { x: xleft, y: ytop+h };
    let pr = { x: pl.x + base, y: pl.y }
    let pt = { x: (pl.x + pr.x) / 2, y: pl.y-h}; 
    DrawTriangle(pl,pr,pt);
    DrawText(pl,pr,pt);
    gv = CutSierpinsky(pl,pr,pt,n,"");
    vstap = {value:null,done:false}
    let event = setInterval(()=>{
        if (stat==1) return; // muisclick
        let v = gv.next();
        if (v.done) clearInterval(event);
    },duur)
}

function DoStap() {
    if (stat==0) return; // running
    if (vstap.done) return;
    if (vstap.value!=null) 
        pretekst[4] = `${yieldorig} ${vstap.value} ${lastcoord.join("")}${"<br>"}`;
    adrestekst.innerHTML = pretekst.join("\n");
    vstap = gv.next();
}

let coord = [];
let lastcoord = [];
function* CutSierpinsky(pl, pr, pt, n, waar) {
    coord.push(waar);
    lastcoord = coord.slice();
    let plr = halfbetween(pl, pr);
    let prt = halfbetween(pr, pt);
    let ptl = halfbetween(pt, pl);
    yield n;
    DrawTriangle(plr,prt,ptl);
    if (n>1) {
        yield* CutSierpinsky(pl, plr, ptl, n - 1, "l");
        yield* CutSierpinsky(plr, pr, prt, n - 1, "r");
        yield* CutSierpinsky(ptl, prt, pt, n - 1, "t");
    }
    let x = coord.pop();
}

function DrawTriangle(pl,pr,pt) {
    myC.lineFromTo(pl, pr);
    myC.lineFromTo(pr, pt);
    myC.lineFromTo(pt, pl);
}

function DrawText(pl,pr,pt) {
    myC.fillText("p1",pl.x-15,pl.y);
    myC.fillText("p2",pr.x+15,pr.y);
    myC.fillText("p3",pt.x,pt.y-10);
}

function halfbetween(p1, p2) {
    return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }
}
