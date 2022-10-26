console.log("gorman");
var size = 40;
population= 100
pubs = 1
var caCanvas = new CACanvas(size);

var area=[]
var people = []


class Person extends Agent {
    constructor(sClass, preference, color) {
        super();
        this.color = color;
        this.drinkState = "suspectable"
    }
    infect(){
        let test = function(agent){
            return agent.color="green"
        }
        if(this.color=="red"){
            let x = this.home.occupants.find(test)
            if( x!=undefined){
                x.color = "red"
            }
        }
    }
}


class Place extends Patch{
    constructor(){
        super()
        this.pub=false
        this.gradient=0.0
    }

    diffuse(amount){
        //console.log("diffuse",amount,this.gradient);
        if(this.gradient>=amount){
            return
        }
        this.gradient = amount
        for (let i = 0; i < this.neighbors.length; i++) {
            this.neighbors[i].diffuse(amount/8);
        }
    }
}


var setup = function(){
    var patches = new Patches(size);
    console.log("setup");
    for (i = 0; i < size * size; i++) {
        var place = new Place();
        patches.addPatch(place)
    }
    patches.setNeighbors()
    area = patches.list
    for (let i = 0; i < pubs; i++) {
        area[rndInt(size*size)].diffuse(1)    
    }
    for(let i = 0; i < population; i++ ){
        let person = new Person()
        person.color = "green" 
        people.push(person)
        area[rndInt(size*size)].addAgentTo(person)
    }
    let person = new Person()
    person.color = "red" 
    people.push(person)
    area[rndInt(size*size)].addAgentTo(person)
}

var draw = function(){
    for (let i = 0; i < area.length; i++) {
        const place = area[i];
        const c = 255*place.gradient
        d = 255-c
        const color = "rgb("+d+","+d+","+255+")" 
        caCanvas.draw(place.xPos, place.yPos, color);
    }
    for (let i = 0; i < people.length; i++) {
        const person = people[i];
        caCanvas.drawCircle(person.xPos(), person.yPos(), person.color, "black", 4, 1);
    }
    caCanvas.update("canvas");
}

var update = function(){
    for (let i = 0; i < people.length; i++) {
        const person = people[i];
        let home = person.home 
        nhome = home.getRandomNeighbor()
        home.removeAgentFrom(person)
        nhome.addAgentTo(person)
        person.infect()
    }
    draw()
    setTimeout(function () {
        window.requestAnimationFrame(update);
    }, 0);
}

setup()
draw()
update()
