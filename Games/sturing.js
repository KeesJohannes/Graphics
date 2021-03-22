//Called when application is started.
function setup()
{
	bfindexes = Object.keys(blokfiles)
	cbfindex = 0;

	let deltaY = 40;
	let offsetY = 0;

	let cnv = createCanvas(500,500);
	cnv.mousePressed(doMousePressed);

	let selprev = createButton("prev")
	selprev.position(width+10,offsetY)
	selprev.touchStarted(()=>SetGame(selgame,cbfindex-1))
	selprev.mouseClicked(()=>SetGame(selgame,cbfindex-1))
	
	selgame = createSelect();
  	selgame.position(width+selprev.size().width+20, offsetY);
	for (let i=0;i<bfindexes.length;i++) { // de attributen en hun waardes worden gcopieerd.
		selgame.option(`game ${blokfiles[bfindexes[i]].game}`)
	} // de namen van de geladen games.
	selgame.selected(`game ${blokfiles[bfindexes[0]].game}`); //voorstel tot wijziging: apart attr dat de default aanwijst.
  	selgame.changed(()=>selectGame(true));
	
	let selnxt = createButton("next")
	selnxt.position(width+selprev.size().width+20+selgame.size().width+10,offsetY);
	selnxt.touchStarted(()=>SetGame(selgame,cbfindex+1));
	selnxt.mouseClicked(()=>SetGame(selgame,cbfindex+1));
	
	txtresult = createDiv(`Number of manual moves: ${aantalmoves}`);
	txtresult.position(width+10,1*deltaY + offsetY);
	
	let but1 = createButton("Refresh")
	but1.position(width+10,2*deltaY + offsetY);
	but1.touchStarted(()=>opnieuw()); //opnieuw: als een refresh van de pagina
	but1.mouseClicked(()=>opnieuw())

	let but2 = createButton("Calculate a solution")
	but2.position(width+10,3*deltaY + offsetY);
	but2.touchStarted(()=>genpath());
	but2.mouseClicked(()=>genpath());

	txt = createP(txtstr); // plek voor logging
	txt.position(width+10,4*deltaY + offsetY);
	txt.addClass("txt1");
	
	background(backclr);
	selectGame(); // doet ook de initialisatie 
	frameRate(20);

}

function SetGame(sg,gind) {
	cbfindex = Math.max(Math.min(bfindexes.length-1,gind),0);
	sg.selected(`game ${blokfiles[bfindexes[cbfindex]].game}`);
	selectGame();
}

function opnieuw() {
	blokken = config.blokken.map(b=>deepCopy(b));
	sizes = config.sizes;
	blokselect = null;
	displ = null; // de displacement van een bewegend blok.
	zwartweg = false; // wanneer het zwarte blok het spel moet overlaten.
	aantalmoves = 0; // telt het totaal aantal moves.
	txtstr = "Moves:<br>"
	txt.elt.innerHTML = txtstr;
	wriggleSpace(blokken);		
	showPlay(blokken);
	txtresult.elt.innerHTML = `Number of manual moves: ${aantalmoves}`;
	initCalc()
	loop();
}

function initCalc() {
	calc = false;
	clicked = false;
	calccounter = -2;
	calcobject = null;
	calcstatus = -1;
	calcresult = null;
}

//
// de draw routine moet de volgende statussen vewerken:
// blokmove => return
// calc => aantal stappen uitrekenen en tonen.
// !calc => toon de balken. Ventueel opgeschoven..
//
// de genpath routine moet het uitrekenen en tonen van de route velden ondersteunen.

function draw() {
	if (blokmove) return;
	if (calc) {
		frameRate(3);
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
				frameRate(20);
			} else {
				txt.elt.innerHTML = 
					`Aantal nieuwe configuraties na ${calcresult.value[1]} ` +
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
						calc = false;
						calcstatus = 0
						}
				} else {
					calc = false;
					calcstatus = 0
				}
			}
		}
	} else {
		frameRate(20);
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

function selectGame(setind = false) {
	let g = selgame.value();
	let gnbr = g.slice(4).trim();
	config = loadini(gnbr,setind);
	blokken = config.blokken;
	sizes = config.sizes;
	opnieuw();
}
	
function loadini(gi,setind=false) {  
	let indx = bfindexes.findIndex(r=>blokfiles[r].game==gi)
	if (setind) {
		cbfindex = indx;
	}
	conf = blokfiles[bfindexes[indx]]
	let gat = conf.gate;
    let gatobj = {c:gat[0],r:gat[1],wi:gat[2],he:gat[3]};
    let config = {gat:gatobj}
    config.blokken = conf.bloks.map(r=>{return {x:r.x,y:r.y}});
	config.sizes = conf.bloks.map(r=>{return {w:r.w,h:r.h}});
    return config;
} // loadini



