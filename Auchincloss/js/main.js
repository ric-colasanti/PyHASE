var size = 50
var caCanvas = new CACanvas(size)
let population =[]
let shops=[]
let numberOfShops = 50;


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

class IncomeClass{
    constructor(price,distance,preferanceLower,preferanceUpper,color){
        this.color = color;
        this.distance = distance;
        this.price = price;
        this.preferanceLower = preferanceLower;
        this.preferanceUpper = preferanceUpper;
    }
}

class Person {
    constructor(income,xPos,yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.homeXPos = xPos;
        this.homeYPos = yPos;
        this.income = income;
        this.previousVisits = new FILOSet(4)
        this.preferance = Math.random()*this.income.preferanceUpper+this.income.preferanceLower;
        this.choice = null
    }

    shop(shops){
        let length = shops.length;
        let best =0
        this.choice = null;
        for(let i=0;i<length;i++){
            const shop = shops[i]
            let distance = shop.distance(this.xPos,this.yPos)
            let score = (1 - (distance/this.income.distance)) * 0.5
            const lastVisit = this.previousVisits.lastVisit(shop)
            if(lastVisit>=0){
                score +=  (5-lastVisit)/5 * 0.1  
            }
            if(score>best){
                best = score
                this.choice = shop
            }
        }
        this.previousVisits.add(this.choice)
    }
}


class Shop{
    constructor(type,xPos,yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.type = type;
    } 
    
    distance( xPos, yPos){
        let dx = Math.abs(this.xPos-xPos)
        let dy = Math.abs(this.yPos-yPos)
        if(dy>size/2){
            dy = size-dy
        }
        if(dx>size/2){
            dx = size-dx
        }
        return Math.sqrt((dx*dx)+(dy*dy))
    }
}



setup = function () {
    population = []
    shops=[]
    income=[new IncomeClass(0.8,140,0.4,1.0,"blue"), new IncomeClass(0.1,35,0.0,0.6,"red")]
    // create shops random placement random type
    for(let i=0;i<numberOfShops;i++){
        const xPos = rndInt(size)
        const yPos = rndInt(size)
        const shopType = rndInt(2)
        shops.push(new Shop(shopType,xPos,yPos))
    }
    // create households grid placment random type
    for(let x=0;x<size;x++){
        for (let y = 0; y < size; y++) {
            incomeType = income[rndInt(2)]
            const person = new Person(incomeType,x,y)
            population.push(person)
        }
    }
    draw();
}



debugDraw = function(){
    let length = population.length
    let person = population[rndInt(length)]
    caCanvas.drawSquare(person.xPos,person.yPos,person.income.color);
    
    length = shops.length;

    for(let i=0; i<length;i++){
        let shop = shops[i]
        if((person.distances[i]>1)||(person.distances[i]<0)){
            console.log(person.distances[i]);
        }

        col = "rgb(0,"+person.distances[i]*255 +",0)"; 
        caCanvas.drawCircle(shop.xPos,shop.yPos,col)
    }
    caCanvas.update("canvas");
    
}


draw = function () {
    let length = shops.length;
    for(let i=0; i<length;i++){
        let shop = shops[i]
        var col="white"
        if (shop.type==1){col="black"}
        caCanvas.drawSquare(shop.xPos,shop.yPos,col)
    }
    length = population.length;
    for(let i=0; i<length;i++){
        let person = population[i]
        caCanvas.drawCircle(person.xPos,person.yPos,person.income.color,3);
    }
    for(let i=0; i<length;i++){
        let person = population[i]
        if(person.choice != null){
           // caCanvas.drawLine(person.xPos,person.yPos,person.choice.xPos,person.choice.yPos)
        }
    }
    caCanvas.update("canvas");
    
}



update = function () {
    let length = population.length;
    for(let i=0; i<length;i++){
        let person = population[i]
        person.shop(shops)
        //person.xPos = person.choice.xPos;
        //person.yPos = person.choice.yPos;
        draw()
        //person.xPos = person.homeYPos;
        //person.yPos = person.homeYPos;
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
update();
update();
update();
update();
update();