let blokkenstrings = "";
let blokfiles = [];
let bfIndexes = [];
let cbfindex = 0;
function preload() {
	// [{game:identstring,gate:[x,y,w,h],bloks:[{x,y,w,h},...},...]
	blokfiles = loadJSON("blokfiles.json");
}
let backclr = "#773377";
let cols = 6;
let rows = 6;

// [{x,y},{x,y},....]
let blokken = [] // de posities van de blokken (x,y)
// [{w,h},{w,h},....]	
let sizes = []; // de grootte van de blokken (width en height)

let config  = {game:"str",nbr:0,gat:{c:cols,r:2}}; // ??
let blokmove = false;
let blokselect = null;
let displ = null; // de displacement van een bewegend blok.
let zwartweg = false; // wanneer het zwarte blok het spel moet overlaten.
let aantalmoves = 0; // telt het totaal aantal moves.
let selgame; // adres create select 
let txtresult; // voor eenvoudige 1 regelige opmerkingen
let txt; // voor tekstdelen met verschillende regels
let txtstr = "Moves:<br>"

// bepaalt de ruimte die elk blok heeft om te schuiven. 
// Er worden xmin, xmx, ymin en ymax velden in de blokrecords geschreven. 
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

