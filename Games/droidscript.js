

function setup1() {
    OnStart();
}

class app {
    constructor() {

    }

    static CreateLayout = function(wi,he) {
        return app.DefineCanvas(wi,he); 
    }

    static DefineCanvas = function(wi,he) {
        return createCanvas(wi,he);
    }

    static AddImage = function(lay,plaatje,wi,he) {
        return new Image(lay,wi,he)
    };

}

class Image {
    constructor(lay,wi,he) {
        this.lay = lay;
        this.width = wi*width;
        this.height = he*height;
        this.x = (width-this.width)/2;
        this.y = 0;
    }

    SetBackColor(bc) {
        this.bc = bc;
        background(this.bc);
    }

    SetPaintColor(clr) {
        this.pc = clr;
    }

    SetLineWidth(lw) {
        this.lw = lw;
    }

    SetPaintStyle(st) {
        this.st = st;
    }

    DrawRectangle(x,y,w,h) {
        noFill();
        stroke(this.pc)
        strokeWeight(this.st);
        rect(this.x+x*this.width,this.y+y*this.height,w*this.width,h*this.height);
        print(this.width,this.height,width,height)
    }

    DrawLine(x1,y1,x2,y2) {
        fill(this.pc);
        stroke("red");
        strokeWeight(this.st)
        line(this.x+x1*this.width,this.y+y1*this.height,
            this.x+x2*this.width,this.y+y2*this.height)
            print(this.x+x1*this.width,this.y+y1*this.height,
                this.x+x2*this.width,this.y+y2*this.height)
        }
}