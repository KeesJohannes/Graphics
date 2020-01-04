let dbs = 
"5,5 7 "+
"0,0,0 "+ 
"1,2,1 "+
"2,4,0 "+
"3,0,2 "+
"4,4,2 "+
"5,1,4 "+
"6,3,4 "+
"0,1,7 "+
"0,3,3 "+
"1,2,8 "+
"1,3,4 "+
"1,4,7 "+
"2,4,8 "+
"1,5,5 "+
"3,5,6 "+
"4,5,4 "+
"4,6,9 "+
"5,6,11"

function ReadData(dbs) {
    let sa = dbs.split(" ");
    let stat = 0;
    let nodes = [];
    let edges = [];
    let id;
    let aantal;
    //let rows, cols;
    for (let i=0;i<sa.length;i++) {
        let s = sa[i];
        let fa = s.split(",")
        for (let j=0;j<fa.length;j++) fa[j] = Number(fa[j]);
        if (s.trim().length>0) {
            if (stat==0) {
                let rows = fa[0];
                let cols = fa[1];
                stat = 1;
            } else if (stat==1) {
                aantal = fa[0];
                stat = 2;
            } else if (stat==2) {
                if (aantal>0) {
                    id = fa[0];
                    nodes[id] = {id,col:fa[1],row:fa[2]}
                    aantal--;
                    if (aantal==0) stat = 3;
                } 
            } else if (stat==3) {
                edges[edges.length] = {id:edges.length,id1:fa[0],id2:fa[1],cost:fa[2]};
            }
        }
    }
    return [nodes,edges]
}

function fixRandBetween(a,b) {
    return Math.floor(Math.random()*(b-a))+a;
}

// greatest common divisor
function gcd(a,b) {
    let a1 = Math.floor(Math.abs(a));
    let b1 = Math.floor(Math.abs(b));
    if (a1==0) return b1
    if (b1==0) return a1;
    if (a1>b1) {
        a1 = a1%b1
        if (a1==0) return b1
    } else if (a1<b1) {
        b1 = b1%a1;
        if (b1==0) return a1;
    } else return a1;
    return gcd(a1,b1);
}

function IsVisible(sc,sr,dc,dr,cols,rows,nodes) {
    let f = gcd(dc,dr)
    let ddc = dc/f;
    let ddr = dr/f;
    for (let lr=1;lr<=f;lr++) {
        let oc = ddc*lr+sc
        let or = ddr*lr+sr
        if (oc<0 || oc>=cols || or<0 || or>=rows) return -1;
        let ind = nodes.findIndex(n=>n.row==or && n.col==oc);
        if (ind>=0) { // node gevonden.
            return lr==f?ind:-1; // gevonden op de gezochte plaats;
        }
    }
    return -1; // geen node gevonden
}

function GenNw() {
    let edges = [];
    let rows = 5;
    let cols = 5;
    let aantal = fixRandBetween(5,10); // aantal te genereren nodes
    let nodes = new Array(aantal);
    let htel = new Array(rows*cols);
    for (let i=0;i<htel.length;i++) {
        htel[i]=i; // houdt bij welke cellen nog vrij zijn.
    }
    // genereer de nodes
    for (let i=0;i<aantal;i++) {
        let w = fixRandBetween(0,htel.length);
        let cel = htel[w];
        nodes[i] = {id:i,col:cel%cols,row:Math.floor(cel/cols),mst:0};
        htel.splice(w,1)
    }
    // genereer deedges. Eerst de edges bepalen die niet door nodes lopen. 
    let h_edges = []; // bevat straks alle mogelijke edges.
    nodes.forEach(no=>{
        let id1 = no.id;
        for (let dc=-cols+1;dc<cols;dc++) {
            for (let dr=-rows+1;dr<rows;dr++) {
                if (!(dc==0 && dr==0)) {
                    let ind = IsVisible(no.col,no.row,dc,dr,cols,rows,nodes); // is de node bereikbaar
                    if (ind>=0) { // ja
                        let ind2 = h_edges.findIndex(e=>(e.id1==id1 && e.id2==ind) ||
                            (e.id1==ind && e.id2==id1));
                        if (ind2<0) { // nog geen edge tussen de nodes id1 en ind
                            id = h_edges.length;
                            h_edges[id] = {id,id1,id2:nodes[ind].id,mst:false,cost:fixRandBetween(1,10)}
                        }
                    }
                }
            }
        }
    })
//    console.log("h_e",h_edges.length)
    // selecteer de edges die een spanning tree opleveren. de set s houdt bij welke nodes nog
    // nieet in de mst zitten
    let s = new Set();
    nodes.forEach(n=>s.add(n.id));
    let n = nodes[0];
    s.delete(n.id);
    while (s.size>0) {
        let n_edges = h_edges.filter(e=>(s.has(e.id1) && !s.has(e.id2)) || 
                                        (s.has(e.id2) && !s.has(e.id1)));
        if (n_edges.length==0) {
            console.log("klopt niet",s,h_edges[0].id2,s.has(h_edges[0].id2))
            return;
        }
        let nedg = fixRandBetween(0,n_edges.length);
        let ed = n_edges[nedg];
        ed.mst = true;
        s.delete(ed.id1);
        s.delete(ed.id2);
    }
    n_edges = h_edges.filter(e=>!e.mst)
    aantal = 2; // 2 additionele edges (wanneer mogelijk)
    while (n_edges.length>0 && aantal>0) {
        let nedg = fixRandBetween(0,n_edges.length);
        let ed = n_edges[nedg];
        ed.mst = true;
        n_edges = h_edges.filter(e=>!e.mst)
        aantal--;
    }
    edges = h_edges.filter(e=>e.mst)
    edges.forEach((e,ind)=>e.id=ind);
    return [nodes,edges];
}

