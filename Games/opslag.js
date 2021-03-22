function getBlokInd(blks,x,y) {
    let i = blks.findIndex((b,ind)=>x>=b.x && x<b.x+sizes[ind].w && 
									y>=b.y && y<b.y+sizes[ind].h);
    if (i<0) i=-1;
    return i
}

let detKey = function(blks) {
    return blks.map((e,ind)=>{
//        return `${ind},${e.x},${e.y}`;
        return `${e.x},${e.y}`;
    }).join("|");
}

function keyToBlok(key) {
    return key.split("|").map(xy=>{
        let arr = xy.split(",");
        return {x:Number(arr[0]),y:Number(arr[1])};
    })
} 

function BlokSetIntoMem(bltable,bs,key) {
    bltable[key] = 1;//deepArrayCopy(bs);
}

function getBlokSetFromMem(bltable,key) {
    return keyToBlok(key); //bltable[key];
}

function isKeyinMem(bltable,key) {
    return key in bltable;
}

function deepArrayCopy(ao) {
    return ao.map(b=>deepCopy(b));
}
function deepCopy(blks) {
    let r = {};
    for (let [k,v] of Object.entries(blks)) {
        r[k] = v;
    }
    return r;
}

