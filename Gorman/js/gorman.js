console.log("gorman");
var size = 40;
population= 100
pubs = 1
var caCanvas = new CACanvas(size);

var area=[]
var people = []

var time=[]
var drinkers=[]
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
        if(this.gradient>=amount){
            return
        }
        this.gradient = amount
        for (let i = 0; i < this.neighbors.length; i++) {
            this.neighbors[i].diffuse(amount/8);
        }
    }

    getMost(){
        let max = 0
        let target = null
        for (let i = 0; i < this.neighbors.length; i++) {
            if(this.neighbors[i]!=this){
                if(this.neighbors[i].gradient>max){
                    max = this.neighbors[i].gradient;
                    target = this.neighbors[i]
                }
            }
        }
        return target
    }
}


var setup = function(){
    var patches = new Patches(size);
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

var update = function(iterations){
    var count = 0
    var plot = function(){

        var data = [{
            x: time,
            y: drinkers,
            mode: "lines",
            type: "scatter"
          }];
          
          // Define Layout
          var layout = {
            xaxis: {range: [0, ((Math.floor(iterations/100))+1)*100], title: "Time"},
            yaxis: {range: [0, population], title: "Drinkers"},
            title: "Number of drinkers"
          };
          
          // Display using Plotly
          Plotly.newPlot("myPlot", data, layout);
    }
    
    for (let i = 0; i < people.length; i++) {
        const person = people[i];
        let home = person.home 
        if( person.color == "red"){
            if( Math.random()<0.1){
                nhome = home.getMost();
            }else{
                nhome = home.getRandomNeighbor()
            }
        }else{
            nhome = home.getRandomNeighbor()
        }
        home.removeAgentFrom(person)
        nhome.addAgentTo(person)
        person.infect()
        if(person.color == "red"){
            count++
        }
    }
    time.push(iterations)
    drinkers.push(count)
    iterations++;
    draw()
    plot()
    if(count<population){
        setTimeout(function () {
            window.requestAnimationFrame(function(){update(iterations)});
        }, 0);
    }
}

setup()
draw()
update(0)
