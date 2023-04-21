const mongoose = require('../db');
// make the item schema
const itemsSchema = {
  Name: String,
};
// make list schema
const listSchema = {
  Name: String,
  Items: [itemsSchema],
};

// make the model
const List = mongoose.model('list', listSchema);

module.exports = List;
