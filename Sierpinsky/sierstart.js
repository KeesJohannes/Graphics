let myC = null;
const PI = Math.PI;
let base, height;

let event;
let gensier;
let tijd = 500
let stat = 1;
let speed = 1;
let duur = 1000/speed;
let depth = 4;

let gw = 0;
let gh = 0;

let butRun = {};
let butRst = {};
let butHlp = {};
let posSlider = {};
let posTxt1 = {}; 
let posSpinner = {};
let posTxt2 = {};

let modal = null;

let adrestekst;
let pretekst = [];
let origpretekst = [];
let yieldorig;

function OnStart() {
let rect;

    adrestekst = document.getElementById("pretext");
    pretekst = adrestekst.innerHTML.split("\n");
    yieldorig = pretekst[4].replace("<br>","")
    for (let i=0;i<3;i++) {
        origpretekst[i] = pretekst[7+i];
    }
    
    modal = initPopup();

    initCanvas();

    rect = myC.myCanvas.getBoundingClientRect();
    myC.myCanvas.addEventListener("mousedown", (e) => getMousePosition(e,rect,"d"));
    myC.myCanvas.addEventListener("mouseup", (e) => getMousePosition(e,rect,"u"));
    myC.myCanvas.addEventListener("mousemove", (e) => getMousePosition(e,rect,"m"));

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
    posSlider = {x:gw*37,y:butRun.y+butRun.h+gh,w:gw*2,h:gh*7};
    posTxt1 = {x:gw*35,y:posSlider.y+posSlider.h+25};
    posSpinner = {x:butRst.x,y:posSlider.y,w:butRst.w,h:butRun.h}
    posTxt2 = {x:gw*30,y:posSpinner.y+posSpinner.h/2};
    butHlp = {x:gw*37,y:butRun.y,w:gw*2,h:gh*2};
    freeArea = {x:butRun.x-gh,y:0,w:gw*40-butRun.x+gw,h:posSlider.y+posSlider.h+gh};


    DrawCanvas();
    
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
    
    // Step/Run button
    myC.Rect(butRun.x,butRun.y,butRun.w,butRun.h);
    myC.fillText(stat==1?"Run":"Stop",butRun.x+butRun.w/2,butRun.y+butRun.h/2)
    // Restart button
    myC.Rect(butRst.x,butRst.y,butRst.w,butRst.h);
    myC.fillText("Restart",butRst.x+butRst.w/2,butRst.y+butRst.h/2);
    // Help button
    myC.Rect(butHlp.x,butHlp.y,butHlp.w,butHlp.h);
    myC.fillText("?",butHlp.x+butHlp.w/2,butHlp.y+butHlp.h/2);
    
    myC.font("16px Arial");

    mySlider = new slider(myC,posSlider.x,posSlider.y,posSlider.w,posSlider.h,1,20,speed);
    mySlider.draw();
    myC.fillText("Speed:",posTxt1.x,posTxt1.y);

//    mySpinner = new spinner(myC,butRun.x,myC.height*3.3/12,myC.width/18,butRun.h/2);
    mySpinner = new spinner(myC,posSpinner.x,posSpinner.y,posSpinner.w,posSpinner.h);
    mySpinner.setValue(depth);
    mySpinner.draw();
    myC.fillText("Depth:",posTxt2.x,posTxt2.y);


    [base,height] = initSier()
    Sierpinsky(base,height,depth);

}

function getMousePosition(e,rect,action) {
    let x = e.clientX-rect.left;
    let y = e.clientY-rect.top;
    if (x>=freeArea.x && x<=freeArea.x+freeArea.w && y>=freeArea.y && y<=freeArea.y+freeArea.h) {
        if (action=="d") {
            if (x>=butRun.x && x<butRun.x+butRun.w && y>=butRun.y && y<butRun.y+butRun.h) {
                stat = 1 - stat;
                initStapRun();
            } else if (x>=butRst.x && x<butRst.x+butRst.w && y>=butRst.y && y<butRst.y+butRst.h) {
                stat = 1;
                initStapRun();
                myC.clear();
                depth = mySpinner.getValue();
                DrawCanvas();
            } else if (x>=butHlp.x && x<butHlp.x+butHlp.w && y>=butHlp.y && y<butHlp.y+butHlp.h) {
                modal.style.display = "block";
            } else if (x>=mySpinner.x && x<mySpinner.x+mySpinner.w && y>=mySpinner.y && y<mySpinner.y+mySpinner.h) {
                mySpinner.mouseclick(x,y);
            }
        } else if (x>=mySlider.x && x<mySlider.x+mySlider.w && y>=mySlider.y && y<mySlider.y+mySlider.h) {
            mySlider.MouseClick(x,y,action) 
            if (action=="u") {
                speed = mySlider.getValue();
                duur = 1000/speed;
            }
        }
    } else if (action=="d") {
        DoStap();
    }
}

function initStapRun() {
    if (stat==0) { // running
        StartTimer();
    } else { // mouseclick
        clearInterval(event);
    }
    myC.font("14px Arial");
    myC.ctx.clearRect(butRun.x+1,butRun.y+1,butRun.w-2, butRun.h-2);
    myC.fillText(stat==1?"Run":"Stop",butRun.x+butRun.w/2,butRun.y+butRun.h/2);
    myC.font("20px Arial");
}

function StartTimer() {
    event = setInterval(()=>{ 
        let v = gensier.next();
        if (v.done) clearInterval(event);
    },duur)
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
