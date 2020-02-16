// genaration n and n-1
points = []; // generation n
points2 = []; // generation n-1 with the same number of points as generation n. 

// arrays for the demo
points3 = []
points4 = []

size = 90
richt = []; // de 4 vectors to the south-east, south-west, north-east and north-west.

t = 0; // elapsetime from 0 to duration.
duration = 100;
waitingtime = 20;
maxdetail = 4 // highest generation.
detail = 0; // current generation

function setup() {
    createCanvas(800,400);
    background(0);
    colorMode(HSB,100)
    stroke(50)
    frameRate(20)
    richt = [
        createVector(-1,1),
        createVector(-1,-1),
        createVector(1,-1),
        createVector(1,1)
    ]
    
    // initial values
    points = richt.map(r=>r.copy().mult(size));
    points2 = richt.slice();

    t = 0;
    detail = 0;

    enlarge(); // 4 times as many points from table points to table points2.
    dostep(); // generate the next generation

    // fill the points3 and points4 with the values from points and points2.
    copytodemo() // copy of the first generation
 
}

// the presentation function in the y direction 
function cy(y) {
    return -y;
}

function cp(p) {
    return createVector(p.x,cy(p.y));
}

function copytodemo() {
    points3 = points.map(v=>v.copy());
    points4 = points2.map(v=>v.copy());
}

// generate generation n-1 with the number of points from generation n
// generation n has N(n) points; generation n+1 has N(n=1) = 4*N(n);
// this function add 3*N(n) points extra.   
function enlarge() {
    points2 = [];
    for (let i=0;i<points.length;i+=4) {
        for (let j=1;j<4;j++) {
            let p1 = points[i+j-1];
            let p2 = points[i+j];
            for (let k=0;k<5;k++) {
                points2.push(p5.Vector.add(p1.copy().mult(1-k/5),p2.copy().mult(k/5)));
            }
        }
        points2.push(points[i+3].copy())
    }
}

// Generate the next generation. 
// This is done in the same table thereby destroying the previous generation   
function dostep() {
    let tocopy = points.length; // the length of generation n-1

    // replicate the picture 4 times and move to the corners.
    halfthesize(tocopy); // half the graphic
    copytori(1,tocopy); // copy SW
    copytori(2,tocopy); // copy SE
    copytori(3,tocopy); // copy NE and mirror on y=x
    replaceNW(0,tocopy); // move NW and mirror on y=-x
}

function halfthesize(tocopy) {
    for (let i=0;i<tocopy;i++) {
        points[i].mult(0.5);
    }
}

function copytori(r,tocopy) {
    let ri = richt[r].copy().mult(size);
    for (let i=0;i<tocopy;i++) {
        let v = points[i].copy().add(ri);
        if (r==3) {
            let h = v.x;
            v.x = v.y;
            v.y = h;
        }
        points.push(v);
    }
}

function replaceNW(r,tocopy) {
    let ri = richt[r].copy().mult(size);
    for (let i=0;i<tocopy;i++) {
        points[i].add(ri);
        let h = points[i].x 
        points[i].x = -points[i].y;
        points[i].y = -h;
    }
}

// draw the picture on its way from generation n-1 (p==0) to n (p==1)
function myDraw(t,duration) {
    let p = t/duration;
    let g = (1-p)*100
    
    for (let i=1;i<points.length;i++) {
        let f = (i/points.length)*100
        stroke(g,f,100);
        let v11 = points[i-1]; 
        let v12 = points[i];
        let v21 = points2[i-1]
        let v22 = points2[i]
        let v1 = p5.Vector.add(v11.copy().mult(p),v21.copy().mult(1-p));
        let v2 = p5.Vector.add(v12.copy().mult(p),v22.copy().mult(1-p));
        line(v1.x,cy(v1.y),v2.x,cy(v2.y)); // the moving line
    }
}

// draw the demo picture as above but with more points and lines
function drawDemo(t,duration) {
    push();
    translate(3*width/4,height/2);
    strokeWeight(1);
    let p = t/(duration);
    let g = (1-p)*100;
    stroke(40);
    // the first point of generation n and n-1
    let v1 = points3[0].copy();
    circle(v1.x,cy(v1.y),2)
    let v2 = points4[0].copy();
    circle(v2.x,cy(v2.y),2)
    line(v1.x,cy(v1.y),v2.x,cy(v2.y)); // line gen n to gen n-1 for the first point
    drawarrow(v1,v2);
    // the first point of the moving line
    v1.mult(p).add(v2.mult(1-p));
    stroke(255);
    circle(v1.x,cy(v1.y),2) // first point of the moving line
    for (let i=1;i<points3.length;i++) {
        // the 2 generations
        stroke(40)
        let v11 = points3[i-1]; 
        let v12 = points3[i];
        line(v11.x,cy(v11.y),v12.x,cy(v12.y)) // line generation n-1
        circle(v12.x,cy(v12.y),2)
        let v21 = points4[i-1]
        let v22 = points4[i]
        line(v21.x,cy(v21.y),v22.x,cy(v22.y)) // line generation n
        circle(v22.x,cy(v22.y),2)
        line(v12.x,cy(v12.y),v22.x,cy(v22.y)); // line gen n to gen n-1
        drawarrow(v12,v22);
        // the line in between
        v1 = p5.Vector.add(v11.copy().mult(p),v21.copy().mult(1-p));
        v2 = p5.Vector.add(v12.copy().mult(p),v22.copy().mult(1-p));
        stroke(255);
        line(v1.x,cy(v1.y),v2.x,cy(v2.y)); // the moving line
        circle(v2.x,cy(v2.y),2)
    }
    pop();
}

function drawarrow(p1,p2) {
    push()
    angleMode(DEGREES)
    let pm = p5.Vector.add(cp(p1),cp(p2)).mult(0.5);
    let ph = p5.Vector.sub(cp(p2),cp(p1));
    let alpha = ph.heading();
    translate(pm.x,pm.y)
    rotate(alpha)
    line(0,0,10,4)
    line(0,0,10,-4)
    pop()
}

function draw() {

    clear();
    background(0);
    noStroke()
    fill(255)
    text(detail+1,width*0.5,height/2);
    drawDemo(min(t,duration),duration);

    translate(width/4,height/2)
    
    myDraw(min(t,duration),duration);
    t++

    if (t>(duration+waitingtime)) {
        detail++
        if (detail>maxdetail) {
            noLoop();
            return;
        }
        t = 0;
        enlarge(); // verviervoudig tabel points naar points2.
        dostep()
    }

}