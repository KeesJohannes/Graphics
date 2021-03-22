let ret_value = [];
let point  = -2;

// Claculate de configuratie die blok 0 naar de uitgang brengen.
// Bepaal alle configuraties die met een afstand N van de oorsprong 
// te beereiken zijn. 
// N loopt van 0 tot zover het nodig is.
// N+1 is te bepalen vanuit de confguraties met afstand N, 
// doe1 sta naar ee nog niet bereikte confiiguratie.
// De sartpositie heeft value 0.
// 
// De berekening wordt aaangestuurd vanuit de routine draw(). Bij elk frame, 
// wordt de volenede N beaalt.
//  
// Bepaal de stuur variablen bij de start van de routine.
function genpath() {
	 
	if (!calc) {
		calcstatus = 0;
		calc = true; // hierdoor wordt in draw het pad berekend.
	} else if (calcstatus==2) {
		clicked = true; // hierdoor wordt de volgende stap in draw getoond
	}
}

function* calcpath(bs) {

    let bltable = [];

    let detChildren = function(bs) {
        let ret = [];
        bs.forEach((bl,ind)=>{
            if (sizes[ind].w==1) { // vertikaal blok
                let y = bl.y-1;
                while (y>=0 && !inBlok(bs,bl.x,y)) {
                    ret.push([ind,bl.x,y]);
                    y--;
                }
                y = bl.y+sizes[ind].h;
                while (y<rows && !inBlok(bs,bl.x,y)) {  
                    ret.push([ind,bl.x,y-sizes[ind].h+1])
                    y++;
                }
            } else { // horizontaal blok
                let x = bl.x-1;
                while (x>=0 && !inBlok(bs,x,bl.y)) {
                    ret.push([ind,x,bl.y]);
                    x--;
                }
                x = bl.x+sizes[ind].w;
                while (x<cols && !inBlok(bs,x,bl.y)) {
                    ret.push([ind,x-sizes[ind].w+1,bl.y])
                    x++;
                } 
            } 
        }); // forEach
        return ret;
    }

    function inBlok(bs,x,y)  {
        return bs.some((bl,ind)=>
                x>=bl.x&&x<bl.x+sizes[ind].w&&
                y>=bl.y&&y<bl.y+sizes[ind].h);
    }

    function genKeyList(bs) {
        return {key:detKey(bs),children:[],parent:null,step:0,moves:null};
    } 

    let ret = [];

    //let foundlist = null;
    //let foundnbs = null;
    let cstack = []; // de lijst van current step configuratioens
    let stack = []; // de lijst van current+1 stepconfigurations
    //let allstack = [] // de lijst van alle step 0 to current+1 configurations.
 
    // bij elke step verhoging worden de configurations bepaals die door s steps van 
    // de start config af liggen. De root heeft step 0.
    // init van de tabellen: 
    let root = genKeyList(bs); // de genKeyList verbindt de kinderen aan de parents,
                                // tevens bewaard hij de stepnummer en de link met de balkenset                            
    BlokSetIntoMem(bltable,bs,root.key);

    stack = [root]; // de loop begint met de in de vorige lus bepaalde confiigs
                        // over te  nemen naar de werkstack 
    let found = false;
    ret_value = [];
    let stepmax = -1;
    let stepcount = 0
    while (stack.length>0 && !found) { // de stack bevat de keylists van de bloksets
        yield [stack.length,stepcount]
        stepcount++;
        cstack = stack; // overnemen naar de werkstack.
        stack = []; 

        while (cstack.length>0 && !found) {
            let current = cstack.pop();
            if (true/*!(isKeyinMem(current.key))*/) { // alleen verwerken als nog niet gedaan
                // bepaal de kinderen
                // de gehele list van mogelijke wijzigingen
                let changelist = detChildren(getBlokSetFromMem(bltable,current.key)); 
                changelist.forEach(chl=>{ // chl bevat array: [bs index, niuewe c, nieuwe y]
                    if (found) return;
                    let ind = chl[0];
                    let nx = chl[1];
                    let ny = chl[2]; 
                    let nbs = deepArrayCopy(getBlokSetFromMem(bltable,current.key));
                    let oldxy = [ind,nbs[ind].x,nbs[ind].y];
                    nbs[ind].x = nx;
                    nbs[ind].y = ny;
                    // nbs bevat nu de nieuw balkset
                    let nkeylist = genKeyList(nbs); // de keylist van de balkset 
                    if (!(isKeyinMem(bltable,nkeylist.key))) { // alleen als nog niet in de db
                        nkeylist.step = current.step+1;
                        stepmax = nkeylist.step;
                        nkeylist.moves = [ind,nx,ny];
                        nkeylist.parent = current; // leg de vader/zoon relatie vast.
                        current.children.push(nkeylist);
                        BlokSetIntoMem(bltable,nbs,nkeylist.key);      
                        stack.push(nkeylist); // de volgende step lijst.
                        found = (nbs[0].x==4&&nbs[0].y==2)
                        if (found) {
                            let h = nkeylist;
                            while (h && h.moves) {
                                ret_value.push(h.moves)
                                h = h.parent;
                            }
                        }
                    } 
                }); 
            } 
        }  
    }
    ret_value = ret_value.reverse();
    //print("found:",found, stepmax)//, foundlist); 
    return found;
}
