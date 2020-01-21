let myC = null;
let stat = 0 // auto
let adrestekst = null;

let speed = 1;
let depth = 2;
let duur = 1000/speed;
let followExec = true;

let startstring = "F+G+G"
let base = 1;
let timer = null;
let vstap = {done:true};

modal = null;


function LSystemStart() {

    initCanvas();
    DrawCanvas();
    initLSier();

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
    butShow = {x:butRun.x,y:posSpinner.y+posSpinner.h+25,w:gw*8,h:butRun.h};
    freeArea = {x:butRun.x-gh,y:0,w:gw*40-butRun.x+gw,h:posSlider.y+posSlider.h+gh};

    mySlider = new slider(myC,posSlider.x,posSlider.y,posSlider.w,posSlider.h,1,50,speed);
    mySpinner = new spinner(myC,posSpinner.x,posSpinner.y,posSpinner.w,posSpinner.h);
    mySpinner.setValue(depth);
    mybutShow = new button(myC,"No Execution",butShow.x,butShow.y,butShow.w,butShow.h);
    mybutShow.clicked = followExec;

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
    
    // Step/Run button
    myC.Rect(butRun.x,butRun.y,butRun.w,butRun.h);
    myC.fillText(stat==1?"Run":"Stop",butRun.x+butRun.w/2,butRun.y+butRun.h/2)
    // Restart button
    myC.Rect(butRst.x,butRst.y,butRst.w,butRst.h);
    myC.fillText("Restart",butRst.x+butRst.w/2,butRst.y+butRst.h/2);
    // Help button
    myC.Rect(butHlp.x,butHlp.y,butHlp.w,butHlp.h);
    myC.fillText("?",butHlp.x+butHlp.w/2,butHlp.y+butHlp.h/2);
    // Show button
    mybutShow.draw();
    myC.font("16px Arial");

    mySlider.draw();
    myC.fillText("Speed:",posTxt1.x,posTxt1.y);

    mySpinner.draw();
    myC.fillText("Depth:",posTxt2.x,posTxt2.y);

}

function initLSier() {
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
    base = b; 

    adrestekst = document.getElementById("pretext");

    myC.stroke("#FF0000");
    myC.lineWidth(2);
    turtlestart = {canvas:myC,p:pl,angle:0};
    tur = new turtle(myC,{x:pl.x,y:pl.y},0);

    depth = mySpinner.getValue();
    speed = mySlider.getValue();
    duur = 1000/speed;

    gf = StepString(startstring,depth,base);
    vstap = gf.next();

    initStapRun();

}

let info = [];
let ctrl = [];
function handleInfo(ev) {
    let level = ev.level;
    let cnt = ev.count;
    let st = ev.rstr;
    while (info.length<level) {
        info.push("");
        ctrl.push(-1)
    }
    for (let i=0;i<level;i++) {
        info[i] = "";
        ctrl[i] = -1;
    }
    if (level<0) {
        info = [];
        ctrl = [];
    } else {
        info[level] = `${level}: ${cnt}: ${st}`
        ctrl[level] = cnt;
    }
    if (!followExec) {
        adrestekst.innerHTML = "";
        return;
    }
    let tkst = [];
    let bl = "";
    let hi = info.slice().reverse();
    let hc = ctrl.slice().reverse();
    for (let i=0;i<hi.length;i++) {
        tkst[2*i] = hi[i];
        tkst[2*i+1] = "";
        let h = 6+hc[i];
        while (bl.length<h) bl += " ";
        if (hc[i]>=0) tkst[2*i+1] = bl.substring(0,6+hc[i])+"^"
    }
    adrestekst.innerHTML = tkst.join("<br>")
}

function doAutoStap() {
    if (stat==1) return;
    if (!vstap.done) {
        handleInfo(vstap.value);
        vstap = gf.next();
    } else {
        handleInfo({level:-1,count:-1,rstr:""})
        stat = 1;
        window.clearInterval(timer);
        updaterunbut();
    }
}

function doManStap() {
    if (stat==0) return; // running
    if (vstap.done) return;
    handleInfo(vstap.value);
    vstap = gf.next();
}

function initStapRun() {
    if (stat==0) { // running
        StartTimer();
    } else { // mouseclick
        clearInterval(timer);
    }
    updaterunbut();
}

function StartTimer() {
    clearInterval(timer);
    timer = setInterval(doAutoStap,duur);
}

function updaterunbut() {
    myC.save();
    myC.font("14px Arial");
    myC.ctx.clearRect(butRun.x+1,butRun.y+1,butRun.w-2, butRun.h-2);
    myC.fillText(stat==1?"Run":"Stop",butRun.x+butRun.w/2,butRun.y+butRun.h/2);
    myC.restore();

}


class rule {
    constructor(l,s) {
        this.letter = l;
        this.str = s;
    }

}

ruleset = [];
ruleset.push(new rule("F","F+G-F-G+F"))
ruleset.push(new rule("G","GG"))

function* StepString(rstr,level,len) {
    let count = 0;
    yield {level,rstr,count};
    if (level<=0) {
        for (char of rstr) {
            yield {level,rstr,count};
            DoAction(char,len);
            count++
        }
    } else {
        for (char of rstr) {
            yield {level,rstr,count};
            let ind = ruleset.findIndex(r=>r.letter==char);
            if (ind>=0) {
                yield* StepString(ruleset[ind].str,level-1,len/2)
            } else {
                DoAction(char,len);
            }
            count++;
        }
    }
}

function DoAction(letter,len) {
    if (letter=="F" || letter=="G") {
        tur.draw(len);
    } else if (letter=="+") {
        tur.rotate(2*Math.PI/3)
    } else if (letter=="-") {
        tur.rotate(-2*Math.PI/3)
    }
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
                myC.save();
                myC.clear();
                DrawCanvas();
                mySlider.drawValue();
                myC.restore();
                depth = mySpinner.getValue();
                speed = mySlider.getValue();
                duur = 1000/speed;
                tur.reset(turtlestart.p,turtlestart.angle);
                gf = StepString(startstring,depth,base);
                vstap = gf.next();
                initStapRun();
            } else if (x>=butHlp.x && x<butHlp.x+butHlp.w && y>=butHlp.y && y<butHlp.y+butHlp.h) {
                modal.style.display = "block";
            } else if (x>=mySpinner.x && x<mySpinner.x+mySpinner.w && y>=mySpinner.y && y<mySpinner.y+mySpinner.h) {
                mySpinner.mouseclick(x,y);
            } else if (mybutShow.isClicked(x,y)) {
                mybutShow.click();
                mybutShow.text = mybutShow.clicked?"No Execution":"Execution";
                mybutShow.redraw();
                followExec = mybutShow.clicked;
            }
        } else if (x>=mySlider.x && x<mySlider.x+mySlider.w && y>=mySlider.y && y<mySlider.y+mySlider.h) {
            mySlider.MouseClick(x,y,action) 
            if (action=="u") {
                speed = mySlider.getValue();
                duur = 1000/speed;
            }
        }
    } else if (action=="d") {
        doManStap();
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
    