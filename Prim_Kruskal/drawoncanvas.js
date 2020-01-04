let xdif;
let ydif;
let rows;
let cols;
let pictWidth;
let pictHeight;
let but0 = {x:0,y:30,w:100,h:40}
let but1 = {x:340,y:30,w:40,h:40}

function ctox(c) {
    return xdif/2+c*xdif;
}

function rtoy(r) {
    return 1.5*ydif+r*ydif;
}

function initDraw() {
    rows = nodes.reduce((a,n)=>Math.max(a,n.row),0)+1;
    cols = nodes.reduce((a,n)=>Math.max(a,n.col),0)+1;

    pictWidth = myCanvas.width*0.6
    pictHeight = myCanvas.height*0.9;

    strokeColor = "#FFFFFF"
    fillColor = "#FFFFFF"

    xdif = pictWidth/(cols+1);
    ydif = pictHeight/(rows+2);

    font("20px Arial");
    textAlign("center")
    textBaseline("middle")


}


function drawNw() {
    clear();
    font("18px Arial")
    textAlign("center")
    textBaseline("middle")
    fill("#FFFFFF")
    ctx.strokeStyle = "#FFFFFF"
    ctx.fillStyle = "#FFFFFF"
    but0.x = myCanvas.width/2-but0.w/2;
    ctx.strokeRect(but0.x,but0.y,but0.w,but0.h);
    if (algol==0) {
        fillText("KRUSKAL",myCanvas.width/2,50)
    } else {
        fillText("PRIM",myCanvas.width/2,50)
    }
    but1.x = myCanvas.width-but1.w-30
    ctx.strokeRect(but1.x,but1.y,but1.w,but1.h)
    font("12px Arial")
    fillText("Rand",but1.x+but1.w/2,but1.y+but1.h/2)
    font("18px Arial")
    fill("#FFFFFF")
    lineWidth(1);
    edges.forEach(e=>{
        let n1 = nodes[e.id1];
        let n2 = nodes[e.id2];
        if (e.sp) stroke("#FF0000");
        else stroke("#FFFFFF");
        lineFromTo({x:ctox(n1.col),y:rtoy(n1.row)},
                   {x:ctox(n2.col),y:rtoy(n2.row)});
    })
    nodes.forEach(n=> {
        if (n.sp) fill("#FF0000");
        else fill("#FFFFFF");
        Circle(ctox(n.col),rtoy(n.row),15)
    })
    font("18px Arial")
    edges.forEach(e=>{
        let n1 = nodes[e.id1];
        let n2 = nodes[e.id2];
        let c = (n1.col+n2.col)/2
        let r = (n1.row+n2.row)/2;
        if (e.sp) fill("#FF0000");
        else fill("#FFFFFF");
        fillText(e.cost,ctox(c),rtoy(r));
    })
    fill("#000000");
    nodes.forEach(n=>{
        fillText(n.id,ctox(n.col),rtoy(n.row));
    }) 
}

function drawKruskalInfo() {
    font("18px Arial")
    textAlign("right")
    textBaseline("lower")
    fill("#FFFFFF")
    stroke("#FFFFFF")
    lineWidth(1);
    let y = 100;
    let dy = 20;
    x = pictWidth;
    textAlign("left")
    fillText("Edges to select from:",x,y);
    y += dy;
    fillText("(cost vertices groups)",x+8,y);
    y += dy;
    textAlign("right")
    font("17px Arial")
    hsedges.forEach(e=>{
        if (e.sp) fill("#FF0000"); else fill("#FFFFFF");
        let x = pictWidth+40;
        let xstart = x;
        let t = `${e.cost}`
        fillText(t,x,y);
        x += 60
        t = `${e.id1}<=>${e.id2}`
        fillText(t,x,y);
        x += 45
        t = `(${nodes[e.id1].groep},${nodes[e.id2].groep})`
        fillText(t,x,y);
        let xend = x;
        x += 30
        // if (e.sp) {
        //     t = `***`
        //     fillText(t,x,y);
        // }
        if (e.del) {
            lineFromTo({x:xstart,y},{x:xend,y})
        }
        y += dy;
    })
    y += dy;
    x = pictWidth;
    fill("#FFFFFF");
    textAlign("left")
    fillText("Vertices in a group",x,y);
    y += dy;
    groep.forEach((gr,ind)=>{
        if (gr.length>0) {
            x = pictWidth+40;
            textAlign("right")
            fillText(`${ind}:`,x,y);
            x += 20;
            textAlign("left")
            fillText(`${gr.join(", ")}`,x,y);
            y += dy;
        }
    });

    let tc = hsedges.filter(e=>e.sp).reduce((a,e)=>a+e.cost,0);
    fillText(`Total cost:${tc}`,20,600-3*dy)

    let longText = "Click anywhere in the picture:"
    fillText(longText,20,600-dy)
    longText = "The program chooses the first edge which connect vertices from different groups"
    fillText(longText,20,600)

    font("14px Arial")
    longText = "Click on KRUSKAL to get PRIM"
    fillText(longText,20,700-dy)

}

function drawPrimInfo() {
    font("18px Arial")
    textAlign("right")
    textBaseline("lower")
    fill("#FFFFFF")
    stroke("#FFFFFF")
    lineWidth(1);
    let y = 100;
    let dy = 20;
    x = pictWidth;
    textAlign("left")
    fillText("Edges to select from:",x,y);
    y += dy;
    fillText("(cost vertex ms-tree)",x+8,y);
    y += dy;
    textAlign("right")
    font("17px Arial")
    hsedges.forEach(e=>{
        if (e.sp) fill("#FF0000"); else fill("#FFFFFF");
        let x = pictWidth+40;
        let xstart = x;
        let t = `${e.cost}`
        fillText(t,x,y);
        x += 60
        t = `${e.id1}<=>${e.id2}`
        fillText(t,x,y);
        x += 45
        t = `(${nodes[e.id1].sp?"*":"-"},${nodes[e.id2].sp?"*":"-"})`
        fillText(t,x,y);
        let xend = x;
        x += 30
        if (e.del) {
            lineFromTo({x:xstart,y},{x:xend,y})
        }
        y += dy;
    })
    y += dy;
    x = pictWidth;
    fill("#FFFFFF")
    stroke("#FFFFFF")
    textAlign("left")
    fillText("Vertices in the minimum spaning tree:",x,y);
    y += dy;
    t = mstnodes.join(", ")
    textAlign("left")
    fillText("In mst: "+t,x,y);

    let tc = hsedges.filter(e=>e.sp).reduce((a,e)=>a+e.cost,0);
    fillText(`Total cost:${tc}`,20,600-3*dy)

    let longText = "Click anywhere in the picture:"
    fillText(longText,20,600-dy)
    longText = "The program chooses the first edge which connect a mst-vertex with a non mst-vertex."
    longText += " (-,*) or (*,-)" 
    fillText(longText,20,600)
    longText = "The first vertex is choosen at random."
    fillText(longText,20,600+dy)

    font("14px Arial")
    longText = "Click on PRIM to get KRUSKAL"
    fillText(longText,20,700-dy)

}