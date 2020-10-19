function* gentree(lv,al) {
    let p1 = createVector(-30,-220);
    let p2 = createVector(30,-220);
    stack = [{p1,p2,fig:"vk",level:lv,alpha:al}];

    while (stack.length>0) {
        let hs = stack.length-1;
        let elm = stack[hs];
        stack.splice(hs,1);
        p1 = elm.p1;
        p2 = elm.p2;
        let alpha = elm.alpha;
        let level = elm.level;
        if (elm.fig=="vk") {
            if (level>0) {
                level--;
                let l = p1.dist(p2);
                let helling = p2.copy().sub(p1).heading();
                let pb = mkbasisvk(l,helling); 
                let rt = obj_translate(pb,p1);
                yield {tp:"vk",rt};
                if (rt[1].dist(rt[2])>=5) { 
                    append(stack,{p1:rt[1],p2:rt[2],fig:"dh",level,alpha});
                }
            }         
        } else if (elm.fig=="dh") {
            let l = p1.dist(p2);
            let helling = p2.copy().sub(p1).heading();
            let pb = mkbasisdh(l,helling,alpha); 
            let rt = obj_translate(pb,p1);
            yield {tp:"dh",rt};
            if (wissel) alpha = PI-alpha;
            append(stack,{p1:rt[0],p2:rt[1],fig:"vk",level,alpha});
            append(stack,{p1:rt[1],p2:rt[2],fig:"vk",level,alpha});               
        }
    }
            
} // gentree


function defsize() {

    let gr = gentree(level,alpha);
    
    let xmin = Infinity;
    let ymin = Infinity;
    let xmax = -Infinity;
    let ymax = -Infinity;

    let res = gr.next();
    while (!res.done) {
        let h = res.value;
        for (let p of h.rt) {
            xmin = min(xmin,p.x);
            xmax = max(xmax,p.x);
            ymin = min(ymin,p.y);
            ymax = max(ymax,p.y);
        }
        res = gr.next();
    }
    let hoogte = ymax-ymin;
    let breedte = xmax-xmin;
    let midx = (xmin+xmax)/2;
    let midy = (ymin+ymax)/2;
    let mid = createVector(midx,midy);
    let factor = 500*0.9/max(hoogte,breedte);
    let f = function(p) {
        return p.copy().sub(mid).mult(factor);
    };
    return f;

}

