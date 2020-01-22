function ChaosGameStart() {

    initCanvas();
    DrawCanvas();

    rect = myC.myCanvas.getBoundingClientRect();
    myC.myCanvas.addEventListener("mousedown", (e) => getMousePosition(e,rect,"d"));
    myC.myCanvas.addEventListener("mouseup", (e) => getMousePosition(e,rect,"u"));
    myC.myCanvas.addEventListener("mousemove", (e) => getMousePosition(e,rect,"m"));

    initCG();

}

function initCanvas() {
    myC = new Canvas();
    let t = myC.myCanvas.parentElement.getClientRects()[0];
    let t1 = myC.myCanvas.parentElement.firstElementChild.clientHeight;

    let ori = window.matchMedia("(orientation: landscape)");
    ori.addListener(OnOriChange)
    if (!ori.matches)  {//(window.innerWidth<window.innerHeight) { // portrait
        myC.myCanvas.width = t.width; // screen.width*0.8; //  //
        myC.myCanvas.height = screen.availHeight/2;  
    } else {
        myC.myCanvas.width = t.width; //screen.width*0.5
        myC.myCanvas.height = window.innerHeight-t1;   
    }
    myC.width = myC.myCanvas.clientWidth;
    myC.height = myC.myCanvas.clientHeight;

    gw = myC.width/40;
    gh = myC.height/40;

    butRun = {x:gw*28,y:gh*1,w:gw*3,h:gh*2};
    butRst = {x:gw*32,y:butRun.y,w:gw*4,h:butRun.h};
    mybutRun = new button(myC,"Stop",butRun.x,butRun.y,butRun.w,butRun.h);
    mybutRun.clicked = true; // running
    mybutRst = new button(myC,"Restart",butRst.x,butRst.y,butRst.w,butRst.h);
    butHlp = {x:gw*37,y:butRun.y,w:gw*2,h:gh*2};
    mybutHlp = new button(myC,"?",butHlp.x,butHlp.y,butHlp.w,butHlp.h);
//    freeArea = {x:butRun.x-gh,y:0,w:gw*40-butRun.x+gw,h:butRst.y+butRst.h+gh};

//    modal = initPopup();

}

function OnOriChange() {
    location.reload();
}

function DrawCanvas() {
    myC.lineWidth(1);
    myC.font("14px Arial");
    myC.textAlign("center")
    myC.textBaseline("middle")
    myC.stroke("white")   

    mybutRun.draw();
    mybutRst.draw();
    mybutHlp.draw();
}

let driehoek = [];
let current = null;
let count = 20000;
let dia = 0;
let where = {}; // y_midden, x_midden., 

function initCG() {
    let b = 0.9*myC.width;
    let angle = Math.PI*2/3; // 120gr)
    let h = b*Math.tan(-angle)/2;
    if (h>myC.height*0.9) {
        h = myC.height*0.9;
        b = 2*h/Math.tan(-angle)
    }    
    let xleft = (myC.width-b)/2;
    let ytop = (myC.height-h)/2;
    let pl = { x: xleft, y: ytop+h };
    let pr = { x: pl.x + b, y: pl.y }
    let pt = { x: (pl.x + pr.x) / 2, y: pl.y-h};
    driehoek = [pl,pr,pt];
    where = {y_midden:(pl.y+pt.y)/2, x_midden:pt.x};
    base = b; 

    adrestekst = document.getElementById("pretext");

    myC.stroke("#FF0000");
    myC.lineWidth(1);

    md1 = myC.ctx.createImageData(1,1);
    md1.data[0] = 255; // R
    md1.data[1] = 0;  // G
    md1.data[2] = 0;  // B
    md1.data[3] = 255; // Alpha
    md2 = myC.ctx.createImageData(1,1);
    md2.data[0] = 0; // R
    md2.data[1] = 255;  // G
    md2.data[2] = 0;  // B
    md2.data[3] = 255; // Alpha
    md3 = myC.ctx.createImageData(1,1);
    md3.data[0] = 100; // R
    md3.data[1] = 100;  // G
    md3.data[2] = 255;  // B
    md3.data[3] = 255; // Alpha

    startcg();
}

function startcg() {
    // random choose a first point within the triangle
    current = getRndPointInTriangle(driehoek)
    window.clearInterval(event);
    count = 20000;
    event = window.setInterval(()=>{
        if (count>0 && mybutRun.clicked) {
            deel = Math.min(count,100);
            count -= deel;
            while (deel>0) {
                OneStep();
                deel--;
            }            
            myC.clearRect(driehoek[2].x-20,driehoek[0].y+10,40,30);
            myC.fill("white")
            myC.fillText(`${count}`,driehoek[2].x,driehoek[0].y+30)
        } else {
            window.clearInterval(event);
        }
    },50)
}


function OneStep() {
    if (dia<=0) {
        let md;
        if (current.y<where.y_midden) md = md1;
        else if (current.x<where.x_midden) md = md2;
        else md = md3;
        myC.ctx.putImageData(md,current.x,current.y);
    } else {
        myC.Circle(current.x,current.y,dia)
    }
    let p = driehoek[Math.floor(Math.random()*3)];
    current = {x:(current.x+p.x)/2,y:(current.y+p.y)/2};
}


function getRndPointInTriangle() {
    let partx = Math.random(); // 
    let ncux = driehoek[0].x*(1-partx) + driehoek[1].x*partx; // somewhere at the basis
    let party = Math.random()**2; // more points at the basis compared to the top
    let ncuy = driehoek[0].y*(1-party) + driehoek[2].y*party; // somewhere between the basis and he top
    ncux = ncux*(1-party) + driehoek[2].x*party; // id
    return {x:ncux,y:ncuy};
}

function getMousePosition(e,rect,action) {
    let x = e.clientX-rect.left;
    let y = e.clientY-rect.top;
        if (action=="d") {
            if (x>=butRun.x && x<butRun.x+butRun.w && y>=butRun.y && y<butRun.y+butRun.h) {
//                stat = 1 - stat;
//                initStapRun();
            } else if (x>=butRst.x && x<butRst.x+butRst.w && y>=butRst.y && y<butRst.y+butRst.h) {
                myC.save();
                myC.clear();
                DrawCanvas();
                myC.restore();
                startcg();
            } else if (x>=butHlp.x && x<butHlp.x+butHlp.w && y>=butHlp.y && y<butHlp.y+butHlp.h) {
//                modal.style.display = "block";
            }
        }
}
