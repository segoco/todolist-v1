const mongoose = require('mongoose');

const dbURI = 'mongodb://127.0.0.1:27017/todolistDB';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(dbURI, options);

mongoose.connection.on('connected', () => {
  console.log(`Mongoose default connection is open to ${dbURI}`);
});

mongoose.connection.on('error', (err) => {
  console.log(`Mongoose default connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

module.exports = mongoose;
