var size = 40;
var caCanvas = new CACanvas(size);
var count = 0
var population
var place
var likeness = 0.4
var density = 0.95

var setVals = function () {
    likeness = Number(document.getElementById("alike").value);
    density = Number(document.getElementById("pop").value);
    
 
    document.getElementById("alikelable").innerHTML = parseFloat(likeness).toFixed(1).toLocaleString()
    document.getElementById("poplable").innerHTML = parseFloat(density).toFixed(1).toLocaleString()
    likeness = likeness/100
    density = density/100
}

var reset = function() {
    count = 0
    setVals()
    setup()
    update()
    
}

class Person extends Agent {
    constructor(state) {
        super();
        this.state = state;
    }

    coutSame(){
        let count = 0
        let l = this.home.neighbors.length
        for(let i=0;i<l; i++){
            let n = this.home.neighbors[i];
            let occ = n.occupant
            if((occ!=null)&&( this.state==occ.state)){
                count++
            }
        }
        return count/l
    }
}


var setup = function () {
    population = new Agents();
    place = new Patches(size);
    for (i = 0; i < size * size; i++) {
        var patch = new Patch();
        if(Math.random()<density){
            var agent = new Person(rndInt(2));
            patch.addAgent(agent);
            population.addAgent(agent);
            ;    
        }
        place.addPatch(patch)
    }
    place.setNeighbors();
}

var draw = function () {
    var bCol = "#ffffff";
    place.list.forEach(function (patch, index) {
        var person = patch.occupant;
        var col;
        if(person!=null){
            col = col = "#ff0000";
            if(person.state==1){
                col = "#0000ff";
            }
            caCanvas.draw(patch.xPos, patch.yPos, bCol, true, col);
        }
    });
    caCanvas.update("canvas");
};

var findspace = function(){
    var patch = null
    for(let i=0; i<place.size; i++){
        patch = place.list[i]
        //console.log(patch);
        if(patch.occupant==null){
            return patch;
        }
    }
    return null;
}

var update = function () {
    place.shuffle();
    caCanvas.clear()
    //console.log("update",population.list.length);
    for(let i=0; i<population.list.length;i++){
        var person = population.list[i] 
        var happy = person.coutSame()
        //console.log(happy);
        if(happy<likeness){
            var moveTo = findspace()
            if(moveTo!=null){
                person.home.occupant=null
                person.home = moveTo
                moveTo.occupant=person
            }
        };
    }
    draw();
    if((count<200) && ( running == true))  {
        setTimeout(function () {
            window.requestAnimationFrame(update);
        }, 500);
        count++
    }
};

var running = false;
var run = function(){
    if ( running){
        running = false
        let but = document.getElementById("running").innerHTML=" Run "
    }else{
        running = true
        let but = document.getElementById("running").innerHTML="Stop"
        update()
    }
} 

setup()
draw()