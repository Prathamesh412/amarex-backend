var mongoose = require("mongoose");
const Search = require('./search');

const Category = Search.discriminator('Category', new mongoose.Schema({
    slug:{
        type:String
    },
    mainCategory:{
        type:String,
        required:true
    }
  }),
);

// var CategorySchema = mongoose.Schema({
//     _id:String,
//     title:{
//         type:String,
//         required:true
//     },
//     slug:{
//         type:String
//     }
// });

// var Category = module.exports = mongoose.model("Category",CategorySchema);

module.exports = mongoose.model('Category');