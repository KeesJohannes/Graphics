

function Sierpinsky(n,duur) {
    let base = myC.width * 0.8;
    let p1 = { x: myC.width * 0.1, y: myC.height * 0.9 };
    let p2 = { x: p1.x + base, y: p1.y }
    let p3 = { x: (p1.x + p2.x) / 2, y: p1.y - base * Math.tan(-Math.PI * 2 / 3) / 2 };
    DrawTriangle(p1,p2,p3);
    let gv = CutSierpinsky(p1,p2,p3,n);
    let event = setInterval(()=>{
        let v = gv.next();
        if (v.done) clearInterval(event);
    },duur)
}

function* CutSierpinsky(p1, p2, p3, n) {
    if (n > 0) {
        let p12 = halfbetween(p1, p2);
        let p23 = halfbetween(p2, p3);
        let p31 = halfbetween(p3, p1);
        DrawTriangle(p12,p23,p31);
        yield
        if (n>1) {
            yield* CutSierpinsky(p1, p12, p31, n - 1);
            yield* CutSierpinsky(p12, p2, p23, n - 1);
            yield* CutSierpinsky(p31, p23, p3, n - 1);
        }
    }   
}

function DrawTriangle(p1,p2,p3) {
    myC.lineFromTo(p1, p2);
    myC.lineFromTo(p2, p3);
    myC.lineFromTo(p3, p1);
}

function halfbetween(p1, p2) {
    return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }
}
