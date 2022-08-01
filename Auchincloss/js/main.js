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


class Person {
    constructor(income,xPos,yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.income = income;
        this.previousVisits = new FILOSet(4)
    }
}


class Shop{
    constructor(type,xPos,yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.type = type;
    }   
}



setup = function () {
    population = []
    shops=[]
    for(let i=0;i<numberOfShops;i++){
        shops.push(new Shop(rndInt(2),rndInt(size),rndInt(size)))
    }
    for(let x=0;x<size;x++){
        for (let y = 0; y < size; y++) {
            population.push(new Person(rndInt(2),x,y))
        }
    }
    draw()
}


draw = function () {
    var bCol = "#000000";
    //caCanvas.clear(bCol);
    population.forEach(function (person, index) {
        var col = "#ff0000"
        if (person.income == 1 ){ col = "#0000ff"} 
        caCanvas.drawSquare(person.xPos,person.yPos, col);
    })
    shops.forEach(function(shop,index){
        var col="white"
        if (shop.type==1){col="black"}
        caCanvas.drawCircle(shop.xPos,shop.yPos,col)
    })
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

