const { log } = require("console");
const mongoose = require("mongoose");


const DBURL = process.env.DB_URL;
const DBConnection = async () => {
  try {
    await mongoose.connect(DBURL);
    log("MongoDB Connected");
  } catch (error) {
    log("Not connected to DB", error);
  }
};

module.exports = DBConnection;
