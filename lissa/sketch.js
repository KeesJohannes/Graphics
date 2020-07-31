//function preload() {
//    myFont = loadFont("assets/arial.ttf")
//}

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

//myFont = null
formPosx = 620
formPosdx = 110
formPosy = 1
formPosdy = 20

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
    createCanvas(600,600);
    translate(width/2,height/2)
    background(0);
    figuur = []

    figcnt = 0
    hfatxt = createP(txtA())
    hfatxt.class("txt")
    hfatxt.position(formPosx,figcnt*formPosy)

    figcnt += 1
    hfbtxt = createP(txtB())
    hfbtxt.class("txt")
    hfbtxt.position(formPosx,formPosy+figcnt*formPosdy)

    figcnt += 2;
    h = createP("coefficient X:")
    h.class("txt")
    h.position(formPosx,formPosy+figcnt*formPosdy)

    figcnt += 1
    hsaslider = createSlider(10,200,150,10)
    hsaslider.position(formPosx+formPosdx,formPosy+figcnt*formPosdy) 
    hsaslider.value(sa)
    hsaslider.elt.addEventListener("change",()=>{sa = hsaslider.value();hfatxt.elt.innerHTML = txtA();})

    h = createP("coefficient Y:")
    h.class("txt")
    h.position(formPosx,formPosy+figcnt*formPosdy)

    figcnt += 1
    hsbslider = createSlider(10,200,150,10)
    hsbslider.position(formPosx+formPosdx,formPosy+figcnt*formPosdy) 
    hsbslider.value(sb)
    hsbslider.elt.addEventListener("change",()=>{sb = hsbslider.value();hfbtxt.elt.innerHTML = txtB();})

    figcnt += 1
    h = createP("frequentie X:")
    h.class("txt")
    h.position(formPosx,formPosy+figcnt*formPosdy)

    figcnt += 1
    hfaslider = createSlider(1,10,1,1)
    hfaslider.position(formPosx+formPosdx,formPosy+figcnt*formPosdy) 
    hfaslider.value(hfa)
    hfaslider.elt.addEventListener("change",()=>{hfa = hfaslider.value();hfatxt.elt.innerHTML = txtA();})

    h = createP("frequentie y:")
    h.class("txt")
    h.position(formPosx,formPosy+figcnt*formPosdy)
    
    figcnt += 1
    hfbslider = createSlider(1,10,1,1)
    hfbslider.position(formPosx+formPosdx,formPosy+figcnt*formPosdy) 
    hfbslider.value(hfb)
    hfbslider.elt.addEventListener("change",()=>{hfb = hfbslider.value();hfbtxt.elt.innerHTML = txtB();})

    figcnt += 1
    h = createP("fase X:")
    h.class("txt")
    h.position(formPosx,formPosy+figcnt*formPosdy)

    figcnt += 1
    hfxslider = createSlider(0,2,0,0.1)
    hfxslider.position(formPosx+formPosdx,formPosy+figcnt*formPosdy) 
    hfxslider.value(ofap)
    hfxslider.elt.addEventListener("change",()=>{ofap = hfxslider.value();hfatxt.elt.innerHTML = txtA();})

    h = createP("fase Y:")
    h.class("txt")
    h.position(formPosx,formPosy+figcnt*formPosdy)

    figcnt += 1
    hfyslider = createSlider(0,2,0,0.1)
    hfyslider.position(formPosx+formPosdx,formPosy+figcnt*formPosdy) 
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
    text("x = A*sin(freqA*t+faseX)",-width/4,height*0.39,width/2,100)
    rotate(-PI/2)
    text("y = B*sin(freqB*t+faseY)",-width/4,-height*0.53,width/2,height/10)
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
    if (figuur.length>2000) {
        tijd = 0
        figuur = []
    }

    
    //noLoop()
}