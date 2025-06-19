const mongoose = require("mongoose");
require("dotenv").config();

const mongooseUri = process.env.MONGODB;

async function initializeData() {
  try {
    await mongoose
      .connect(mongooseUri)
      .then(() => {
        console.log("Database Connected");
      })
      .catch((error) => {
        console.log("Failed to connect DB", error);
      });
  } catch (error) {
    console.log("Connection Failed", error);
  }
}


module.exports = {initializeData}