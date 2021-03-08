let blokkenstrings = "";
function preload() {
    blokkenstrings = loadStrings("blok.txt")
}
let backclr = "#773377";
let cols = 6;
let rows = 6;

let blokken = 
	[
		{x:2,y:2,w:3,h:1},
		{x:2,y:3,w:1,h:3}
	]

let config  = {gat:{c:cols,r:2}};
let blokselect = null;
let displ = null;

//
// PRESENTATION
//

//Called when application is started.
function setup()
{
	createCanvas(500,500);
	background(backclr);

	config = loadini();
	blokken = config.blokken	
	wriggleSpace(blokken);

	showPlay(blokken);
	frameRate(10);
}

function showPlay(blk) {
	drawBorder()
	drawgat();
	strokeWeight(1);
	textSize(16);
	for (let i in blk) {
		showBlok(blk,i);
	}
} // showPlay

function drawBorder() {
	stroke( "white" );
	strokeWeight(2);
	fill(backclr);
    rectMode(CORNERS)
	rect(0.01*width,0.01*height,0.99*width,0.99*height);
}

function drawgat() {
    let gat = config.gat;
    strokeWeight(5);
	stroke(backclr)
    line(cx(gat.c),cy(gat.r),cx(gat.c+gat.wi),cy(gat.r+gat.he));
} // drawGat

function showBlok(blk,ind,clear=false,displ=null) {
    let b = blk[ind];
	if (clear) {
	    fill( backclr );
	} else if (ind==0) {
	    fill( "black" );
	} else {
	    fill( "#00FF00" );
	}
	let rx = 0.02;
	let ry = 0.02;
	let dx = 0;
	let dy = 0;
	if (displ) {
        dx = (displ.posc.x-displ.poso.x);
        dy = (displ.posc.y-displ.poso.y);
	}
	rect(
	    cx(b.x+rx)+dx,cy(b.y+ry)+dy,
		cx(b.x+b.w-rx)+dx,cy(b.y+b.h-ry)+dy );
	let tx = (cx(b.x+rx)+dx+cx(b.x+b.w-rx)+dx)/2;
	let ty = (cy(b.y+ry)+dy+cy(b.y+b.h-ry)+dy)/2;
	fill("black")
	if (ind==0) fill("white")
	textAlign(CENTER,CENTER);
	text(ind,tx,ty)
}
/*
function draw() {
	if (displ) return;
	clear();
	background(backclr);
	showPlay(blokken);
}
*/
//
// CALCULATION
//
function wriggleSpace(blk) { 
	for (let i in blk) { 
		let b = blk[i]
		if (b.w==1) { // wriggle y
			b.xmin = b.x;
			b.xmax = b.x;
			b.ymin = b.y-1;
      while (b.ymin>=0 && [-1,i].includes(getBlokInd(blk,b.x,b.ymin))) b.ymin--;
			b.ymin++;
			b.ymax = b.y+b.h;
            while (b.ymax<rows && [-1,i].includes(getBlokInd(blk,b.x,b.ymax))) b.ymax++;
			b.ymax = b.ymax-b.h;
		} else { // wriggle x
			b.ymin = b.y;
			b.ymax = b.y;
			b.xmin = b.x-1;
      while (b.xmin>=0 && [-1,i].includes(getBlokInd(blk,b.xmin,b.y))) b.xmin--;
			b.xmin++; 
			b.xmax = b.x+b.w; 
       while (b.xmax<cols && [-1,i].includes(getBlokInd(blk,b.xmax,b.y))) b.xmax++;
			b.xmax = b.xmax-b.w;
		}
	} 
}

//
// DATABASE
//
function getBlokInd(blks,x,y) {
    let i = blks.findIndex(b=>x>=b.x && x<b.x+b.w && y>=b.y && y<b.y+b.h);
    if (i<0) i=-1;
    return i
}
	
function loadini() {  
//    let s = app.ReadFile("blok.txt");
//    let sa = blokkenstrings.split("\n");
    let gat = blokkenstrings[0].split(",").map(e=>Number(e));
    let gatobj = {c:gat[0],r:gat[1],wi:gat[2],he:gat[3]};
    let config = {gat:gatobj}
    blokkenstrings.splice(0,1);
    let ba = blokkenstrings.map(r=>{
        let ra = r.split(",");
        return {x:Number(ra[0]),y:Number(ra[1]),w:Number(ra[2]),h:Number(ra[3])};
    });
    config.blokken = ba;
    return config;
} // loadini

//
// MOVEMENT
//
function mousePressed() {
    displ = {poso:{x:mouseX,y:mouseY},posc:{x:mouseX,y:mouseY}}; // the mouseposition
    let ind = getBlokInd(blokken,Math.floor(rcx(mouseX)),Math.floor(rcy(mouseY)));
    blokselect = {blks:blokken,ind,b:ind>=0?blokken[ind]:null};  
    if (ind>=0) { 
		let b = blokselect.b; 
		let xMouseBaseScherm = cx(b.x) - displ.poso.x; // xLeftTopScherm - ....
		let yMouseBaseScherm = cx(b.y) - displ.poso.y; // yLeftTopScherm - .....
		displ.xminMuisScherm = cx(b.xmin) - xMouseBaseScherm; // x ondergrens
		displ.yminMuisScherm = cy(b.ymin) - yMouseBaseScherm; // x
		displ.xmaxMuisScherm = cx(b.xmax) - xMouseBaseScherm; // x bovengrens
		displ.ymaxMuisScherm = cy(b.ymax) - yMouseBaseScherm; // x
	} 
}

function mouseDragged() {
    if (blokselect && blokselect.ind>=0) {
        let x = Math.max(Math.min(mouseX,displ.xmaxMuisScherm),displ.xminMuisScherm);
        let y = Math.max(Math.min(mouseY,displ.ymaxMuisScherm),displ.yminMuisScherm);
        if (displ.posc.x==x && displ.posc.y==y) return;   
        showBlok(blokselect.blks,blokselect.ind,true,displ); // wegvegen
        displ.posc.x = x;
        displ.posc.y = y;
        showBlok(blokselect.blks,blokselect.ind,false,displ); // opnieuw tekenen
    }
}

function mouseReleased() {
    if (blokselect && blokselect.ind>=0) {
		showBlok(blokselect.blks,blokselect.ind,true,displ)
		let ind = blokselect.ind;
		let b = blokselect.blks[ind];
		b.x = Math.floor(rcx(cx(b.x)+displ.posc.x-displ.poso.x)+0.5);
		b.y = Math.floor(rcy(cy(b.y)+displ.posc.y-displ.poso.y)+0.5);
		wriggleSpace(blokselect.blks)
		showBlok(blokselect.blks,ind);
		blokselect = null;
		displ = null;
    }
}

// scherm naar spel
function cx(x) {
	return (0.01 + x*0.98/cols)*width;
}
// spel naaar scherm
function rcx(x) {
    return (x/width-0.01)*cols/0.98;    
}
// spel naaar scherm
function cy(y) {
		return (0.01 + y*0.98/rows)*height;
}
// scherm naar spel
function rcy(y) {
    return (y/height-0.01)*rows/0.98;    
}
