require('dotenv/config');
const mongoose = require("mongoose");

const {
  APP_URL,
  APP_PORT,
  DB_DATABASE,
  DB_HOSTNAME,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD
} = process.env;
  
  mongoose.connect(
    `mongodb://${DB_HOSTNAME}:${DB_PORT}/${DB_DATABASE}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(result => {
      console.log('MongoDB Connect!!!');
    })
    .catch(error => {
      console.log('MongoDB Fail!!!');
    });

    console.log(`Setup TeaBag [ON]: ${APP_URL}:${APP_PORT}`);
