const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
const connectDB = require("./config/db");

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to DB
connectDB(); // Or use mongoose.connect(...) directly here if you prefer

// Create HTTP server
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Safe port handling
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Free the port or change PORT in .env`
    );
    process.exit(1);
  } else {
    throw err;
  }
});
