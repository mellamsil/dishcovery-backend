const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const cookbookRoutes = require("./routes/cookbook");
const authMiddleware = require("./middleware/authMiddleware");

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/dishcovery")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/cookbook", cookbookRoutes);

app.get("/", (req, res) => res.send("Welcome to Dishcovery API"));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
