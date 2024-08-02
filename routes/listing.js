const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const Listing =require("../models/listing.js");
const ExpressError =require("../utils/expressError.js");
const {listingSchema} = require("../schema.js");

const validateListing= (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message.join(","))
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
};

//----------all listings-------
router.get("/",wrapAsync (async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    console.log(Listing)
}))

//----------new listing--------
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
})
router.post("/",wrapAsync (async(req,res,next)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","new listing created");
    res.redirect("/listings");
    console.log(newListing);
}))

//-----------reading---------------
router.get("/:id",wrapAsync (async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}))

//--------------edit and update-----------
router.get("/:id/edit",wrapAsync (async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing}) 
}));
router.put("/:id" ,wrapAsync (async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing}).then(res=>{
        console.log("updated");
    }).catch((err)=>{
        console.log(err);
    });
    req.flash("success","listing updated");
    res.redirect("/listings")
}))

//-------------delete------------------
router.delete("/:id",wrapAsync (async(req,res)=>{
    let {id}= req.params;
    let deletedItem = await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted");
    console.log(deletedItem);
    res.redirect("/listings");
}))

module.exports = router;