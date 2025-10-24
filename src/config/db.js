const mongoose = require("mongoose");
const { MONGO_URI, NODE_ENV } = require("./config");

function connectDB() {
  const uri = MONGO_URI || "mongodb://127.0.0.1:27017/dishcovery";

  console.log("Connecting to MongoDB...");

  mongoose
    .connect(uri)
    .then(() => {
      console.log("MongoDB connected:", uri);
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error.message);
      process.exit(1);
    });

  // Handle MongoDB connection events
  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("MongoDB reconnected");
  });

  if (NODE_ENV !== "test") {
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connection established.");
    });
  }
}

module.exports = connectDB;
