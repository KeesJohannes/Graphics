function ChaosGameStart() {

    initCanvas();
    DrawCanvas();

    rect = myC.myCanvas.getBoundingClientRect();
    myC.myCanvas.addEventListener("mousedown", (e) => getMousePosition(e,rect,"d"));

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
    freeArea = {x:butRun.x-gh,y:0,w:gw*40-butRun.x+gw,h:butRst.y+butRst.h+gh};
    mytxtHead = {x:myC.width/2,y:gh*3,w:gw*10,h:gh*3};

    modal = initPopup();

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

    printStatus();

}

function printStatus() {
    myC.save();
    myC.font("24px Arial")
    myC.fill("black")
    myC.fillRect(mytxtHead.x-mytxtHead.w/2,mytxtHead.y-mytxtHead.h/2,mytxtHead.w,mytxtHead.h);
    if (mybutRun.clicked) {
        myC.fill("white")
        myC.fillText("Running",mytxtHead.x,mytxtHead.y)
    }
    myC.restore();
}

let driehoek = [];
let current = null;
let count = 20000;
let dia = 4; // grootte point when not running
let where = {}; // y_midden, x_midden.,
let pijlpunt = {}

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
    let siw = myC.width/70;
    let sih = myC.height/50;
    myC.stroke("white")
    myC.lineWidth(2);
    let ploff = [{x:0,y:1},{x:0,y:3},{x:-1,y:2},{x:1,y:2}];
    let xmin = Infinity;
    let xmax = -Infinity;
    let ymin = Infinity;
    let ymax = -Infinity; 
    let pijl = [];
    for (let i=0;i<ploff.length;i++) {
        let p = ploff[i];
        xmin = Math.min(xmin,p.x);
        xmax = Math.max(xmax,p.x);
        ymin = Math.min(ymin,p.y);
        ymax = Math.max(ymax,p.y);
        pijl.push({x:siw*p.x,y:sih*p.y}) // aangepaste ploff array
    }
    // pijlen bevat het sjabloon voor een pijl;
    pijlpunt = {pijl,rh:{x:siw*xmin,y:sih*ymin,w:siw*(xmax-xmin),h:sih*(ymax-ymin)}}; // drie pijl coordinaten voor alle 3 de hoekpunten.

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

    drawcorners()

    startcg();
}

function drawPijl(ind) {
    let cf = ind==2?-1:1;
    let corner = driehoek[ind];
    let rh = pijlpunt.rh;
    myC.clearRect(corner.x+rh.x,corner.y+cf*rh.y,rh.w,cf*rh.h);
    let pijl = pijlpunt.pijl;
    let p0 = {x:corner.x+pijl[0].x,y:corner.y+cf*pijl[0].y};
    let p1 = {x:corner.x+pijl[1].x,y:corner.y+cf*pijl[1].y};
    let p2 = {x:corner.x+pijl[2].x,y:corner.y+cf*pijl[2].y};
    let p3 = {x:corner.x+pijl[3].x,y:corner.y+cf*pijl[3].y};
    myC.save();
    myC.stroke("white")
    myC.lineFromTo(p0,p1);
    myC.lineFromTo(p0,p2);
    myC.lineFromTo(p0,p3);
    myC.restore();
}

function clearPijlen() {
    for (let i=0;i<3;i++) {
        let cf = i==2?-1:1;
        let corner = driehoek[i];
        let rh = pijlpunt.rh;
        myC.clearRect(corner.x+rh.x,corner.y+cf*rh.y,rh.w,cf*rh.h)
    }
}

function drawcorners() {
    myC.save()
    myC.fill("#00FF00");
    myC.Circle(driehoek[0].x,driehoek[0].y,5);
    myC.fill("#"+(100).toString(16)+(100).toString(16)+"FF");
    myC.Circle(driehoek[1].x,driehoek[1].y,5);
    myC.fill("#FF0000");
    myC.Circle(driehoek[2].x,driehoek[2].y,5);
    myC.restore();
}

function startcg() {
    // random choose a first point within the triangle
    current = getRndPointInTriangle(driehoek)
    restartcg(20000);
}

function restartcg(cnt) {
    if (cnt!==undefined) count = cnt;
    window.clearInterval(event);
    event = window.setInterval(()=>{
        if (count>0 && mybutRun.clicked) { // status is running
            printStatus();
            manySteps();
            updatemessage();
        } else {
            stopcg();
            mybutRun.clicked = false; // status is stopped
            mybutRun.text = "Run";
            mybutRun.redraw();
            printStatus();
        } 
    },50)
}

function stopcg() {
    window.clearInterval(event);
}

function manySteps() {
    let deel = Math.min(count,100);
    while (deel>0 && mybutRun.clicked) { // status is running
        OneStep();
        deel--;
        count--;
    }            
}

let idtrail = [];
function TrailOneStep() {
    idtrail.push({md:myC.ctx.getImageData(current.x-dia,current.y-dia,2*dia,2*dia),
        x:current.x,y:current.y})
    myC.save();
    myC.fill("white")
    myC.Circle(current.x,current.y,dia)
    myC.restore();
    let ind = Math.floor(Math.random()*3);
    let p = driehoek[ind];
    if (!mybutRun.clicked) { // status is stopped
        clearPijlen();
        drawPijl(ind);
    }
    current = {x:(current.x+p.x)/2,y:(current.y+p.y)/2};
    if (idtrail.length>=2) {
        trailEmptyOne();
    }
}

function trailRestoreFirst()  {
    if (idtrail.length>0) {
        let mdxy = idtrail.shift();
        myC.ctx.putImageData(mdxy.md,mdxy.x-dia,mdxy.y-dia)
        let md;
        if (mdxy.y<mdxy.y_midden) md = md1;
        else if (mdxy.x<where.x_midden) md = md2;
        else md = md3;
        myC.ctx.putImageData(md,mdxy.x,mdxy.y);
    }
}

function trailEmptyOne() {
    if (idtrail.length>1) {
        if (idtrail.length>2) {
            trailRestoreFirst();
        }
        if (idtrail.length>1) {
            let c = idtrail[0];
            myC.save();
            myC.fill("#FF3300");
            myC.Circle(c.x,c.y,dia)
            myC.restore();
        }
    }
} 

function trailEmptyAll() {
    while (idtrail.length>0) trailRestoreFirst();
}

function OneStep() {
    if (mybutRun.clicked) { // status is running
        let md;
        if (current.y<where.y_midden) md = md1;
        else if (current.x<where.x_midden) md = md2;
        else md = md3;
        myC.ctx.putImageData(md,current.x,current.y);
    } else { // status is stopped
        myC.Circle(current.x,current.y,dia)
    }
    let p = driehoek[Math.floor(Math.random()*3)];
    current = {x:(current.x+p.x)/2,y:(current.y+p.y)/2};
}

function updatemessage() {
    myC.clearRect(driehoek[2].x-20,driehoek[0].y+10,40,30);
    myC.fill("white")
    myC.fillText(`${count}`,driehoek[2].x,driehoek[0].y+30)
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
    if (x>=freeArea.x && x<freeArea.x+freeArea.w && y>=freeArea.y && y<freeArea.y+freeArea.h) {
        if (action=="d") {
            if (mybutRun.isClicked(x,y)) {
                mybutRun.click();
                printStatus();
                if (mybutRun.clicked) { // status is running
                    mybutRun.text = "Stop"
                    trailEmptyAll();
                    if (count==0) startcg();
                    else restartcg();
                } else {
                    mybutRun.text = "Run"; // status is manual
                    stopcg();
                }
                mybutRun.redraw();
            } else if (mybutRst.isClicked(x,y)) {
                stopcg();
                myC.save();
                myC.clear();
                DrawCanvas();
                myC.restore();
                drawcorners();
                count = 0;
                mybutRun.clicked = false; // status is stopped
                mybutRun.text = "Run"
                mybutRun.redraw();
                printStatus();
            } else if (mybutHlp.isClicked(x,y)) {
                modal.style.display = "block";
            }
        }
    } else if (!mybutRun.clicked) { // status is stopped
        if (count==0) {
            count = 2000;
        }
        deel = Math.min(count,1)
        while (deel>0) {
            TrailOneStep();
            count--;
            deel--;
        }
        updatemessage();
    }
}

function initPopup() {
    // Get the modal
    var modal = document.getElementById("myModal");
    
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    
    // When the user clicks the button, open the modal
    /* 
    btn.onclick = function() {
      modal.style.display = "block";
    }
    */
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    
    return modal;
}
