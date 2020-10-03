
hfa = 5 // hoek frequentie a
hfb = 3 //hoek freuentie b
ofap = 0
ofa = Math.PI*ofap // offset a
ofbp = 0.5
ofb = Math.PI*ofbp // offset b
sa = 150 // size factor a
sb = 150 // size factor b

deltat = 0.01 // radialen groei per cyclus
tijd = 0;

figuur = []

formPosx = 570
formPosdx = 120
formPosy = 1
formPosdy = 20

stand  = 0
ori = null

function OnOriChange() {
    location.reload();
}

function txtA() {
    herstart()
    return `x = ${sa}*sin(${hfa}*t+${ofap}*PI)`
}

function txtB() {
    herstart()
    return `y = ${sb}*sin(${hfb}*t+${ofbp}*PI)`
}

function herstart() {
    tijd = 0
    figuur = []
}

function setup() {

    ori = window.matchMedia("(orientation: landscape)");
    ori.addListener(OnOriChange)

    siCanvas = 500
    if (windowWidth > windowHeight) {
        stand = 1; // (landscape)
    } else {
        stand = 0; //(portrait)
    }
    createCanvas(siCanvas,siCanvas);
    if (stand==0) { // portrait
        formPosx = 10
        formPosy = 570
    } else { // landscape
        formPosx = 570
        formPosy = 1
    }
    
    translate(width/2,height/2)
    background(0);

    figuur = []

    figcnt = 0
    hfatxtX = formPosx
    hfatxtY = formPosy
    hfatxt = createP(txtA())
    hfatxt.class("txt")
    hfatxt.position(hfatxtX,hfatxtY)

    figcnt += 1
    hfbtxtX = formPosx
    hfbtxtY = formPosy+figcnt*formPosdy
    hfbtxt = createP(txtB())
    hfbtxt.class("txt")
    hfbtxt.position(hfbtxtX,hfbtxtY)

    figcnt += 2;
    coefAtxtX = formPosx
    coefAtxtY = formPosy+figcnt*formPosdy
    h = createP("coefficient X:")
    h.class("txt")
    h.position(coefAtxtX,coefAtxtY)
    coefAtxtSize = h.size() 

    figcnt += 1
    coefAValueX = coefAtxtX + coefAtxtSize.width + 10
    coefAValueY = formPosy+figcnt*formPosdy
    hsaslider = createSlider(10,200,150,10)
    hsaslider.position(coefAValueX,coefAValueY) 
    hsaslider.value(sa)
    hsaslider.elt.addEventListener("change",()=>{sa = hsaslider.value();hfatxt.elt.innerHTML = txtA();})
    coefAValueSize = hsaslider.size() 

    coefBtxtX = formPosx
    coefBtxtY = formPosy+figcnt*formPosdy
    h = createP("coefficient Y:")
    h.class("txt")
    h.position(coefBtxtX,coefBtxtY)
    coefBtxtSize = h.size() 

    figcnt += 1
    coefBValueX = coefAValueX ;//coefBtxtX + coefBtxtSize.width + 10
    coefBValueY = formPosy+figcnt*formPosdy
    hsbslider = createSlider(10,200,150,10)
    hsbslider.position(coefBValueX,coefBValueY)
    coefBValueSize = hsbslider.size() 
    hsbslider.value(sb)
    hsbslider.elt.addEventListener("change",()=>{sb = hsbslider.value();hfbtxt.elt.innerHTML = txtB();})

    figcnt += 1
    freqAtxtX = formPosx
    freqAtxtY = formPosy+figcnt*formPosdy
    h = createP("frequentie X:")
    h.class("txt")
    h.position(formPosx,formPosy+figcnt*formPosdy) 
    freqAtxtSize = h.size()

    figcnt += 1
    freqAValueX = coefAValueX; //freqAtxtX + freqAtxtSize.width + 10
    freqAValueY = formPosy+figcnt*formPosdy
    hfaslider = createSlider(1,10,1,0.1)
    hfaslider.position(freqAValueX, freqAValueY); 
    hfaslider.value(hfa)
    hfaslider.elt.addEventListener("change",()=>{
        if (wnValue.checked()) {
            hfa = (Math.floor(hfaslider.value()))
        } else {
            hfa = hfaslider.value();
        }
        hfatxt.elt.innerHTML = txtA();
    })
    freqAValueSize = hfaslider.size() 

    wnValueX = freqAValueX + freqAValueSize.width + 10
    wnValueY = formPosy+(figcnt+0.5)*formPosdy
    wnValue = createCheckbox("whole numbers",true)
    wnValue.class("txt")
    wnValue.position(wnValueX,wnValueY)
    wnValue.changed(()=>{
        if (wnValue.checked) {
            hfa = (Math.floor(hfaslider.value()))
            hfb = (Math.floor(hfbslider.value()))
        } else {
            hfa = hfaslider.value();
            hfb = hfbslider.value();
        }
        hfatxt.elt.innerHTML = txtA()
        hfbtxt.elt.innerHTML = txtB()
    })


    freqBtxtX = formPosx
    freqBtxtY = formPosy+figcnt*formPosdy
    h = createP("frequentie y:")
    h.class("txt")
    h.position(freqBtxtX, freqBtxtY);
    freqBtxtSize = h.size()

    figcnt += 1
    freqBValueX = coefAValueX; //freqBtxtX + freqBtxtSize.width + 10
    freqBValueY = formPosy+figcnt*formPosdy
    hfbslider = createSlider(1,10,1,0.1)
    hfbslider.position(freqBValueX, freqBValueY);  
    hfbslider.value(hfb)
    hfbslider.elt.addEventListener("change",()=>{
        if (wnValue.checked()) {
            hfb = (Math.floor(hfbslider.value()))
        } else {
            hfb = hfbslider.value();
        }
        hfbtxt.elt.innerHTML = txtB();
    })

    figcnt += 1
    faseAtxtX = formPosx
    faseAtxtY = formPosy+figcnt*formPosdy
    h = createP("fase X:")
    h.class("txt")
    h.position(faseAtxtX, faseAtxtY)
    faseAtxtSize = h.size()

    figcnt += 1
    faseAValueX = coefAValueX; //faseAtxtX + faseAtxtSize.width + 10
    faseAValueY = formPosy+figcnt*formPosdy
    hfxslider = createSlider(0,2,0,0.1)
    hfxslider.position(faseAValueX, faseAValueY) 
    hfxslider.value(ofap)
    hfxslider.elt.addEventListener("change",()=>{ofap = hfxslider.value();hfatxt.elt.innerHTML = txtA();})

    faseBtxtX = formPosx
    faseBtxtY = formPosy+figcnt*formPosdy
    h = createP("fase Y:")
    h.class("txt")
    h.position(faseBtxtX, faseBtxtY)

    figcnt += 1
    faseBValueX = coefAValueX; //faseAtxtX + faseAtxtSize.width + 10
    faseBValueY = formPosy+figcnt*formPosdy
    hfyslider = createSlider(0,2,0,0.1)
    hfyslider.position(faseBValueX, faseBValueY) 
    hfyslider.value(ofbp)
    hfyslider.elt.addEventListener("change",()=>{ofbp = hfyslider.value();hfbtxt.elt.innerHTML = txtB();})

    figcnt += 2
    but1 = createButton("Restart")
    but1.position(formPosx,formPosy+figcnt*formPosdy)
    but1.class("txt2")
    but1.mousePressed(herstart)
}

function draw() {

    clear();
    background(0);
    translate(width/2,height/2)
    //textFont(myFont)

    // assenkruis
    fill("white")
    stroke(255)
    strokeWeight(1)
    line(-width/2+width/16,0,width/2,0);
    line(0,-height/2,0,height/2-height/16)
    
    push()
    textSize(18)
    textAlign(CENTER,CENTER)
    noStroke()
    text("x = A*sin(freqA*t+faseX)",-width/4,height*0.37,width/2,100)
    rotate(-PI/2)
    text("y = B*sin(freqB*t+faseY)",-width/4,-height*0.52,width/2,height/10)
    pop()

    x = sa*sin(hfa*tijd+ofa)
    y = sb*sin(hfb*tijd+ofb)
    figuur.push(createVector(x,y))

    strokeWeight(10)
    point(x,y)
    strokeWeight(5)
    point(x,height/2-40)
    point(-width/2+40,y)

    noFill()
    strokeWeight(1)
    beginShape()
    for (i = 0;i<figuur.length;i++) {
        vertex(figuur[i].x,figuur[i].y)
    }
    endShape()



    tijd = tijd + deltat
    if (figuur.length>10000) {
        tijd = 0
        figuur = []
    }

    
}