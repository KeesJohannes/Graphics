function initKruskal() {
    sedges = edges.slice().sort((a,b)=>b.cost-a.cost)
    sedges.forEach(e=>{
        e.sp = false;
        e.del = false;
    })
    groep = [];
    nodes.forEach(n=>{
        n.sp = false;
        n.groep = n.id;
//        groep[n.groep] = {first:n.id,aantal:1};
        groep[n.groep] = [n.id];
//        n.next = -1; 
    })

    hsedges = sedges.slice().reverse(); // to present info

}

function advanceKruskal() {
    if (sedges.length==0) return;
    let x = sedges.pop()
    while (nodes[x.id1].groep==nodes[x.id2].groep) {
        x.del = true;
        if (sedges.length==0) return;
        x = sedges.pop();
    }
    x.del = true;    
    x.sp = true;
    let n1 = nodes[x.id1]
    let n2 = nodes[x.id2]
    n1.sp = true;
    n2.sp = true;
    // merge group g1 into g2 upfront
    let g1 = n1.groep;
    let g2 = n2.groep;
    let gs = g1;
    let gr = g2;
    if (groep[gs].length<groep[gr].length) {
        gs = g2;
        gr = g1;
    }
    groep[gr].forEach(g=>{
        groep[gs].push(g);
        nodes[g].groep = gs;
    });
    groep[gr] = [];
}


function stepKruskal() {
    advanceKruskal();
    drawNw();
    drawKruskalInfo();
}