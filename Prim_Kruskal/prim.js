function initPrim() {
    sedges = edges.slice().sort((a,b)=>a.cost-b.cost)
    sedges.forEach(e=>{
        e.sp = false;
        e.del = false;
    })
    nodes.forEach(n=>{
        n.sp = false;
    })

    hsedges = sedges.slice(); // to present info

    mstnodes = [];

}

function advancePrim() {
    if (mstnodes.length==0) {
        let i = Math.floor(Math.random()*nodes.length);
        nodes[i].sp = true;
        mstnodes.push(i);
        return;
    }
    if (sedges.length==0) return;
    let i = 0;
    let x = sedges[i];
    while (nodes[x.id1].sp==nodes[x.id2].sp) {
        if (nodes[x.id1].sp) {
            x.del = true;
            sedges.splice(i,1);
        } else {
            i++;
        }
        if (sedges.length==0) return;
        x = sedges[i]
    }
    x.del = true;    
    sedges.splice(i,1);
    x.sp = true;
    let n1 = nodes[x.id1]
    let n2 = nodes[x.id2]
    if (!n1.sp) {
        mstnodes.push(n1.id);
        n1.sp = true;
    } else {
        mstnodes.push(n2.id);
        n2.sp = true;
    }
}

function stepPrim() {
    advancePrim();
    drawNw();
    drawPrimInfo()
}