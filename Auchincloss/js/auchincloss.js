
function SVG(elementName) {
    return document.createElementNS(
        "http://www.w3.org/2000/svg",
        elementName
    );
}

const HIGH = 0;
const LOW = 1;


function setVals() {
    weightPrice = Number(document.getElementById("price").value);
    weightDistance = Number(document.getElementById("distance").value);
    weightHabit = Number(document.getElementById("habit").value);
    weightPreference = Number(document.getElementById("preference").value);
    random = Number(document.getElementById("noise").value) / 100;
    total = weightPrice + weightDistance + weightHabit + weightPreference;
    weightPrice = weightPrice / total
    weightDistance = weightDistance / total
    weightHabit = weightHabit / total
    weightPreference = weightPreference / total
 
    document.getElementById("pricelable").innerHTML = parseFloat(weightPrice).toFixed(2).toLocaleString()
    document.getElementById("distancelable").innerHTML = parseFloat(weightDistance).toFixed(2).toLocaleString()
    document.getElementById("habitlable").innerHTML = parseFloat(weightHabit).toFixed(2).toLocaleString()
    document.getElementById("preferencelable").innerHTML = parseFloat(weightPreference).toFixed(2).toLocaleString()
    document.getElementById("noiselable").innerHTML = parseFloat(random).toFixed(2).toLocaleString()
}



function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
    };
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


function describeArc(x, y, radius, startAngle, endAngle) {
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M",
        start.x,
        start.y,
        "A",
        radius,
        radius,
        0,
        largeArcFlag,
        0,
        end.x,
        end.y,
    ].join(" ");

    return d;
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


function toHTML(e) {
    document.getElementById("shopid").innerHTML = "id:" + e.target.id
    document.getElementById("shoptype").innerHTML = "type:" + shops[e.target.id].getShopType();
    document.getElementById("shopprice").innerHTML = "price:" + shops[e.target.id].getShopPrice();
    document.getElementById("shopcustomers").innerHTML = "Total customers:" + shops[e.target.id].customers;
    document.getElementById("lowcustomers").innerHTML = "Low customers:" + shops[e.target.id].lowCustomers;
    document.getElementById("highcustomers").innerHTML = "High customers:" + shops[e.target.id].highCustomers;
}

class Shop {
    // lowPrice = 0
    // highPrice =  1
    // convenience = 0
    // healthy = 1

    constructor(sClass, price, pos, id) {
        this.customers = 0
        this.sClass = sClass;
        this.highCustomers = 0;
        this.lowCustomers = 0;
        this.price = price;
        this.visits = 0
        this.pos = pos
        this.arc1 = SVG("path");
        this.arc2 = SVG("path");
        this.shape = SVG("g")
        this.highArc = SVG("path")
        this.lowArc = SVG("path")
        this.circle = SVG("circle")
        this.shape.appendChild(this.circle)
        this.circle.setAttribute("id", id)
        this.circle.addEventListener('mouseover', function (e) {
            toHTML(e)
        })
        this.shape.appendChild(this.arc1)
        this.shape.appendChild(this.arc2)
        this.fill = "rgba(255,0,0,0.8)"
        if (this.sClass == 0) {
            if (this.price == 1) {
                this.fill = "rgba(255,0,0,0.4)";
            } else {
                this.fill = "rgba(255,255,0,0.4)";
            }
        } else {
            if (this.price == 1) {
                this.fill = "rgba(0,0,255,0.4)";
            } else {
                this.fill = "rgba(0,255,255,0.4)";
            }
        }
        this.draw()
        
    }


    getShopType() {
        if (this.sClass == 1) {
            return " Healthy foods"
        }
        return " Convenience foods"
    }

    getShopPrice() {
        if (this.price == 1) {
            return "High end foods"
        }
        return " Budget foods"
    }


    draw() {

        this.circle.setAttribute("cx", this.pos.xPos);
        this.circle.setAttribute("cy", this.pos.yPos);
        this.circle.setAttribute("r", 15);

        this.circle.setAttribute("stroke-width", 3)
        this.circle.setAttribute("fill", this.fill);
        let w = 0
        let le = 180
        if (this.customers > 0) {
            w = 3
            le = this.lowCustomers / this.customers * 360
        }

        this.arc1.setAttribute("stroke", "rgba(255,0,0,0.8)")
        this.arc1.setAttribute("stroke-width", w)
        this.arc1.setAttribute("fill", "none")
        this.arc1.setAttribute("d", describeArc(this.pos.xPos, this.pos.yPos, 15, 0, le));
        
        this.arc2.setAttribute("stroke", "rgba(0,0,255,0.8)")
        this.arc2.setAttribute("stroke-width", w)
        this.arc2.setAttribute("fill", "none")
        this.arc2.setAttribute("d", describeArc(this.pos.xPos, this.pos.yPos, 15, le, 360));
    }

    distance(person) {

        let dx = Math.abs(this.pos.xPos - person.home.xPos)
        let dy = Math.abs(this.pos.yPos - person.home.yPos)
        const d = Math.sqrt((dx * dx) + (dy * dy))
        if (d == 0) {
            return 1
        }
        if (person.income == 0) {
            return 1 - (d / (maxSize * 10))
        }
        return 1 - (d / (maxSize * 10))
    }

    preference(person) {
        // if shop is healthy then return the persons food type preference else 1- persons food preference 
        if (this.type == 1) {
            return person.preference
        }
        return 1 - person.preference
    }

    priceTest(person) {
        // if shop low price then return 1
        if (this.price == 0) {
            1
        }
        // if shop high price then return 0.8 if person is high income 0.1 if person is low income
        if (person.income == 0) {
            return 0.1
        }
        return 0.8
    }
}

class Person {
    constructor(sClass, preference, pos) {
        this.sClass = sClass;
        this.shape = SVG("g")
        this.poly = SVG("polygon");
        this.poly.setAttribute("stroke", "black");
        if (this.sClass == 0) {
            this.poly.setAttribute("fill", "rgba(255,0,0,0.5)");
        } else {
            this.poly.setAttribute("fill", "rgba(0,0,255,0.5)");
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
        this.preference = preference
        this.homeSquare = SVG("rect")
        if (this.sClass == 0) {
            this.homeSquare.setAttribute("fill", "rgba(255,0,0,0.3)");
        } else {
            this.homeSquare.setAttribute("fill", "rgba(0,0,255,0.3)");
        }
        this.homeSquare.setAttribute('x', this.pos.xPos);
        this.homeSquare.setAttribute('y', this.pos.yPos);
        this.homeSquare.setAttribute('height', 10);
        this.homeSquare.setAttribute('width', 10);
    }

    setTarget(target) {
        this.target = new Pos(target.xPos, target.yPos);
        let dx = target.dx(this.pos);
        let dy = target.dy(this.pos);
        this.dx = (dx / Math.sqrt(dx * dx + dy * dy)) * 5;
        this.dy = (dy / Math.sqrt(dx * dx + dy * dy)) * 5;

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
        let best = 0
        let choice
        for (let i = 0; i < length; i++) {
            const shop = shops[i]
            // distance 
            const d = shop.distance(this) * weightDistance
            // food preference
            //const f = 0//shop.preference(this) * weightPreference
            // price
            //const w = 0//shop.priceTest(this) 
            // habit
            //const lastVisit = 0//this.previousVisits.lastVisit(shop)
            //let h = 0
            // if (lastVisit >= 0) {
            //     h += (5 - lastVisit) / 5 * weightHabit
            // }

            // noise
            // const r = Math.random() * random
            // select
            const score = d //+ f + w + h + r

            if (score > best) {
                best = score
                choice = shop
            }

        }

        if (choice != null) {
            this.shop = choice
            this.setTarget(this.shop.pos)
            this.previousVisits.add(choice)
        }
    }
}

function reset() {
    frame = SVG("svg");
    frame.setAttribute("width", "400");
    frame.setAttribute("height", "400");
    frame.setAttribute("border-style", "solid");
    frame.setAttribute("id", "svg02");
    container = document.getElementById("display");
    container.innerHTML = "";
    container.append(frame);
    setup()
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
        const shop = new Shop(shopType, price, target, i)
        shops.push(shop)

    }
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {

            const pos = new Pos(x * 10, y * 10);
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
            frame.append(person.homeSquare);
            person.draw()
            person.setTarget(shops[rndInt(shops.length)].pos)
            population.push(person)

        }
    }
    for (let i = 0; i < shops.length; i++) {
        frame.append(shops[i].shape);
    }
}

var updateShop = function(){
    for (let i = 0; i < shops.length; i++) {
        shops[i].customers = 0;
        shops[i].highCustomers = 0;
        shops[i].lowCustomers = 0;
    }
    for (let i = 0; i < population.length; i++) {
        let person = population[i]
        person.setShop(shops);
        person.shop.customers++;
        if (person.sClass == 1) {
            person.shop.highCustomers++;
        } else {
            person.shop.lowCustomers++;
        }
    }
    count++;
    for (let i = 0; i < shops.length; i++) {
        shops[i].draw()
    }
}
var update = function () {
    const d = new Date();
    let stoped = false
    //setVals();
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
            updateShop()
        }
    }


    if (count < 100) {
        setTimeout(function () {
            window.requestAnimationFrame(update);
        }, 1);
    }
};

