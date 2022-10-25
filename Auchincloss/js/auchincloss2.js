var size = 40;
var caCanvas = new CACanvas(size);

var population = []
var shops = []



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
            let distance = Math.sqrt(Math.abs(xdif * xdif + ydif * ydif))
            if (person.sClass == 0) {
                distance = distance * distance
            }
            distance = 1 / distance
            total += distance
            if ((person.sClass == 1) && (shop.sClass == 1)) {
                total += 0.9
            }
            if ((person.sClass == 0) && (shop.sClass == 1)) {
                total *= 0.1
            }
            //console.log(distance,total);
            person.shops.push(shop)
            person.shopsScore.push(total)
        }
    }
}


var chooseShop = function () {
    for (let i = 0; i < shops.length; i++) {
        const shop = shops[i];
        shop.customers = 0
    }
    for (let i = 0; i < population.length; i++) {
        let person = population[i];
        let choice = Math.random() * person.shopsScore[person.shopsScore.length - 1]
        let j = 0
        while (choice > person.shopsScore[j]) {
            j++
        }
        if(person.shops[j].sClass==0){
            person.color = "darkblue"//person.shops[j].color
        }else{
            person.color = "darkred"
        }
        
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
        var sclass = 0
        //if (rndInt(2) == 0) {
        if (i < size * size / 2) {
            home.color = "#dddddd"

        } else {
            home.color = "#aaaaaa"
            sclass = 1
        }
        if (Math.random() < 0.01) {
            agent = new Shop(rndInt(2), 0, i);
            agent.color = "rgb(" + rndInt(255) + "," + rndInt(255) + "," + rndInt(255) + ")"
            shops.push(agent)
        } else {
            agent = new Person(sclass, 0, "red");
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
    });
    for (let i = 0; i < population.length; i++) {
        const person = population[i];
        caCanvas.drawCircle(person.xPos(), person.yPos(), person.color, "black", 4, 1);
    }
    for (let i = 0; i < shops.length; i++) {
        const shop = shops[i];
        color = "darkred"
        if (shop.sClass == 1) {
            color = "darkblue"
        }
        caCanvas.drawCircle(shop.xPos(), shop.yPos(), shop.color, color, -8, 24);
    }
    caCanvas.update("canvas");
}

var count = 0
var update = function () {
    if (count >= 10) {
        var min = 10000
        let lshop = null
        for (let i = 0; i < shops.length; i++) {
            const shop = shops[i];
            if (shop.customers < min) {
                lshop = shop
                min = shop.customers
            }
        }
        if (lshop.sClass == 0 ){
            lshop.sClass=1
        }else{
            lshop.sClass=0
        }
        distance()
        count=0
    }
    chooseShop()
    draw()
    count++
    setTimeout(function () {
        window.requestAnimationFrame(update);
    }, 50);

};


setup()
chooseShop()
update()