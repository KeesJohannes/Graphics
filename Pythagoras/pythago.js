function* gentree(lv,al) {
    let p1 = createVector(-30,-220);
    let p2 = createVector(30,-220);
    stack = [{p1,p2,fig:"vk",level:lv,alpha:al}];

    while (stack.length>0) {
        let elm = stack.splice(stack.length-1,1)[0];
        p1 = elm.p1;
        p2 = elm.p2;
        let alpha = elm.alpha;
        let level = elm.level;
        let lengte = p1.dist(p2);
        let helling = p2.copy().sub(p1).heading();
        if (elm.fig=="vk") {
            if (level>0) {
                level--;
                let pb = mkbasisvk(lengte,helling); 
                let rt = obj_translate(pb,p1);
                yield {tp:"vk",rt};
                if (rt[1].dist(rt[2])>=5) { 
                    append(stack,{p1:rt[1],p2:rt[2],fig:"dh",level,alpha});
                }
            }         
        } else if (elm.fig=="dh") {
            let pb = mkbasisdh(lengte,helling,alpha); 
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
    let schuif = createVector((xmin+xmax)/2,(ymin+ymax)/2);
    let factorb = width*0.9/(xmax-xmin);
    let factorh = height*0.9/(ymax-ymin);
    let factor = min(factorb,factorh);

    let fillscreen = function() {
        if (keepAR) {
            //ft(factor,factor)
            scale(factor)
        } else {
            //ft(factorb,factorh);
            scale(factorb,factorh);
        }
        translate(-schuif.x,schuif.y);
        scale(1,-1);    
    }

    let colorcoord = function(p) {
        vx = map(p.x,xmin,xmax,0,255);
        vy = map(p.y,ymin,ymax,0,255);
        return {vx,vy};    
    }

    return {fillscreen,colorcoord};
}

