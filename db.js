const mongoose = require('mongoose');

const dbURI = 'mongodb://127.0.0.1:27017/todolistDB';

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
