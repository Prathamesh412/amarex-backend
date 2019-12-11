var mongoose = require('mongoose');

// Page Schema
var Slider1Schema = mongoose.Schema({
   
    category: {
        type: String,
        required: true
    },
    slug: {
        type: String
    }
});

var Page = module.exports = mongoose.model('Slider1', Slider1Schema);