hfa = 2 // hoek frequentie a
hfb = 3 //hoek freuentie b
ofa = 0 // offset a
ofb = Math.PI/2 // ofbset b
sa = 150 // size factor a
sb = 150 // size factor b

deltat = 0.01 // radialen groei per cyclus
tijd = 0;

figuur = []

function setup() {
    createCanvas(600,600);
    background(0);
    figuur = []
}

function draw() {

    clear();
    background(0);
    stroke("white")
    noFill()
    
    translate(width/2,height/2)
    // assenkruis
    line(-width/2,0,width/2,0);
    line(0,-height/2,0,height/2)

    //strokeWeight(5)
    
    x = sa*sin(hfa*tijd+ofa)
    y = sb*sin(hfb*tijd+ofb)
    figuur.push(createVector(x,y))

    strokeWeight(5)
    point(x,height/2-20)
    point(-width/2+20,y)
    
    strokeWeight(1)
    beginShape()
    for (i = 0;i<figuur.length;i++) {
        vertex(figuur[i].x,figuur[i].y)
    }
    endShape()

    tijd = tijd + deltat
    if (tijd>5*Math.PI) {
        tijd = 0
        figuur = []
    }

}