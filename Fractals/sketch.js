siCanvas = 500;
stand  = 0;
ori = null;

base = [];
mdel = [];
basearray = [];
gedaan = 0;
nbrofpoints = 0;
dataList = null;
mdelList = null;
gesloten = false;
maxdepth = 0;

myk = null; 
genroutine = null;
funcorp = null;
telpoints = 0;

but2 = null;
hsaslider = 1;
dlcbv = false;
formPosx = 0;
formPosy = 0;
formPosdy = 20;
hfatxt = null;
tobedisabled = [];

function fillData() {
    let dataList = new choicedata();
    // straight line (=0)
    dataList.addData(
        [
        createVector(0,0),
        createVector(1,0)
        ]
    );
    // triangle (=1)
    dataList.addData(
        [
        createVector(0,0),
        createVector(0.5,-0.5*sqrt(3)),
        createVector(1,0),
        createVector(0,0)
        ]
    );
    // square (=2)
    dataList.addData(
        [
        createVector(0,0),
        createVector(0,-1),
        createVector(1,-1),
        createVector(1,0),
        createVector(0,0)
        ]
   );

    let mdelList = new choicedata();
    // roof 
    mdelList.addData(
        [
        createVector(0,0),
        createVector(0.5,-0.5),
        createVector(1,0)
        ]
    );
    // hole
    mdelList.addData(
        [
        createVector(0,0),
        createVector(0.5,0.5),
        createVector(1,0)
        ]
    );
    // dip
    mdelList.addData(
        [
        createVector(0,0),
        createVector(1/3,0),
        createVector(0.5,0.5*sqrt(0.5)),
        createVector(2/3,0),
        createVector(1,0)
        ]
    );
    // top
    mdelList.addData(
        [
        createVector(0,0),
        createVector(1/3,0),
        createVector(0.5,-0.5*sqrt(0.5)),
        createVector(2/3,0),
        createVector(1,0)
        ]
    );
    // bounce
    mdelList.addData(
        [
        createVector(0,0),
        createVector(0.25,0),
        createVector(0.25,0.2),
        createVector(0.5,0.2),
        createVector(0.5,0),
        createVector(0.5,-0.2),
        createVector(0.75,-0.2),
        createVector(0.75,0),
        createVector(1,0)
        ]
    );
        
    return [dataList,mdelList];
}

function sizeOfDrawing() {
    let minx = Infinity;
    let maxx = -Infinity;
    let miny = Infinity;
    let maxy = -Infinity;
    let b;
    for (let a of getsticks()) {
        b = a;
        minx = min(minx,a.b.x);
        maxx = max(maxx,a.b.x);
        miny = min(miny,a.b.y);
        maxy = max(maxy,a.b.y);
    }
    minx = min(minx,b.e.x);
    maxx = max(maxx,b.e.x);
    miny = min(miny,b.e.y);
    maxy = max(maxy,b.e.y);

    let factor = min(width,height)*0.9/max(maxx-minx,maxy-miny);
    let middentek = createVector((maxx+minx)/2,(maxy+miny)/2);
    let mcanvas = createVector(width/2,height/2)
    let fun = function(p) {
        // translatie naar oorsprong
        // factor
        // translatie naar midden canvas
        let pp = p.copy().sub(middentek).mult(factor).add(mcanvas);
        return pp; 
        //return p.copy().sub(middentek).mult(factor).add(mcanvas);
    }
    return fun
}

function firststep() {

    stroke(255);

    myk.curpos = base[0];
    myk.firstpos = myk.curpos.copy();

    funcorp = sizeOfDrawing(0); // to determinee the size of the drawing and to make the scale function
    myk.curpos = myk.firstpos.copy();
    genroutine = getsticks(); // this wil generate the drawing.
}

function herstart() {

    disable(tobedisabled)
    
    firststep();

    gedaan = 0;
    stroke(255);

    clear();
    background(0);
    loop();
}

function setup() {

    [dataList,mdelList] = fillData();

    myk = new bereken(2);

    base = dataList.getData(0);
    mdel = mdelList.getData(0);
    mdel.splice(0,1);
    
    let basecanvas = createCanvas(siCanvas,siCanvas);

    PosElements();

    frameRate(50);

    background(0);
    stroke(255);
    angleMode(RADIANS);

    gedaan = 0;

    herstart()
}


function* telling(g,d) {
    let count = Array(d);
    count.fill(0);
    yield count;
    let i = d-1;
    while (i>=0) {
        if (++count[i]>=g) {
            count[i--] = 0;
        } else {
            yield count; //.slice().reverse();
            i = d-1;
        }
    }
}

function* getsticks() {
    telpoints = 0;
    for (let tel=0;tel<base.length-1;tel++) { // length
        let bewaar = Array(myk.depth);
        let telp1 = (tel+1); //%base.length
        let lengte = base[telp1].dist(base[tel]);
        let hoek = base[telp1].copy().sub(base[tel]).heading();
        let newpos = myk.curpos.copy().add(createVector(lengte,0).rotate(hoek));
        let g1 = {b:myk.curpos,e:newpos};
        let base_am = new ApplyModel(mdel,g1);
        bewaar.fill({ind:-1,am:null})
        for (let cnt of telling(mdel.length,myk.depth)) {
            let am = base_am;
            for (let k=0;k<cnt.length;k++) {
                let seg = cnt[k]
                //let haalop = (seg == bewaar[k].ind)
                if (seg == bewaar[k].ind) {
                    am = bewaar[k].am;
                } else {
                    am = new ApplyModel(mdel,am.fetchSeg(seg));
                    bewaar[k] = {ind:seg,am}
                    for (let i=k+1;i<bewaar.length;i++) bewaar[i] = {ind:-1,am:null};
                }
                g1 = am.g;
                if (k==(cnt.length-2) && dlcbv) {
                    yield {b:g1.b,e:g1.e,s:1,telpoints};
                }
            }
            telpoints++;
            yield {b:g1.b,e:g1.e,s:0,telpoints}
        } 
        if (!gesloten) telpoints++;
        myk.curpos = newpos;   
    } 
}    

function draw() {
    
    push();
    fill(0);
    stroke(0);
    strokeWeight(0);
    textStyle(NORMAL)
    rect(170,470,240,30);
    stroke(255)
    fill(255);
    text(`Aantal dp's: ${telpoints+(gesloten?0:1)}`,180,490);
    pop()
    let res = genroutine.next();
    if (res.done) {
        if (gedaan<=1) {
            noLoop();
            //but1.elt.removeAttribute("disabled");
            //but1.attribute("enabled","enabled");
            enable(tobedisabled);
            return;    
        }
    }
    let h = res.value;
    if (h.s==0) {
        myline(h.b,h.e);
    } else {
        stroke(color(255,0,0))
        myline(h.b,h.e);
        stroke(255);
    }

//    noLoop();

}



function myline(b,e) {
    let bp = funcorp(b);
    let ep = funcorp(e);
    line(bp.x,bp.y,ep.x,ep.y);
}

class ApplyModel {
    constructor(m,g) {
        this.imod = []; //Array(m.length+1);
        this.imod[0] = createVector(0,0);
        this.g = g;
        //copieer model naar intern
        for (let i in m) {this.imod[int(i)+1] = m[i].copy()}
        // roteer gelijk aan b->e
        // expand to length b->e
        // translate to b
        let hoek = g.e.copy().sub(g.b).heading();
        let lengte = g.e.dist(g.b);
        for (let i in this.imod) {
            this.imod[int(i)].rotate(hoek).mult(lengte).add(g.b);
        }
    }

    fetchSeg = function(nr) {
        return {b:this.imod[nr].copy(),e:this.imod[nr+1].copy()};
    }
}

class bereken {
    constructor(level) {
        this.depth = level;
        this.basepart = 0;
        this.curpos = null;
        this.firstpos = null;
    }
}