//----------BASIC SETUP------------
const express = require("express");
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const path = require("path");
const ejsMate = require('ejs-mate');
const session=  require("express-session");
var flash = require('connect-flash');
var methodOverride = require('method-override');
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended: true}));
app.engine('ejs',ejsMate)
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const sessionOptions= {
    secret:"mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+ 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
    },
};
app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    next()
})

main()
.then(()=>{
    console.log("connection successful with database")
}).catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wonderLust");
}

//-----------SETTING SERVER----------
app.get("/",(req,res)=>{
    res.send("serving");
})
app.listen(port,()=>{
    console.log("listening to server");
})


//----------express router
app.use("/listings",listings)
app.use("/listings/:id/reviews",reviews)


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});

app.use((err,req,res,next)=>{
    let{statusCode=500,message="KUCH GADBAD HAI"} = err;
    res.status(statusCode).render("error.ejs",{message});
    //res.status(statusCode).send(message);
})
