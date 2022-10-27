console.log("gorman");
var size = 40;
population= 100
pubs = 1
var caCanvas = new CACanvas(size);
var probStart = 0.5
var probStop = 0.3

var area=[]
var people = []

var time=[]
var drinkers=[]
var suspectable=[]
var former=[]
class Person extends Agent {
    constructor(sClass, preference, color) {
        super();
        this.color = color;
        this.drinkState = "suspectable"
    }
    infect(){
        let testC = function(agent){
            return agent.drinkState=="current"
        }
        let testF = function(agent){
            return agent.drinkState=="former"
        }
        if(this.drinkState=="suspectable"){
            let x = this.home.occupants.find(testC)
            if( x!=undefined){
                this.drinkState = "current"
            }
        }else if(this.drinkState=="current"){
            let x = this.home.occupants.find(testF)
            if( x!=undefined){
                if(Math.random()<0.9){
                    this.drinkState = "former"
                }
            }
        }else if(this.drinkState=="former"){
            let x = this.home.occupants.find(testC)
            if( x!=undefined){
                this.drinkState = "current"
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
        person.drinkState="suspectable"
        people.push(person)
        area[rndInt(size*size)].addAgentTo(person)
    }
    let person = new Person()
    person.drinkState="current"
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
        var color = "green"
        if(person.drinkState ==  "current"){
            color = "red"
        }
        if(person.drinkState ==  "former"){
            color = "blue"
        }
        caCanvas.drawCircle(person.xPos(), person.yPos(),color, "black", 4, 1);
    }
    caCanvas.update("canvas");
}

var plot = function(iterations){

    var data = [{
        x: time,
        y: drinkers,
        name: "Current",
        mode: "lines",
        type: "scatter",
        line: {
        color:"red"
        }
      },{
        x: time,
        y: suspectable,
        name: "Suspectable",
        mode: "lines",
        type: "scatter",
        line: {
            color: "green"
        }},{
            x: time,
            y: former,
            name: "Former",
            mode: "lines",
            type: "scatter",
            line: {
                color: "blue"
            }
      }];
      
      // Define Layout
      var layout = {
        xaxis: {range: [0, ((Math.floor(iterations/100))+1)*100], title: "Time"},
        yaxis: {range: [0, population], title: "People"},
        title: "Drinking state"
      };
      
      // Display using Plotly
      Plotly.newPlot("myPlot", data, layout);
}

var update = function(iterations){
    var countC = 0
    var countS = 0
    var countF = 0
    
    
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
        if(person.drinkState == "current"){
            countC++
        }
        if(person.drinkState == "suspectable"){
            countS++
        }
        if(person.drinkState == "former"){
            countF++
        }
    }
    time.push(iterations)
    drinkers.push(countC)
    suspectable.push(countS)
    former.push(countF)
    iterations++;
    draw()
    plot(iterations)
    if(countC<population){
        setTimeout(function () {
            window.requestAnimationFrame(function(){update(iterations)});
        }, 0);
    }
}

setup()
draw()
update(0)
