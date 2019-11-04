var mongoose = require("mongoose");

var ProductSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    slug:{
        type:String
    },
    description:{
        type:String,
    },
    category:{
        type:String,
        required:true
    },
    image:{
        type:String
    }
});

var Product= module.exports = mongoose.model("Product",ProductSchema);