const app = require('./app');
const mongoose = require('mongoose');

const DB_HOST =
  'mongodb+srv://IlyaLevchenko:45HOIv5ejHF4mWMY@contacts.hlihyqp.mongodb.net/';

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000, () => {
      console.log('"Database connection successful');
    });
  })
  .catch(err => {
    console.log(err.message);
    process.exit(1);
  });
