//Create variables here
var dogImg,happyDog;
var dataBase,foodS;
var foodStock;
var foodObj,lastFed;
var bedroomImg,washroomImg,gardenImg;
function preload()
{
  //load images here
  dogImg=loadImage("images/dogImg.png");
  happyDog=loadImage("images/dogImg1.png");
  bedroomImg=loadImage("images/Bed Room.png");
  washroomImg=loadImage("images/Wash Room.png");
 gardenImg=loadImage("images/Garden.png");
}

function setup() {
	database=firebase.database();
    createCanvas(1000,500);
    foodObj=new Food();
    foodStock=database.ref('Food');
    foodStock.on("value",readStock);
    dog = createSprite(800,200,150,150);
    dog.addImage(dogImg);
    dog.scale=0.15;
    
     
    feed=createButton("Feed the dog");
    feed.position(700,95);
    feed.mousePressed(feedDog);
  
    addFood=createButton("Add Food");
    addFood.position(800,95);
    addFood.mousePressed(addFoods);

    fedTime=database.ref('FeedTime');
fedTime.on("value",function(data){
  lastFed=data.val();
});


 readState=database.ref('gameState');
 readState.on("value",function(data){
   gameState=data.val();
 });
}


function draw() { 
foodObj.display();
currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }

 if(gameState!="Hungry"){
   feed.hide();
   addFood.hide();
    }else{
   feed.show();
   addFood.show();
   dog.addImage(dogImg);
 }

 if(currentTime===lastFed){
  dog.addImage(dogImg);
}
else{
dog.addImage(happyDog);
}

drawSprites();
}
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}
function feedDog(){
  dog.addImage(happyDog);
  
  
    
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
function update(state){
database.ref('/').update({
  gameState:state
})
}