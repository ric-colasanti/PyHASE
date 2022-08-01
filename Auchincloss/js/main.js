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
            const pos = this.dataArray.indexOf(value)
            // test if in array [ if pos -1 then not in array]
            if(pos>=0){
                // remove from position and push in first
                this.dataArray.splice(pos,1)
            }else{
                this.dataArray.pop();
            }
            this.dataArray.unshift(value);
        }
    }
    isMember(value){
        return this.dataArray.indexOf(value)>=0
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
    constructor(price,distance,color){
        this.color = color;
        this.distance = distance;
        this.price = price;
    }
}

class Person {
    constructor(income,xPos,yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.income = income;
        this.previousVisits = new FILOSet(4)
        this.distances=[]
    }
    distance(shops){
        let length = shops.length;
        this.distances=[]
        for(let i=0;i<length;i++){
            const shop = shops[i]
            let d = 1
            let distance = shop.distance(this.xPos,this.yPos)
            if(distance>0){
                d =     1 - (distance/this.income.distance)
            }
            this.distances.push(d)
        }
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
    income=[new IncomeClass(0.8,140,"blue"), new IncomeClass(0.1,35,"red")]
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
            person.distance(shops)
            population.push(person)
        }
    }
    debugDraw()
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
    let length = population.length;
    for(let i=0; i<length;i++){
        let person = population[i]
        caCanvas.drawSquare(person.xPos,person.yPos,person.income.color);
    }
    length = shops.length;
    for(let i=0; i<length;i++){
        let shop = shops[i]
        var col="white"
        if (shop.type==1){col="black"}
        caCanvas.drawCircle(shop.xPos,shop.yPos,col)
    }
    caCanvas.update("canvas");
}



update = function () {
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

