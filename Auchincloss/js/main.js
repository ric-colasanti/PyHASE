var size = 50
var caCanvas = new CACanvas(size)





class Person extends Agent {
    constructor(income) {
        super();
        this.income = income
        this.previousVisits = [null,null,null,null,null];
    }

    update() {

    }
}

class Place extends Patch {
    constructor(state) {
        super();
        this.occupant = []
    }

    addAgent(agent) {
        this.occupant.push(agent);
        agent.home = this;
    }
    
    distance(place){
        var xDif = Math.abs(this.xPos - place.xPos)
        var yDif = Math.abs(this.yPos - place.yPos)
        return Math.sqrt(Math.pow(xDif,2)+Math.pow(yDif,2))
    }
}
        


setup = function () {
    population = new Agents()
    places = new Patches(size)
    for (i = 0; i < size * size; i++) {
        var place = new Place();
        var person = new Person(rndInt(2))
        place.addAgent(person);
        population.addAgent(person);
        places.addPatch(place);
    }
    places.setNeighbors()
    draw()
}


draw = function () {
    var bCol = "#000000";
    population.list.forEach(function (person, index) {
        var col = "#ff0000"
        //console.log(person.income);
        if (person.income == 1 ){ col = "#0000ff"} 
        caCanvas.draw(person.home.xPos, person.home.yPos, bCol, true, col);
    })
    caCanvas.update("canvas");
    console.log("draw");
}



update = function () {
}

stop = function () {
    flag = false;
    console.log(flag);
}
go = function () {
    flag = true;
    update()
}



setup();
draw();
test = function () {
    console.log("test");
}
var runBtn = document.getElementById("run");
runBtn.addEventListener("click", go);
var setupBtn = document.getElementById("setup");
setupBtn.addEventListener("click", setup);
var stopBtn = document.getElementById("stop");
stopBtn.addEventListener("click", stop);

function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}