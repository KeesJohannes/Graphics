// laat de blokken zien inclusief de rand en heet gat.
function showPlay(blk) {
	drawBorder()
	drawgat();
	strokeWeight(1);
	textSize(16);
	for (let i in blk) {
		showBlok(blk,i);
	}
} // showPlay

// laat de rand zien door het vierkant te vullen met kkleur grijs
function drawBorder() {
	stroke( "white" );
	strokeWeight(2);
	fill(backclr);
    rectMode(CORNERS)
	rect(0.01*width,0.01*height,0.99*width,0.99*height);
}
// teken het gat waar blok 0 door moet intsnappen. 
function drawgat() {
    let gat = config.gat;
    strokeWeight(5);
	stroke(backclr)
    line(cx(gat.c),cy(gat.r),cx(gat.c+gat.wi),cy(gat.r+gat.he));
} // drawGat

// laat het bkokz zien.
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

function touchStarted() {
	doMousePressed();
	return false;
}

function doMousePressed() {
	blokmove = true;
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
			txtresult.elt.innerHTML = `Number of manual moves: ${aantalmoves}`
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
	blokmove = false;
	return false;
}

// Eenheidsconversie

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
