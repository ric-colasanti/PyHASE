var size = 40;
var caCanvas = new CACanvas(size);

var population=[]
var shops = []
class FILOSet {
    constructor(size) {
        this.dataArray = [];
        this.size = size;
    }

    add(value) {
        // test if the set is full
        if (this.dataArray.length < this.size) {
            this.dataArray.unshift(value);
        } else {
            // if not get index of new element
            this.dataArray.pop();
            this.dataArray.unshift(value);
        }
    }
    lastVisit(value) {
        return this.dataArray.indexOf(value)
    }

    toString() {
        let s = "";
        for (let d in this.dataArray) {
            s += this.dataArray[d].toString() + " ";
        }
        return s;
    }
}


class Home extends Patch{
    constructor(color){
        super();
        this.color = color;
        
    }
}

class Person extends Agent{
    constructor(sClass,preference,color){
        super();
        this.color = color;
        this.atTarget = false;
        this.previousVisits = new FILOSet(4)
        this.preference = preference
        this.sClass = sClass;
    }
}
class Shop extends Agent{
    constructor(sClass, price, id){
        super();
        this.customers = 0
        this.sClass = sClass;
        this.highCustomers = 0;
        this.lowCustomers = 0;
        this.price = price;
        this.id = id
        this.color = "blue"
    }

}



var setup = function () {
    population=[]
    shops = []
    var agent
    place = new Patches(size);
    for (i = 0; i < size * size; i++) {
        var home = new Home();
        if(rndInt(2)==0){
            home.color="white"
        }else{
            home.color="black"
        }
        if( Math.random()<0.01){
            agent = new Shop(0,0,i);
            shops.push(agent)
        }else{
            agent = new Person(0,0,"red");
            population.push(agent)
        }
        home.addAgent(agent)
        place.addPatch(home)
    }
    place.setNeighbors();
    
}

var draw = function () {
    place.list.forEach(function (home, index) { 
        caCanvas.draw(home.xPos, home.yPos, home.color);
        var occupant = home.occupant;
        if(occupant!=null){
            if(occupant.constructor.name=="Shop"){
                caCanvas.draw(home.xPos, home.yPos, occupant.color);
            }else{
                caCanvas.drawCircle(home.xPos, home.yPos, occupant.color,4,1);
            }
        }
    });
    caCanvas.update("canvas");
}

setup()
draw()