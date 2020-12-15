const express = require("express");
const bodyParser = require("body-parser");
const { static } = require("express");
const Date = require(__dirname +"/Date.js");
const app = express();
const _ =require("lodash");
const mongoose = require("mongoose");
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'))
//let items = ["Buy food","Cook food","Eat food"];
// whenever localhost:3000 run it directly fall into app.get("/",funtion(req,res)) than go into get.post
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser: true, useUnifiedTopology: true });
const itemSchema = new mongoose.Schema({
    name:String
})
const Items =mongoose.model("item",itemSchema)
const item1 =new Items({
    name: "add new item"
})
const item2 =new Items({
    name: "hit the + button to add new item"
})
const item3 =new Items({
    name: "<--add another item"
})
const defaultItems=[item1,item2,item3];
const listSchema = new mongoose.Schema({
    name: String,
    item :[itemSchema]
})
const List = mongoose.model("List",listSchema)
app.get("/",function(req,res){
    // res.send("hello");
    // below today.getDay() gives value of index days(sun=0,mon=1....) and today.getDate() gives the date of the day
    const day =Date.getDate();      //here we activate the getDate() by exporting from Date.js (const date = require(__dirname +"/Date.js");)
                          //here day store result of getDate()from Date.js module by return statm.
    // console.log(day);
    Items.find({},function(err,foundItem){
        if(foundItem.length===0){
            Items.insertMany(defaultItems,function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("successfully added item");
                }
            });
            res.render("/");
        }
        else{
            res.render("list",{
                listTitle :day,
                newListItems :foundItem
            });
        }
    });
    
   

 //     if(today.getDay()===6 ||today.getDay()===0){
 //         day = "Weekend"
 //     }else{
 //         day = "weekday"
 //     }
 //     res.render("list", {kindOfDay:day});

});
app.get("/:customListName",function(req,res){
    const customListName =_.capitalize(req.params.customListName);
    List.findOne({name:customListName},function(err,foundlist){
        if(!err){
            if(!foundlist){
                const list =new List({
                    name: customListName,
                    item: defaultItems
               });
               list.save();
               res.redirect("/"+customListName)
            }else{
             res.render("list",{listTitle:foundlist.name, newListItems:foundlist.item})
            }
        }
    })
   


});
app.post("/",function(req,res){
    const itemName =req.body.newitem;
    const listName =req.body.list;
    const Item=new Items({
        name:itemName
    });
     
      if(listName===Date.getDate()){
        Item.save();
        res.redirect("/"); //for inserting item at line code 34
                         
      }
    else{
        List.findOne({name:listName},function(err,foundList){
        foundList.item.push(Item);
        foundList.save();
        res.redirect("/"+listName);
        });
    }
    

     /*let item= req.body.newitem;
     items.push(item);
     */
    
});
app.post("/delete",function(req,res){
    const checkedItemId=req.body.checkbox;
    const listName =req.body.listName;
   if(listName=== Date.getDate()){
    Items.findByIdAndRemove(checkedItemId,function(err){
        if(!err){
            console.log("successfully deleted checked item");
             res.redirect("/");
        }
    });
  }else{
    List.findOneAndUpdate({name: listName}, {$pull: {item: {_id: checkedItemId}}}, function(err, foundList){
        if (!err){
          res.redirect("/" + listName);
        }
      });
  }
})


app.listen(3000,function(){
    console.log("server is running at localhost:3000");
})