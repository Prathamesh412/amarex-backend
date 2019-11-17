var mongoose = require("mongoose");

const baseOptions = {
    discriminatorKey: 'itemtype', // our discriminator key, could be anything
    collection: 'items', // the name of our collection
  };
  
  // Our Base schema: these properties will be shared with our "real" schemas
  const Search = mongoose.model('Search', new mongoose.Schema({
        title: { type: String, required: true }
      }, baseOptions,
    ),
  );
  
  module.exports = mongoose.model('Search');