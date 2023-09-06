//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose=require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];
//creating db
// mongoose.connect('mongodb://127.0.0.1:27017/todolist');
 mongoose.connect('mongodb+srv://agarwalraunak2000:1YKX4PowFthoifMA@raunak2000.rvtxqaw.mongodb.net/todolistDB');

const itemSchema={
  name:String,
 };
 const item=mongoose.model("Items",itemSchema);
const item1= new item({
  name:"Welcome to your todolist!"
});
const item2= new item({
  name:"Hit the + button to add a new item."
});
const item3= new item({
  name:"<-- Hit this to delete an item."
});

const defaultItem=[item1,item2,item3];

const listSchema=new mongoose.Schema({
  name: String,
  ITEMS: [itemSchema]// as custom list mai multiple items honge na
});
const List=mongoose.model('List',listSchema);


app.get("/", function(req, res) {

item.find().then((data)=>{
if(data.length===0){// jisse sirf pehli bar hi default data enter ho
  item.insertMany(defaultItem).then(function () {
    console.log("Successfully saved defult items to DB");
  }).catch(function (err) {
    console.log(err);
  });
  res.redirect("/");//after inserting data redirect krdiya
}
else{



  res.render("list", {listTitle: "Today", newListItems: data});

}

});



});

app.get("/:customListName",function(req,res){
  const customListName=req.params.customListName;
  List.findOne({name:customListName}).then((foundList)=>{
    if(!foundList){
//create new list
const list=new List({
  name:customListName,
  ITEMS: defaultItem
});

list.save();
res.redirect("/"+customListName);
    }
    else
    res.render("index", {listTitle: foundList.name, newListItems: foundList.ITEMS});

});
  // console.log(req.params.customListName);// / iske bad jo bhi hoga ajayega




});




app.post("/", function(req, res){

  const listname=req.body.list;
  const itemName = req.body.newItem;


  
  
const new_item=new item({
  name:itemName,
});
  

if(listname==="Today"){//ye homeroute vali list hai
new_item.save();

res.redirect("/");
}
else{

  List.findOne({name:listname}).then(function(foundList){

foundList.ITEMS.push(new_item);// jo list mili uske items array mai push kr rhe
foundList.save();
res.redirect("/"+listname);
    });
    
}
  

});

app.post("/delete",function(req,res){
  const checkeditemId=req.body.checkbox;
  const listName=req.body.listName;
  console.log(checkeditemId);
console.log(listName);

if(listName==="Today"){
item.findByIdAndRemove(checkeditemId).then(function(){
  console.log("deleted");
}).catch(function(err){
  console.log(err);
});

res.redirect("/");
}

else{
  List.findOneAndUpdate({name: listName}, {$pull: {ITEMS: {_id: checkeditemId}}}).then(function(){
    console.log('deletedd');
  });


  res.redirect("/"+listName);

}
});



app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
