var size = 10;
var sSize = 10
var caCanvas = new CACanvas(size);
var count = 0
var population
var place
var features = 6
var setFetures = 6
var opinions = 10
var setOpinions = 10
var iterations = 2000
var cols = []
var maxRGB = 255 * 255 * 255

var setVals = function () {
    setFetures = Number(document.getElementById("features").value);
    document.getElementById("featureslable").innerHTML = setFetures
    sSize = Number(document.getElementById("size").value);
    document.getElementById("sizelable").innerHTML = sSize
    iterations = Number(document.getElementById("iterations").value);
    document.getElementById("iterationslable").innerHTML = iterations
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
            this.culture.push(rndInt(opinions))
        }
    }

    similarity(agent) {
        var count = 0
        for (let i = 0; i < features; i++) {
            if (agent.culture[i] == this.culture[i]) {
                count++
            }
        }
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

var draw = function () {
    place.list.forEach(function (patch, index) {
        var person = patch.occupant;
        var r, g, b = 0
        if (features > 0) {
            r = parseInt(127 * person.culture[0] / setOpinions)
        }
        if (features > 1) {
            g = parseInt(127 * person.culture[1] / setOpinions)
        }
        if (features > 2) {
            b = parseInt(127 * person.culture[2] / setOpinions)
        }
        if (features > 3) {
            r += parseInt(127 * person.culture[3] / setOpinions)
        }
        if (features > 4) {
            g += parseInt(127 * person.culture[4] / setOpinions)
        }
        if (features > 5) {
            b += parseInt(127 * person.culture[5] / setOpinions)
        }
        var col = "rgba(" + r + "," + g + "," + b + ")";
        caCanvas.draw(patch.xPos, patch.yPos, col);
    });
    caCanvas.update("canvas");
};

var setup = function () {
    size = sSize
    features = setFetures
    caCanvas = new CACanvas(size);
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
    //console.log("update", count,population);
    for (let i = 0; i < population.list.length; i++) {
        population.list[rndInt(population.list.length)].dissemination()

    }
    draw();
    if (count < iterations) {
        setTimeout(function () {
            window.requestAnimationFrame(update);
        }, 0);
        count++
    }
};

setup()
update()