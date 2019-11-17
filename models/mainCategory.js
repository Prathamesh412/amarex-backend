var mongoose = require("mongoose");
const Search = require('./search');

const MainCategory = Search.discriminator('MainCategory', new mongoose.Schema({
    slug:{
        type:String
    }
  }),
);

module.exports = mongoose.model('MainCategory');