var mongoose = require('mongoose');

// Page Schema
var Slider4Schema = mongoose.Schema({
   
    category: {
        type: String,
        required: true
    },
    slug: {
        type: String
    }
});

var Slider4 = module.exports = mongoose.model('Slider4', Slider4Schema);