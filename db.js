const mongoose = require('mongoose');

require('dotenv').config();

const { dbURI } = process.env;

const connect = () => {
  mongoose
    .connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .finally(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.log('Error connecting to MongoDB', err);
    });
};

const disconnect = () => {
  mongoose.disconnect().finally(() => {
    console.log('Disconnected from MongoDB');
  });
};

module.exports = {
  connect,
  disconnect,
};
