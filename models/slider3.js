var mongoose = require('mongoose');

// Page Schema
var Slider3Schema = mongoose.Schema({
   
    category: {
        type: String,
        required: true
    },
    slug: {
        type: String
    }
});

var Slider3 = module.exports = mongoose.model('Slider3', Slider3Schema);