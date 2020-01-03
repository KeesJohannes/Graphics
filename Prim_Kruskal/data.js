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

function GenNw() {
    let edges = [];
    let rows = 4;
    let cols = 4;
    let occu = new Array(rows);
    for (let c=0;c<cols;c++) {
        occu[c] = new Array(rows);
        occu[c].fill(0);
    }
    let htel = new Array(rows*cols);
    for (let i=0;i<htel.length;i++) htel[i]=i;
    let aantal = fixRandBetween(4,9);
    let nodes = new Array(aantal);
    let groeps = new Array(aantal);
    groeps.fill(0);
    for (let i=0;i<aantal;i++) {
        let w = fixRandBetween(0,htel.length);
        let cel = htel[w];
        nodes[i] = {id:i,col:cel%cols,row:Math.floor(cel/cols),groep:i};
        occu[nodes[i].col][nodes[i].row] = 1; // occupied by node
        groeps[i]++;
        htel.splice(w,1)
    }
    aantal = fixRandBetween(aantal,aantal+4);
    nodes.forEach(no=>{
        let id1 = no.id;
        let c = no.col;
        let r = no.row;
        let nb = []; // de directe buren
        let se = edges.sort(e=>e.n1);

        for (let [dc,dr] of [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,1],
                             [1,2],[1,-2],[-1,2],[-1,-2],
                             [2,1],[-2,1],[2,-1],[-2,-1]]) {
            c = no.col+dc;
            r = no.row+dr;
            while (c>=0 && c<cols && r>=0 && r<rows) {
                let ind =  nodes.findIndex(n=>n.col==c && n.row==r);
                let ind2 = edges.findIndex(e=>(e.id1==id1 && e.id2==ind) ||
                                              (e.id1==ind && e.id2==id1));
                let occupied = false
//                if (ind>=0) {
//                    occupied = isOccupied(nodes[id1],nodes[ind],cols,rows,occu);
                //    occupied = false;
//                }
                //console.log(occupied)
//                occupied = Bezet(nodes[id1],nodes[id2],cols,rows);
                if (ind>=0 && ind2<0 && !occupied) {
                    nb.push(ind);
                    break;
                } else {
                    c += dc;
                    r += dr;
                }
            }
        }
        if (nb.length>0) {
            let nbind = fixRandBetween(0,nb.length-1);
            if (nbind>=0) {
                let g1 = no.groep;
                let id2 = nb[nbind] 
                let g2 = nodes[id2].groep;
                if (g1!=g2) {
                    nodes.filter(n=>n.groep==g2).forEach(n=>{
                        n.groep = g1;
                        groeps[g1]++;
                        groeps[g2]--;
                    })
                }
                let id = edges.length;
//                occupy(nodes[id1],nodes[id2],cols,rows,occu)
                edges[id] = {id,id1,id2,cost:fixRandBetween(1,8)}
            }
        }

    });
    
    return [nodes,edges];

}
/*
function Bezet(n1,n2,cols,rows) {
    let p1 = {x:n1.col,y:n1.row}
    let p2 = {x:n2.col,y:n2.row}
    if (p1.x==p2.x) {
        let can = edges.filter(e=>nodes[e.id1].col==p1.x || nodes[e.id2].col==p1.x)
                    .map(e=>{
                        if (nodes[e.id1].col==p1.x) {
                            return {id:e.id,c:nodes[e.id1].col,r}
                        }
                                         })
    } else if (p1.y==p2.y) {

    } else
        return false;
};
*/
function isOccupied(n1,n2,cols,rows,occu) {
    let p1 = {x:n1.col%cols,y:Math.floor(n1.row/rows)}
    let p2 = {x:n2.col%cols,y:Math.floor(n2.row/rows)}
    let xstart = Math.min(p1.x,p2.x);
    let xeind = Math.max(p1.x,p2.x);
    let dx = Math.max(xeind-xstart,1);
    let ystart = Math.min(p1.y,p2.y);
    let yeind = Math.max(p1.y,p2.y);
    let dy = Math.max(yeind-ystart,1);
    for (let c=xstart;c<=xeind;c+=dx) {
        for (let r=ystart;r<=yeind;r+=dy) {
            if (!((c==xstart && r==ystart) || (c==xeind && r==yeind))) {
                if (occu[c][r] != 0) {// edge or vertex 
                    return true; // crossing
                }
            }
        }
    }
    return false
}

function occupy(n1,n2,cols,rows,occu) {
    let p1 = {x:n1.col%cols,y:Math.floor(n1.row/rows)}
    let p2 = {x:n2.col%cols,y:Math.floor(n2.row/rows)}
    let xstart = Math.min(p1.x,p2.x);
    let xeind = Math.max(p1.x,p2.x);
    let dx = Math.max(xeind-xstart,1);
    let ystart = Math.min(p1.y,p2.y);
    let yeind = Math.max(p1.y,p2.y);
    let dy = Math.max(yeind-ystart,1);
    for (let c=xstart;c<=xeind;c+=dx) {
        for (let r=ystart;r<=yeind;r+=dy) {
            if ((c==xstart && r==ystart) || (c==xeind && r==yeind)) {
                occu[c][r] = 1; // vertex
            } else {
                occu[c][r] = 2; // edge
            }
        }
    }
}

