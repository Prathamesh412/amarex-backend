var mongoose = require('mongoose');

// Page Schema
var Slider2Schema = mongoose.Schema({
   
    category: {
        type: String,
        required: true
    },
    slug: {
        type: String
    }
});

var Slider2 = module.exports = mongoose.model('Slider2', Slider2Schema);