
require('dotenv').config();
// Above is for level 3 encryption with environment variable
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect("mongodb://127.0.0.1:27017/userDB")
.then(()=>console.log("Connected successfuly."))
.catch((err)=>console.log(err))

const userSchema = new mongoose.Schema({
    email:String,
    password:String
})
// Level2 enryption using mongoose by encrypting specific field 'password';

userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields: ['password']});

const User = mongoose.model("User",userSchema);

app.get("/", function(req,res){
    res.render("home");
})

app.get("/register", function(req,res){
    res.render("register");
})

app.get("/login", function(req,res){
    res.render("login");
})

// Level one authentication with username and password:
app.post("/register", function (req,res){
    const userEmail = req.body.username;
    const userPassword = req.body.password;
    const user1 = new User({
        email:userEmail,
        password:userPassword
    });
    user1.save()
    .then(()=>res.render("secrets"))
    .catch((err)=> console.log(err))
});
app.post("/login", function (req,res){
    const userEmail = req.body.username;
    const userPassword = req.body.password;
    User.findOne({email:userEmail,password:userPassword})
    .then(()=>res.render("secrets"))
    .catch((err)=>console.log(err))
});

app.listen(3000,function(){
  console.log( "Server launched on port 3000!");
})