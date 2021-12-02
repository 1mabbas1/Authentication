//jshint esversion:6
//require the necessary modules
require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

// set up application
const app = express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
const secret = process.env.SECRET


//create mongoDB database and create schema and model
mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

userSchema.plugin(encrypt, {secret:secret, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

// define various routes
app.get("/", function(req,res){
  res.render("home")
})


app.get("/login", function(req,res){
  res.render("login")
})

app.get("/register", function(req,res){
  res.render("register")
})


app.post("/register", function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if (err){
      console.log(err);
    }else {
      res.render("secrets");
    }
  });

});


app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email:username}, function(err, foundUser){
    if (err){
      console.log(err);
    }else{
      if (foundUser){
        if (foundUser.password === password){
          res.render("secrets");
        }
      }
    }
  });
});















app.listen(3000, function(){
  console.log("Server started");
})