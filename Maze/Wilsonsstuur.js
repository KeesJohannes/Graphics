var formPosx = 620;
var formPosy = 150;

function WStuurElementen() {

    var ss = new instel({
        position:{x:formPosx,y:formPosy},
        name:"Size of square",
        slider:{low:2,
                high:16,
                def:cv,
                step:1},
        change:()=>{cv = ss.getValue(); ch = cv; noLoop(); disable([pa])}
        });

    formPosy += 40;

    formPosx = 620
    var tk = new instel({
        position:{x:formPosx,y:formPosy},
        name:"Speed",
        slider:{low:1,
                high:40,
                def:speed,
                step:1},
        change:()=>{speed = tk.getValue();frameRate(speed);}
        });
        
    formPosy += 60;       
    let rn = createButton("Run");
    rn.parent("stuur");
    rn.class("txt1");
    rn.position(formPosx,formPosy);
    rn.mousePressed(()=>{
       if (pastatus) togglePaStatus();
       enable([pa]);
        calcvars();
        restart();
        loop();
    });
    
    var pastatus = false;
    var pa = createButton("Pause");
    pa.parent("stuur");
    pa.class("txt1");
    pa.position(formPosx+rn.size().width+20,formPosy);
    pa.mousePressed(()=>{
        togglePaStatus();
    });
    
    function togglePaStatus() {
        if (pastatus) {
            pastatus = false;
            pa.elt.innerText = "Pause"
            pa.toggleClass("txt1")
            loop();
        } else {
            pastatus = true;
            pa.elt.innerText = "Continue"
            pa.toggleClass("txt")
            noLoop();
        }
        print(pa);
        print(rn);        
    }
}

function enable(clist) { 
    for (c of clist) c.removeAttribute("disabled");
}

function disable(clist) {
    for (c of clist) c.attribute("disabled",true);
}

class instel {
    constructor(values=
        {position:{x:0,y:0},
        name:"slider",
        slider:{low:0,high:10,def:0,step:0},
        change:()=>null 
        }) {
        var formx = values.position.x; 
        var formy = values.position.y
        this.tk = createP(values.name);
        this.tk.parent("stuur");
        this.tk.class("txt");
        this.tk.position(formx,formy);

        formx += this.tk.size().width+20; //
        this.sc = createSlider(
            values.slider.low,
            values.slider.high,
            values.slider.def,
            values.slider.step);
        this.sc.parent("stuur"); 
        this.sc.position(formx,formy+20);
        this.sc.elt.addEventListener("change",()=>{
            this.tk2.elt.innerHTML = `${this.sc.value()}`
            values.change();
        });
        
        formx += this.sc.size().width+20;
        // next value of slider
        this.tk2 = createP(`${values.slider.def}`);
        this.tk2.parent("stuur");
        this.tk2.class("txt");
        this.tk2.position(formx,formy);
    }

    getValue() {
        return this.sc.value();
    }
}

/*

    formPosy += 30;

    let rn = createButton("Run");
    rn.parent("stuur");
    rn.class("txt");
    rn.position(formPosx,formPosy+50);
    rn.mousePressed(()=>{
        //startup();
        //disable([rn,wi,ar,sc1,sc,tk]);
        //enable([st]);
        restart();
    });

    let pastatus = false;
    let pa = createButton("Pause");
    pa.parent("stuur");
    pa.class("txt");
    pa.position(formPosx+60,formPosy+50);
    pa.mousePressed(()=>{
        if (pastatus) {
            pastatus = false;
            loop();
        } else {
            pastatus = true;
            noLoop();
        }
    };
] 
}
*/
