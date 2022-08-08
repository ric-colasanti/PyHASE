var size = 50
var caCanvas = new CACanvas(size)
let population =[]
let shops=[]
let numberOfShops = 50;
const weightPrice = 0.2
const weightDistance = 0.5
const weightHabit = 0.1
const weightPreferance = 0.2


class FILOSet{
    constructor(size){
        this.dataArray=[];
        this.size = size;
    }

    add(value){
        // test if the set is full
        if(this.dataArray.length<this.size){
            this.dataArray.unshift(value);
        }else{
            // if not get index of new element
            this.dataArray.pop();
            this.dataArray.unshift(value);
        }
    }
    lastVisit(value){
        return this.dataArray.indexOf(value)
    }

    toString(){
        let s = "";
        for ( let d in this.dataArray){
            s+= this.dataArray[d].toString()+" ";
        }
        return s;
    }
}



class Person {
    constructor(income,preferance,xPos,yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.homeXPos = xPos;
        this.homeYPos = yPos;
        this.income = income;
        this.previousVisits = new FILOSet(4)
        this.preferance = preferance
        this.choice = null
    }

    shop(shops){
        let length = shops.length;
        let best =0
        this.choice = null;
        for(let i=0;i<length;i++){
            const shop = shops[i]
            // distance weight 0.5
            let score = shop.distance(this) * weightDistance
            // food preferance
            score += shop.preferance(this) * weightPreferance
            // price
            score += shop.priceTest(this) * weightPrice
            // habit
            const lastVisit = this.previousVisits.lastVisit(shop)
            if(lastVisit>=0){
                score +=  (5-lastVisit)/5 * weightHabit
            }
            
            // noise
            score+= Math.random()*0.1
            // select
        
            if(score>best){
                best = score
                this.choice = shop
            }
        }
        
        this.previousVisits.add(this.choice)
    }
}


class Shop{
    constructor(xPos,yPos,type,price) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.type = type;
        this.price = price;
        this.visits = 0
    } 
    
    distance(person){
        let dx = Math.abs(this.xPos-person.xPos)
        let dy = Math.abs(this.yPos-person.yPos)
        if(dy>size/2){
            dy = size-dy
        }
        if(dx>size/2){
            dx = size-dx
        }
        const d = Math.sqrt((dx*dx)+(dy*dy))
        if(d==0){
            return 1
        } 
        if(person.income==0){
            return 1-(d/130) 
        }
        return 1- d/30 
    }

    preferance(person){
        if(this.type==1){
            return person.preferance 
        }
        return 1-person.preferance 
    }

    priceTest(person){
        if(this.price == 0){
            return weightPrice
        }
        if(person.income==0){
            return 0.1 
        }
        return 0.8 
    }
}



setup = function () {
    population = []
    shops=[]
    // create shops random placement random type
    for(let i=0;i<numberOfShops;i++){
        const xPos = rndInt(size)
        const yPos = rndInt(size)
        const shopType = rndInt(2)
        const price = rndInt(2)
        shops.push(new Shop(xPos,yPos,shopType,price))
    }
    // create households grid placment random type
    for(let x=0;x<50;x++){
        for (let y = 0; y < 50; y++) {
            const income = rndInt(2)
            let person = null
            if(income==0){
                const pref = Math.random()*0.6
                person = new Person(0,pref,x,y)
            }else{
                const pref = Math.random()*0.6+0.4
                person = new Person(1,pref,x,y)
            }
            population.push(person)
        }
    }
    draw();
}




draw = function () {
    caCanvas.clear("lightgrey")
    let length = shops.length;
    for(let i=0; i<length;i++){
        let shop = shops[i]
        var col="red"
        if (shop.type==1){col="blue"}
        caCanvas.drawSquare(shop.xPos,shop.yPos,col)
    }
    length = population.length;
    for(let i=0; i<length;i++){
        let person = population[i]
        let col ="red"
        if(person.income == 0){
            col = "green"
        }else{
            col = "orange"
        }
        caCanvas.drawCircle(person.xPos,person.yPos,col,2);
    }
    
    caCanvas.update("canvas");
}



update = function () {
    let length = population.length;
    for(let i=0; i<length;i++){
        let person = population[i]
        person.shop(shops)
    }
    draw();
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
//update();
