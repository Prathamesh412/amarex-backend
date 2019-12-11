var mongoose = require('mongoose');

// Page Schema
var CatalogueSchema = mongoose.Schema({
   
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    file: {
        type: String,
        required: true
    }
});

var Catalogue = module.exports = mongoose.model('Catalogue', CatalogueSchema);



