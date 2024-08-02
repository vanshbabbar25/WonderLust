const { types, string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose= require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type: string,
        required: true
    }
})
User.plugin(passportLocalMongoose); //automatically username,password,hashing and kuch methods ho jaegi isse
module.exports = mongoose.model('User',userSchema);