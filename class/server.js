const express = require("express");
const app = express();
const port = 3000;
var flash = require('connect-flash');
const session=  require("express-session");
app.use(session({secret:"mysupersecretstring"}))
app.use(flash())
const path = require("path");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

app.get("/test",(req,res)=>{
    res.send("serving");
})
app.get("/register",(req,res)=>{
    let {name = "anonymous"}= req.query;
    req.session.name = name
    req.flash("success","user registered successfully")
    res.redirect("/hello");
})

app.get("/hello",(req,res)=>{
    res.locals.message = req.flash("success")
    res.render("pae.ejs",{name:req.session.name});
})

app.listen(port,()=>{
    console.log("listening to server");
})