const mongoose = require("mongoose");
const mongoHost = process.env.IS_DOCKER ? process.env.MONGO_HOST : "localhost";
const mongoPort = process.env.IS_DOCKER ? process.env.MONGO_PORT : "27017";
const mongoDB = process.env.MONGO_DB || "vpb";
const mongoURL = `mongodb://${mongoHost}:${mongoPort}/${mongoDB}`;
let db;

async function setup() {
  if (db) {
    return;
  }

  try {
    await mongoose.connect(
      mongoURL,
      {
        useNewUrlParser: true
      }
    );
    db = mongoose.connection;
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

setup();

module.exports = db;
