const mongoose = require('../db');
// make the schema
const itemsSchema = {
  Name: String,
};
// make the model
const Item = mongoose.model('item', itemsSchema);

module.exports = Item;
