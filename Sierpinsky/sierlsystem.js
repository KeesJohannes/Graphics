queue = [];

function step() {
    if (queue.length > 0) {
        let p = queue.pop();
        if (p.n > 0) {
            let q = DrawInnerTriangle(p.p1, p.p2, p.p3)
            if (p.n > 1) {
                queue.push({ stat: 0, p1: q.p31, p2: q.p23, p3: p.p3, n: p.n - 1 })
                queue.push({ stat: 0, p1: q.p12, p2: p.p2, p3: q.p23, n: p.n - 1 });
                queue.push({ stat: 0, p1: p.p1, p2: q.p12, p3: q.p31, n: p.n - 1 });
            }
        }
    } else {
        clearInterval(event);
    }
}

function DrawSier(n) {
    queue = [];
    let base = myC.width * 0.8;
    let p1 = { x: myC.width * 0.1, y: myC.height * 0.9 };
    let p2 = { x: p1.x + base, y: p1.y }
    let p3 = { x: (p1.x + p2.x) / 2, y: p1.y - base * Math.tan(-Math.PI * 2 / 3) / 2 };
    myC.lineFromTo(p1, p2);
    myC.lineFromTo(p2, p3);
    myC.lineFromTo(p3, p1);
    queue.push({ stat: 0, p1, p2, p3, n })
}

function SierCut(p1, p2, p3, n) {
    if (n > 0) {
        let p = DrawInnerTriangle(p1, p2, p3)
        SierCut(p1, p.p12, p.p31, n - 1);
        SierCut(p.p12, p2, p.p23, n - 1);
        SierCut(p.p31, p.p23, p3, n - 1);
    }
}

function DrawInnerTriangle(p1, p2, p3) {
    let p12 = half(p1, p2);
    let p23 = half(p2, p3);
    let p31 = half(p3, p1);
    myC.lineFromTo(p12, p23)
    myC.lineFromTo(p23, p31);
    myC.lineFromTo(p31, p12);
    return { p12, p23, p31 }
}

function half(p1, p2) {
    return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }
}
