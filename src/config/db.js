const mongoose = require("mongoose");
const { MONGO_URI, NODE_ENV } = require("./config");

async function connectDB() {
  try {
    const uri = MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    console.log("Connecting to MongoDB...");

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      `MongoDB connected successfully (${NODE_ENV || "development"})`
    );

    // Connection event handlers
    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
    });

    if (NODE_ENV !== "test") {
      mongoose.connection.on("connected", () => {
        console.log("Mongoose connection established");
      });
    }
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
