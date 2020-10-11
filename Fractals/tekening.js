
class choicedata {
    
    static copyTable(inp) {
        let outp = [];
        for (let i=0;i<inp.length;i++) {
            outp[i] = inp[i].copy();
        }
        return outp;
    }
    
    constructor() {
        this.basearray = []
    }

    addData(data) {
        this.basearray.push(choicedata.copyTable(data));
    }

    getData(index) {
        return choicedata.copyTable(this.basearray[index]);
    }

    drawbase(ctx,index,closeline) {
        let ctxs = 50;
        // get size of picture
        let minx = Infinity;
        let maxx = -Infinity;
        let miny = Infinity;
        let maxy = -Infinity;
        let b = this.basearray[index];
        for (let i=0;i<b.length;i++) {
            minx = min(minx,b[i].x);
            maxx = max(maxx,b[i].x);
            miny = min(miny,b[i].y);
            maxy = max(maxy,b[i].y);
        }
        let fx = ctxs*0.6/(maxx-minx);
        let fy = ctxs*0.6/(maxy-miny);
        let midx = (maxx+minx)/2;
        let midy = (maxy+miny)/2;
        let midc = createVector(ctxs/2,ctxs/2);

        ctx.fillRect(0,0,ctxs,ctxs);
        ctx.beginPath();
        let p = b[0].copy().sub(createVector(midx,midy)).mult(min(fx,fy)).add(midc);
        ctx.moveTo(p.x,p.y);
        for (let i=1;i<b.length;i++) {
            p = b[i].copy().sub(createVector(midx,midy)).mult(min(fx,fy)).add(midc)
            ctx.lineTo(p.x,p.y);
        }
        if (closeline==0) {
            p = b[0].copy().sub(createVector(midx,midy)).mult(min(fx,fy)).add(midc);
            ctx.lineTo(p.x,p.y)
        }
        ctx.stroke();
    }
}

function OnOriChange() {
    location.reload();
}

function txtA(s) {
    return `levels: ${s}`
}

function txtB(s) {
    return `Nbr of datapoints: ${s}`
}

function PosElements() {

    ori = window.matchMedia("(orientation: landscape)");
    ori.addListener(OnOriChange)

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

    textSize(18);

    let figcnt = 0
    let hfatxtX = formPosx
    let hfatxtY = formPosy
    hfatxt = createP(txtA(4))
    hfatxt.class("txt")
    hfatxt.position(hfatxtX,hfatxtY)

    figcnt += 1
    let coefAValueX = hfatxtX + hfatxt.size().width + 15;
    let coefAValueY = formPosy + hfatxt.size().height;
    hsaslider = createSlider(0,9,2,1)
    hsaslider.position(coefAValueX,coefAValueY);
    hsaslider.elt.addEventListener("change",changedepth);
    //hsaslider["elt"]["max"] = "10"
    //print("f",hsaslider["elt"]["max"])
    let coefAValueSize = hsaslider.size() 

    figcnt += 1
    let but1 = createButton("Run")
    but1.position(formPosx,formPosy+figcnt*formPosdy)
    but1.class("txt2")
    but1.mousePressed(herstart)

    figcnt += 2;
    hfatxtbl = createP('Baseline:')
    hfatxtbl.class("txt")
    hfatxtbl.position(formPosx,formPosy+figcnt*formPosdy);
    //listValueX = formPosx + hfatxtbl.size().width

    let ctx;
    let basesel;
    let keuze1 = ['straight line','triangle','square']
    basesel = createSelect();
    basesel.position(hfatxtbl.size().width+formPosx,formPosy+(figcnt+0.8)*formPosdy);
    basesel.class("txt")
    //basesel.background(color(0,255,0))
    for (let i=0;i<keuze1.length;i++) {
        basesel.option(keuze1[i]);    
    }
    basesel.changed(()=>{baselinefun(ctx,basesel,keuze1);changetxtB()});

    let bas = select("#img1")
    var vas = document.getElementById("img1");
    ctx = vas.getContext("2d");
    bas.position(hfatxtbl.size().width+formPosx+130,formPosy+(figcnt)*formPosdy)
    ctx.fillStyle = "#000000"
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 4;

    formPosy = formPosy+(figcnt+1)*formPosdy+vas.height;
    figcnt = 0;
    hfatxtml = createP('Model:')
    hfatxtml.class("txt")
    hfatxtml.position(formPosx,formPosy+figcnt*formPosdy);

    let ctxmd;
    let mdsel;
    let keuze2 = ['roof','hole','dip','top','bounce']
    mdsel = createSelect();
    mdsel.position(hfatxtbl.size().width+formPosx,formPosy+(figcnt+0.8)*formPosdy);
    mdsel.class("txt")
    for (let i=0;i<keuze2.length;i++) {
        mdsel.option(keuze2[i]);    
    }
    mdsel.changed(()=>{modellinefun(ctxmd,mdsel,keuze2);changetxtB()});

    let bas2 = select("#img2")
    var vas2 = document.getElementById("img2");
    ctxmd = vas2.getContext("2d");
    bas2.position(hfatxtbl.size().width+formPosx+130,formPosy+(figcnt)*formPosdy)
    ctxmd.fillStyle = "#000000"
    ctxmd.strokeStyle = "#FFFFFF";
    ctxmd.lineWidth = 4;

    hfbtxtX = hfatxtX;
    hfbtxtY = formPosy+(figcnt)*formPosdy+vas2.height;
    hfbtxt = createP("")
    hfbtxt.class("txt")
    hfbtxt.position(hfbtxtX,hfbtxtY)


    changedepth();
    changetxtB();

    baselinefun(ctx,basesel,keuze1);
    modellinefun(ctxmd,mdsel,keuze2);
}

function modellinefun(ctx,bes,choices) {
    k = bes.value();
    let bse;
    let ind = choices.findIndex(n=>k==n);
    bse = mdelList.getData(ind); 
    mdelList.drawbase(ctx,ind,1);
    mdel = bse
    mdel.splice(0,1);
    calcmaxdepth();
    //herstart()
};

function changetxtB() {
    nbrofpoints = (base.length-1)*pow(mdel.length,myk.depth);
    if (!gesloten) nbrofpoints++;
    hfbtxt.elt.innerHTML = txtB(nbrofpoints)
//    let maxdepth = Math.floor(Math.log(3000/(base.length-1))/Math.log(mdel.length));
//    if (hsaslider.value()>maxdepth) {
//        hsaslider.value ( maxdepth);
//        myk.depth = maxdepth;
//    };
    //hsaslider["elt"]["max"] = `${maxdepth}`
    //print("x",hsaslider["elt"])
}

function baselinefun(ctx,bes,choices) {
    k = bes.value();
    let bse;
    let ind = choices.findIndex(n=>k==n);
    bse = dataList.getData(ind);
    dataList.drawbase(ctx,ind,0);
    gesloten = (ind>0);
    base = bse;
} // baselinefun

function changedepth() {
    let sa = hsaslider.value();
    myk.depth = sa; 
    hfatxt.elt.innerHTML = txtA(sa)
    changetxtB();
}

function calcmaxdepth() {
    maxdepth = Math.floor(Math.log(3000/(base.length-1))/Math.log(mdel.length))
    print("MaxDepth:",maxdepth);
    //return nbrofpoints;
}