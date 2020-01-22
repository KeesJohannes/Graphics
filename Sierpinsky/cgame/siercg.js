function ChaosGameStart() {

    initCanvas();
    DrawCanvas();
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

//    modal = initPopup();

}

function OnOriChange() {

}

function DrawCanvas() {
    myC.lineWidth(1);
    myC.font("14px Arial");
    myC.textAlign("center")
    myC.textBaseline("middle")
    myC.stroke("white")   
}

let driehoek = [];
let current = null;
let count = 20000;
let dia = 0;

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
    base = b; 

    adrestekst = document.getElementById("pretext");

    myC.stroke("#FF0000");
    myC.lineWidth(1);

    md = myC.ctx.createImageData(1,1);
    md.data[0] = 255; // R
    md.data[1] = 0;  // G
    md.data[2] = 0;  // B
    md.data[3] = 255; // Alha

    // random choose a first point within the triangle
    current = getRndPointInTriangle(driehoek)
    event = window.setInterval(()=>{
        if (count>0) {
            deel = Math.min(count,100);
            count -= deel;
            while (deel>0) {
                OneStep();
                deel--;
            }            
            myC.clearRect(pt.x-20,pl.y+10,40,30);
            myC.fillText(`${Math.floor(count/100)}`,pt.x,pl.y+30)
        } else {
            window.clearInterval(event);
        }
    },50)
}


function OneStep() {
    if (dia<=0) {
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
