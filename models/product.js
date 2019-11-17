var mongoose = require("mongoose");
const Category = require("./category");
const MainCategory = require("./mainCategory");
const Search = require('./search')
var Schema = mongoose.Schema;

const Product = Search.discriminator('Product', new mongoose.Schema({
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
    mainCategory:{
        type:String,
        required:true
    },
    image:{
        type:String
    }
  }),
);

// var ProductSchema = mongoose.Schema({
//     title:{
//         type:String,
//         required:true
//     },
//     slug:{
//         type:String
//     },
//     description:{
//         type:String,
//     },
//     category:{
//         type:String,
//         required:true
//     },
//     image:{
//         type:String
//     }
// });

// var Product= module.exports = mongoose.model("Product",ProductSchema);

module.exports = mongoose.model('Product');