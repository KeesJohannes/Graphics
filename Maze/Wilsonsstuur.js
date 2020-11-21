var formPosx = 620;
var formPosy = 150;
var remall;
var ss;
var tk;
var rn;
var pastatus = false;
var pa;
var sf;
var de;
var dList;

function enable(clist) {
    for (c of clist) c.removeAttribute("disabled");
}

function disable(clist) {
    for (c of clist) c.attribute("disabled", true);
}

function getDisabled(clist) {
    return clist.map(c => {
        return {
            obj: c,
            value: c.attribute("disabled")
        }
    });
}

function togglePaStatus() {
    if (pastatus) {
        pastatus = false;
        pa.elt.innerText = "Pause"
        pa.toggleClass("txt1");
        disable([ss]);
        loop(); // running
    } else {
        pastatus = true;
        pa.elt.innerText = "Continue"
        pa.toggleClass("txt1")
        enable([ss, rn]);
        noLoop(); // stopped
    }
}

class instel {
    constructor(values = {
        position: {
            x: 0,
            y: 0
        },
        name: "slider",
        slider: {
            low: 0,
            high: 10,
            def: 0,
            step: 0
        },
        change: () => null,
        disabled: false
    }) {
        var formx = values.position.x;
        var formy = values.position.y

        this.tk = createP(values.name);
        this.tk.parent("stuur");
        this.tk.class("txt");
        this.tk.position(formx, formy);

        formx += this.tk.size().width + 20; //
        this.sc = createSlider(
            values.slider.low,
            values.slider.high,
            values.slider.def,
            values.slider.step);
        this.sc.parent("stuur");
        this.sc.position(formx, formy + 20);
        this.sc.elt.addEventListener("change", () => {
            this.tk2.elt.innerHTML = `${this.sc.value()}`
            values.change();
        });
        if (values.disabled) {
            disable([this.sc])
        };

        formx += this.sc.size().width + 20;
        // next value of slider
        this.tk2 = createP(`${values.slider.def}`);
        this.tk2.parent("stuur");
        this.tk2.class("txt");
        this.tk2.position(formx, formy);
    }

    getValue() {
        return this.sc.value();
    }

    removeAttribute(att) {
        this.sc.removeAttribute(att);
    }

    attribute(name, value) {
        if (arguments.length > 1) {
            return this.sc.attribute(name, value); // result: set value
        } else {
            return this.sc.attribute(name); // result: attribute value
        }
    }
}

function WStuurElementen() {

    ss = new instel({
        position: {
            x: formPosx,
            y: formPosy
        },
        name: "Size of square",
        slider: {
            low: 2,
            high: 16,
            def: cv,
            step: 1
        },
        change: () => {
            disable([pa]);
            cv = ss.getValue();
            ch = cv;
            noLoop();
        },
        disabled: true
    });


    formPosy += 40;

    formPosx = 620
    // Speed
    tk = new instel({
        position: {
            x: formPosx,
            y: formPosy
        },
        name: "Speed",
        slider: {
            low: 1,
            high: 40,
            def: speed,
            step: 1
        },
        change: () => {
            speed = tk.getValue();
            frameRate(speed);
        }
    });

    formPosy += 60;
    // RUN
    rn = createButton("Run");
    rn.parent("stuur");
    rn.class("txt1");
    rn.position(formPosx, formPosy);
    rn.mousePressed(() => {
        if (pastatus) togglePaStatus();
        enable([pa]);
        calcvars();
        restart();
        disable([ss]);
        loop();
    });

    // Pause
    pastatus = false;
    pa = createButton("Pause");
    pa.parent("stuur");
    pa.class("txt1");
    pa.position(formPosx + rn.size().width + 20, formPosy);
    enable([pa]);
    pa.mousePressed(() => {
        togglePaStatus();
    });

    sf = createP("Aantal lege velden:");
    sf.parent("stuur");
    sf.class("txt1");
    sf.position(formPosx + rn.size().width + 20 + rn.size().width + 40, formPosy - 17);

    formPosy += 60;

    de = createButton("Detailed explanation:");
    de.parent("stuur");
    de.class("txt1");
    de.position(formPosx, formPosy);
    de.mousePressed(() => {
        if (showdet) {
            remall();
            showdet = false;
            restart();
            var lijst = dList.filter(l => l.value).map(f => f.obj); // status back
            enable(lijst);
            loop();
        } else {
            remall = setupshow(formPosx, formPosy + 20); // the showelements in remall
            setupGameTables()
            dList = getDisabled([ss, rn, pa]); // the to be disabled in dList 
            disable([ss, rn, pa])
            showdet = true;
            gms = gdraw(); // the gen function for the demo;
            noLoop();  // controlled by buttons "show me" and "next".
        }
    });

}

