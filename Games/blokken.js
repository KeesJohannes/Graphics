let blokkenstrings = "";
let blokfiles = [];
function preload() {
	// [{game:identstring,gate:[x,y,w,h],bloks:[{x,y,w,h},...},...]
	blokfiles = loadJSON("blokfiles.json")
}
let backclr = "#773377";
let cols = 6;
let rows = 6;

// [{x,y},{x,y},....]
let blokken = [] // de posities van de blokken (x,y)
// [{w,h},{w,h},....]	
let sizes = []; // de grootte van de blokken (width en height)

let config  = {game:"str",gat:{c:cols,r:2}}; // ??
let blokselect = null;
let displ = null; // de displacement van een bewegend blok.
let zwartweg = false; // wanneer het zwarte blok het spel moet overlaten.
let aantalmoves = 0; // telt het totaal aantal moves.
let selgame; // adres create select 
let txtresult; // voor eenvoudige 1 regelige opmerkingen
let txt; // voor tekstdelen met verschillende regels
let txtstr = "Moves:<br>"
//
// PRESENTATION
//

//Called when application is started.
function setup()
{
	let cnv = createCanvas(500,500);
	cnv.mousePressed(doMousePressed);

	selgame = createSelect();
  	selgame.position(width+10, 0);
	let bfa = Object.keys(blokfiles);
	for (let i=0;i<bfa.length;i++) { // de attributen en hun waardes worden gcopieerd.
		selgame.option(`game ${blokfiles[bfa[i]].game}`)
	} // de namen van de geladen games.
	selgame.selected("game 1"); //voorstel tot wijziging: apart attr dat de default aanwijst.
  	selgame.changed(selectGame);
	
	txtresult = createP(`Number of moves: ${aantalmoves}`);
	txtresult.position(width+10,50)
	
	but1 = createButton("Refresh")
	but1.position(width+10,100);
	but1.touchStarted(()=>opnieuw()); //opnieuw: als een refresh van de pagina
	but1.mouseClicked(()=>opnieuw())

	but2 = createButton("Calculate a solution")
	but2.position(width+10,130);
	but2.mouseClicked(()=>genpath());
	but2.mouseReleased(()=>genpath())

	txt = createP(txtstr); // plek voor logging
	txt.position(width+10,150)
	
	background(backclr);
	selectGame(); // doet ook de initialisatie 
	frameRate(20);
}

function opnieuw() {
	blokken = [];
	sizes = [];
	blokselect = null;
	displ = null; // de displacement van een bewegend blok.
	zwartweg = false; // wanneer het zwarte blok het spel moet overlaten.
	aantalmoves = 0; // telt het totaal aantal moves.
	txtstr = "Moves:<br>"
	displ = null;
	zwartweg = false;
	aantalmoves = 0;
	txtstr = "Moves:<br>";
	txt.elt.innerHTML = txtstr;
	blokken = config.blokken.map(b=>deepCopy(b));
	sizes = config.sizes;
	wriggleSpace(blokken);		
	showPlay(blokken);
	txtresult.elt.innerHTML = `Number of moves: ${aantalmoves}`;
	initCalc()
	loop();
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
	let s = sizes[ind];
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
		cx(b.x+s.w-rx)+dx,cy(b.y+s.h-ry)+dy );
	let tx = (cx(b.x+rx)+dx+cx(b.x+s.w-rx)+dx)/2;
	let ty = (cy(b.y+ry)+dy+cy(b.y+s.h-ry)+dy)/2;
	fill("black")
	if (ind==0) fill("white")
	textAlign(CENTER,CENTER);
	text(ind,tx,ty)
}

function genpath() {
	if (!calc) {
		calcstatus = 0;
		calc = true; // hierdoor wordt in draw het pad berekend.
	} else if (calcstatus==2) {
		clicked = true; // hierdoor wordt de volgende stap in draw getoond
	}
}
//
// de draw routine moet de volgende statussen vewerken:
// displ => return
// calc => aantal stappen uitrekenen en tonen.
// !calc => toon de balken. Ventueel opgeschoven..
//
// de genpath routine moet het uitrekenen en tonen van de route velden ondersteunen.
//
function initCalc() {
	calc = false;
	clicked = false;
	calccounter = -2;
	calcobject = null;
	calcstatus = -1;
	calcresult = null;
//	blokkencopy = [];
}
/*
let calc = false;
clicked = false;
let calccounter = -2;
calcobject = null;
calcstatus = -1;
calcresult = null;
blokkencopy = [];
*/
function draw() {
	if (displ) 	{return;}
	if (calc) {
		// aantal stappen uitrekenen en tonen
		if (calcstatus==0) { // uitrekenen
			calcobject = calcpath(blokken);
			calcstatus = 1;
			txt.elt.innerHTML = `Laat mij even nadenken....`
			calcresult = calcobject.next()
		} else if (calcstatus==1) { // opvragen gegevens
			if (calcresult.done) {
				txt.elt.innerHTML = 
					`Een pad gevonden na ${ret_value.length} stappen.`
				//calc = false;
				calcstatus = 2; // het presenteren van de gegevens
				point = 0;
/*				blokkencopy = blokken.map(b=>{
					let r = {};
					for (let [k,v] of Object.entries(b)) {
						r[k] = v;
					}
					return r;			
				});
*/			} else {
				txt.elt.innerHTML = 
					`Aantal configuraties na ${calcresult.value[1]} ` +
					`steppen is ${calcresult.value[0]}`;
				calcresult = calcobject.next();
			}
		} else if (calcstatus==2) { // het presenteren van de gegevens
			if (clicked) {
				clicked = false;
				if (point<ret_value.length) {
					let nblk = ret_value[point++];
					let old = {x:blokken[nblk[0]].x,y:blokken[nblk[0]].y};
					let nieuw = {x:nblk[1],y:nblk[2]};
					blokken[nblk[0]].x = nblk[1];
					blokken[nblk[0]].y = nblk[2];
					updatelist(point,nblk[0],nieuw.x,nieuw.y,old)
					showPlay(blokken);
					if (blokken[0].x==4 && blokken[0].y==2) {
						zwartweg  = true;
						print("zw",zwartweg)
						calc = false;
						calcstatus = 0
						}
				} else {
					calc = false;
					calcstatus = 0
					//blokken = blokkencopy;
				}
			}
		}
	} else {
		clear(); 
		background(backclr);
		if (zwartweg) {
			let b = blokken[0];
			b.x += 0.1;
			if (b.x>cols+1) {
				noLoop();
			}
		}
		showPlay(blokken);
	}
}

//
// CALCULATION
//
function wriggleSpace(blk) { 
	for (let i in blk) { 
		let b = blk[i]
		let s = sizes[i];
		if (s.w==1) { // wriggle y
			b.xmin = b.x;
			b.xmax = b.x;
			b.ymin = b.y-1;
			while (b.ymin>=0 && [-1,i].includes(getBlokInd(blk,b.x,b.ymin))) b.ymin--;
			b.ymin++;
			b.ymax = b.y+s.h;
            while (b.ymax<rows && [-1,i].includes(getBlokInd(blk,b.x,b.ymax))) b.ymax++;
			b.ymax = b.ymax-s.h;
		} else { // wriggle x
			b.ymin = b.y;
			b.ymax = b.y;
			b.xmin = b.x-1;
    		while (b.xmin>=0 && [-1,i].includes(getBlokInd(blk,b.xmin,b.y))) b.xmin--;
			b.xmin++; 
			b.xmax = b.x+s.w; 
    		while (b.xmax<cols && [-1,i].includes(getBlokInd(blk,b.xmax,b.y))) b.xmax++;
			b.xmax = b.xmax-s.w;
		}
	} 
}

//
// DATABASE
//
function getBlokInd(blks,x,y) {
    let i = blks.findIndex((b,ind)=>x>=b.x && x<b.x+sizes[ind].w && 
									y>=b.y && y<b.y+sizes[ind].h);
    if (i<0) i=-1;
    return i
}

function selectGame() {
	let g = selgame.value();
	let gnbr = g.slice(4).trim();
	config = loadini(gnbr);
	blokken = config.blokken;
	sizes = config.sizes;
	opnieuw();
}
	
function loadini(gi) {  
	let conf = Object.values(blokfiles).find(r=>r.game==gi)
	let gat = conf.gate;
    let gatobj = {c:gat[0],r:gat[1],wi:gat[2],he:gat[3]};
    let config = {gat:gatobj}
    config.blokken = conf.bloks.map(r=>{return {x:r.x,y:r.y}});
	config.sizes = conf.bloks.map(r=>{return {w:r.w,h:r.h}});
    return config;
} // loadini

//
// MOVEMENT
//
function touchStarted() {
	print("mousePressed")
	doMousePressed();
	return false;
}

function doMousePressed() {
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
	return false;
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
	return false;
}

function updatelist(seq, ind,bnx,bny,b) {
	let txtri;
	let txtva;
	if (bnx==b.x) {
		txtri = (bny<b.y)?"U":"D"
		txtva = Math.abs(bny-b.y)
	} else {
		txtri = (bnx<b.x)?"L":"R"
		txtva = Math.abs(bnx-b.x)
	}
	txtstr +=`${seq}-${ind}:${txtri}${txtva}<br>`
	txt.elt.innerHTML = txtstr; 
}

function mouseReleased() {
    if (blokselect && blokselect.ind>=0) {
		showBlok(blokselect.blks,blokselect.ind,true,displ)
		let ind = blokselect.ind;
		let b = blokselect.blks[ind];
		let bnx = Math.floor(rcx(cx(b.x)+displ.posc.x-displ.poso.x)+0.5);
		let bny = Math.floor(rcy(cy(b.y)+displ.posc.y-displ.poso.y)+0.5);
		if (!(b.x==bnx && b.y==bny)) {
			aantalmoves++
			txtresult.elt.innerHTML = `Number of moves: ${aantalmoves}`
			updatelist(aantalmoves,ind,bnx,bny,b);
		}
		b.x = Math.floor(rcx(cx(b.x)+displ.posc.x-displ.poso.x)+0.5);
		b.y = Math.floor(rcy(cy(b.y)+displ.posc.y-displ.poso.y)+0.5);
		wriggleSpace(blokselect.blks)
		showBlok(blokselect.blks,ind);
		blokselect = null;
		displ = null;
		if (ind==0) {
			if (b.x+sizes[ind].w==cols) {
				zwartweg = true;			
			}
		}
    }
	return false;
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
