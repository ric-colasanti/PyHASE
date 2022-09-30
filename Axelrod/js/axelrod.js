var size = 30;
var caCanvas = new CACanvas(size);
var count = 0
var population
var place
var features = 3
var cols = []
var maxRGB = 255 * 255 * 255



var setVals = function () {
    features = Number(document.getElementById("features").value);

    document.getElementById("featureslable").innerHTML = features
}

var reset = function () {
    count = 0
    setVals()
    setup()
    update()

}

class Person extends Agent {
    constructor() {
        super();
        this.culture = [];
        for (let i = 0; i < features; i++) {
            this.culture.push(rndInt(10))
        }
    }

    similarity(agent) {
        var count = 0
        for (let i = 0; i < features; i++) {
            if (agent.culture[i] == this.culture[i]){
                count++
            }
        }
        //console.log(count);
        return count / features
    }

    dissemination() {
        let cell = this.home.neighbors[rndInt(4)]
        let agent = cell.occupant
        if (Math.random() < this.similarity(agent)) {
            let trait = rndInt(features)
            this.culture[trait] = agent.culture[trait]
        }
    }
}

var toRGB = function (n) {
    let rgb = []
    let d = 255
    for (let i = 0; i < 3; i++) {
        let x = n % d
        rgb.push(parseInt(x / d * 255))
        n = n - x
        d = d * 255
    }
    return rgb
}


var draw = function () {
    var maxFeature = 10 ** (features)
    place.list.forEach(function (patch, index) {
        var person = patch.occupant;
        var cols = 0
        var d = 0
        for (let i = 0; i < person.culture.length; i++) {
            if (i == 0) {
                cols += person.culture[i]
            } else {
                cols += person.culture[i] * (10 ** i)
            }
        }
        let rgb = toRGB(maxRGB * Math.random())//(cols/maxFeature))
        //console.log(maxRGB, maxFeature, cols, rgb);
        var col = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
        caCanvas.draw(patch.xPos, patch.yPos, col);
    });
    caCanvas.update("canvas");
};

var setup = function () {
    population = new Agents();
    place = new Patches(size);
    for (i = 0; i < size * size; i++) {
        var patch = new Patch();
        var agent = new Person();
        patch.addAgent(agent);
        population.addAgent(agent);
        place.addPatch(patch)
    }
    place.setVonNeighbors();
}





var update = function () {
    caCanvas.clear()
    console.log("update", count,population);
    for(let i=0; i< population.list.length;i++){
        population.list[rndInt(population.list.length)].dissemination()
        draw();
    }
    if (count < 1000) {
        setTimeout(function () {
            window.requestAnimationFrame(update);
        },1);
        count++
    }
};


console.log("here", count);
setup()
update()