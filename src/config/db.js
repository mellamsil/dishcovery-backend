const mongoose = require("mongoose");
const { MONGO_URI, NODE_ENV } = require("./config");

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected: ${MONGO_URI}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit process if DB fails
  }
};

// In test environments, don’t log extra stuff
if (NODE_ENV !== "test") {
  mongoose.connection.on("disconnected", () =>
    console.warn("MongoDB disconnected")
  );
}

module.exports = connectDB;
