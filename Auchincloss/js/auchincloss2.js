var size = 40;
var caCanvas = new CACanvas(size);

var population = []
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


class Home extends Patch {
    constructor(color) {
        super();
        this.color = color;
    }
}

class Person extends Agent {
    constructor(sClass, preference, color) {
        super();
        this.color = color;
        //this.previousVisits = new FILOSet(4)
        this.preference = preference
        this.sClass = sClass;
        this.shops = []
        this.shopsScore = []
    }
}
class Shop extends Agent {
    constructor(sClass, price, id) {
        super();
        this.customers = 0
        this.sClass = sClass;
        this.price = price;
        this.id = id
        this.color = "blue"
    }

}

var distance = function () {
    for (let i = 0; i < population.length; i++) {
        let person = population[i]
        let total = 0
        for (let j = 0; j < shops.length; j++) {
            let shop = shops[j]
            let xdif = Math.abs(person.xPos() - shop.xPos())
            let ydif = Math.abs(person.yPos() - shop.yPos())
            let distance = 1 / (Math.sqrt(Math.abs(xdif * xdif + ydif * ydif))* Math.sqrt(Math.abs(xdif * xdif + ydif * ydif)))
            total += distance
            //console.log(distance,total);
            person.shops.push(shop)
            person.shopsScore.push(total)
        }
    }
}


var chooseShop = function () {
    for (let i = 0; i < shops.length; i++) {
        const shop = shops[i];
        shop.customers=0
    }
    for (let i = 0; i < population.length; i++) {
        let person = population[i];
        let choice = Math.random() * person.shopsScore[person.shopsScore.length - 1]
        let j = 0
        while (choice > person.shopsScore[j]) {
            j++
        }
        person.color = person.shops[j].color
        person.shops[j].customers++;
    }
}

var setup = function () {
    population = []
    shops = []
    var agent
    place = new Patches(size);
    for (i = 0; i < size * size; i++) {
        var home = new Home();
        if (rndInt(2) == 0) {
            home.color = "#dddddd"
        } else {
            home.color = "#aaaaaa"
        }
        if (Math.random() < 0.005) {
            agent = new Shop(0, 0, i);
            agent.color = "rgb(" + rndInt(255) + "," + rndInt(255) + "," + rndInt(255) + ")"
            shops.push(agent)
        } else {
            agent = new Person(0, 0, "red");
            population.push(agent)
        }
        home.addAgent(agent)
        place.addPatch(home)
    }
    place.setNeighbors();
    distance()
}

var draw = function () {
    place.list.forEach(function (home, index) {
        caCanvas.draw(home.xPos, home.yPos, home.color);
        var occupant = home.occupant;
        if (occupant != null) {
            if (occupant.constructor.name == "Shop") {
                caCanvas.drawSquare(home.xPos, home.yPos, "black");
            }
            caCanvas.drawCircle(home.xPos, home.yPos, occupant.color, 4, 1);
        }
    });
    caCanvas.update("canvas");
}

var update = function () {
    chooseShop()
    draw()

    setTimeout(function () {
        window.requestAnimationFrame(update);
    }, 500);

};


setup()
chooseShop()
update()