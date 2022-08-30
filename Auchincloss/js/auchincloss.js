
function SVG(elementName) {
    return document.createElementNS(
        "http://www.w3.org/2000/svg",
        elementName
    );
}

function getAngleDegrees(fromX, fromY, toX, toY, force360 = true) {
    let deltaX = fromX - toX;
    let deltaY = fromY - toY; // reverse
    let radians = Math.atan2(deltaY, deltaX);
    let degrees = (radians * 180) / Math.PI - 90; // rotate
    if (force360) {
        while (degrees >= 360) degrees -= 360;
        while (degrees < 0) degrees += 360;
    }
    return degrees;
}

function rndInt(maxVal) {
    return Math.floor(Math.random() * maxVal);
}




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



class Pos {
    constructor(xPos, yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
    }

    move(dx, dy) {
        this.xPos += dx;
        this.yPos += dy;
    }

    dx(point) {
        return this.xPos - point.xPos;
    }
    dy(point) {
        return this.yPos - point.yPos;
    }
}


class Shop {
    constructor(sClass, price, pos) {
        this.customers = 0
        this.sClass = sClass;
        this.highCustomers = 0;
        this.lowCustomers = 0;
        this.price = price;
        this.visits = 0
        this.pos = pos

        this.shape = SVG("g")
        this.highArc = SVG("path")
        this.lowArc = SVG("path")
        this.circle = SVG("circle")
        this.circle.setAttribute("cx", this.pos.xPos);
        this.circle.setAttribute("cy", this.pos.yPos);
        this.circle.setAttribute("r", 15);
        this.circle.setAttribute("fill", "rgba(255,0,0,0.3)");
        this.circle.setAttribute("stroke-width", 5)
        this.circle.setAttribute("stroke", "rgba(0,0,0,1)");
        this.shape.appendChild(this.circle)
    }

    distance(person) {
        let dx = Math.abs(this.pos.xPos - person.pos.xPos)
        let dy = Math.abs(this.pos.yPos - person.pos.yPos)
        // if (dy > size / 2) {
        //     dy = size - dy
        // }
        // if (dx > size / 2) {
        //     dx = size - dx
        // }
        const d = Math.sqrt((dx * dx) + (dy * dy))
        //console.log(d);
        if (d == 0) {
            return 1
        }
        if (person.income == 0) {
            return 1 - (d / maxSize * relativeTransportCost)
        }
        return 1 - (d / maxSize)
    }

    preferance(person) {
        if (this.type == 1) {
            return person.preferance
        }
        return 1 - person.preferance
    }

    priceTest(person) {
        if (this.price == 0) {
            return weightPrice
        }
        if (person.income == 0) {
            return 0.1
        }
        return 0.8
    }
}

class Person {
    constructor(sClass, preferance, pos) {
        this.sClass = sClass;
        this.shape = SVG("g")
        this.poly = SVG("polygon");
        this.poly.setAttribute("stroke", "black");
        if (this.sClass == 0) {
            this.poly.setAttribute("fill", "red");
        } else {
            this.poly.setAttribute("fill", "blue");
        }
        let array = [
            [0, -10],
            [10, 10],
            [0, 5],
            [-10, 10],
        ];
        for (let value of array) {
            let point = frame.createSVGPoint();
            point.x = value[0];
            point.y = value[1];
            this.poly.points.appendItem(point);
        }
        this.shape.appendChild(this.poly)
        this.home = new Pos(pos.xPos, pos.yPos);
        this.pos = pos;
        this.target = null;
        this.deg = 0;
        this.atTarget = false;
        this.previousVisits = new FILOSet(4)
        this.preferance = preferance
    }

    setTarget(target) {
        this.target = new Pos(target.xPos, target.yPos);
        let dx = target.dx(this.pos);
        let dy = target.dy(this.pos);
        this.dx = (dx / Math.sqrt(dx * dx + dy * dy)) * 3;
        this.dy = (dy / Math.sqrt(dx * dx + dy * dy)) * 3;

        this.deg = getAngleDegrees(
            this.pos.xPos,
            this.pos.yPos,
            this.target.xPos,
            this.target.yPos,
            false
        );
    }

    distance(xPos, yPos) {
        let dx = Math.abs(this.xPos - xPos);
        let dy = Math.abs(this.yPos - yPos);
        return Math.sqrt(dx * dx + dy * dy);
    }

    draw() {
        this.shape.setAttribute(
            "transform",
            "translate(" +
            this.pos.xPos +
            "," +
            this.pos.yPos +
            ") rotate(" +
            this.deg +
            " " +
            0 +
            " " +
            0 +
            " ) scale(0.5,0.5)"
        );
    }

    move() {
        if (
            Math.abs(this.pos.xPos - this.target.xPos) > 4 ||
            Math.abs(this.pos.yPos - this.target.yPos) > 4
        ) {
            this.atTarget = false;
            this.pos.move(this.dx, this.dy);
            this.draw();
        } else {
            this.atTarget = true;
        }
    }

    setShop(shops, workings = false) {
        let length = shops.length;
        console.log(length);
        let best = 0
        let score = 0
        let choice = null;
        for (let i = 0; i < length; i++) {
            const shop = shops[i]
            // distance weight 0.5
            const d = shop.distance(this) * weightDistance
            // food preferance
            const f = shop.preferance(this) * weightPreferance
            // price
            const w = shop.priceTest(this) * weightPrice
            // habit
            const lastVisit = this.previousVisits.lastVisit(shop)
            let h = 0
            if (lastVisit >= 0) {
                h += (5 - lastVisit) / 5 * weightHabit
            }

            // noise
            const r = Math.random() * random
            // select
            score = d + f + w + h + r
            if (d<0) {
                //console.log(shop.pos.xPos, shop.pos.yPos, d.toFixed(2), f.toFixed(2), w.toFixed(2), h.toFixed(2), r.toFixed(2), score.toFixed(2),best);               
                console.log(d,score.toFixed(2),best);
            }
            if (score > best) {
                best = score
                choice = shop
            }

        }
        if (workings) {
            console.log(this.choice.xPos, this.choice.yPos, best.toFixed(2));
        }
        if (choice != null) {
            this.shop = choice
            this.setTarget(this.shop.pos)
            console.log(choice.pos.xPos, choice.pos.yPos);
            this.previousVisits.add(choice)
        }
        // this.shop = shops[rndInt(shops.length)]
        // this.setTarget(this.shop.pos)
    }
}



var setup = function (populationNumber) {
    population = []
    shops = []
    // create shops random placement random type
    for (let i = 0; i < numberOfShops; i++) {

        const shopType = rndInt(2)
        const price = rndInt(2)
        const xPos = rndInt(size - 2) + 2;
        const yPos = rndInt(size - 2) + 2;
        const target = new Pos(xPos * 10, yPos * 10)
        const shop = new Shop(shopType, price, target)
        shops.push(shop)
        frame.append(shop.shape);
    }

    for (let i = 0; i < populationNumber; i++) {
        const xPos = rndInt(size - 1) + 1;
        const yPos = rndInt(size - 1) + 1;
        const pos = new Pos(xPos * 10, yPos * 10);
        const income = rndInt(2)
        let person = null
        if (income == 0) {
            const pref = Math.random() * 0.6
            person = new Person(0, pref, pos)
        } else {
            const pref = Math.random() * 0.6 + 0.4
            person = new Person(1, pref, pos)
        }
        frame.append(person.shape);
        person.draw()
        person.setTarget(shops[rndInt(shops.length)].pos)
        population.push(person)
    }
}

var update = function () {
    const d = new Date();
    let stoped = false
    if (d.getTime() - time > 1000) { /// delay update
        stoped = true
        for (let i = 0; i < population.length; i++) {
            let person = population[i];
            person.move();
            if (person.atTarget == false) {
                stoped = false
            }
        }
        if (stoped == true) {
            let length = population.length;
            for (let i = 0; i < length; i++) {
                let person = population[i]
                person.setShop(shops);
            }
        }

    }


    setTimeout(function () {
        window.requestAnimationFrame(update);
    }, 1);
};


var frame = SVG("svg");
frame.setAttribute("width", "500");
frame.setAttribute("height", "500");
frame.setAttribute("border-style", "solid");
frame.setAttribute("id", "svg02");
var container = document.getElementById("display");
container.appendChild(frame);

let population = []; // list of agents
let shops = []
const size = 50;
const maxSize = Math.sqrt(50*50+50*50)
const relativeTransportCost = 5;
let numberOfShops = 20;
var weightPrice = 0.2;
var weightDistance = 0.5;
var weightHabit = 0.1;
var weightPreferance = 0.2;
var random = 1;

const d = new Date();
let time = d.getTime();
setup(300)
update()