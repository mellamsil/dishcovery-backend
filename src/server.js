require("dotenv").config();

const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const connectDB = require("./config/db");
const Recipe = require("./models/recipe");

// Import routes
const recipesRoutes = require("./routes/recipes");

// Connect to MongoDB
connectDB();

const db = mongoose.connection;

db.on("error", function (err) {
  console.error("MongoDB connection error:", err.message);
});

db.once("open", function () {
  console.log("MongoDB connected successfully");

  // Check if we need to seed sample recipes
  Recipe.countDocuments({})
    .then(function (count) {
      if (count === 0) {
        console.log("Seeding sample recipes...");
        return Recipe.create([
          {
            title: "Spaghetti Carbonara",
            description:
              "Classic Italian pasta with eggs, cheese, and pancetta",
            image: "/placeholder.jpg",
          },
          {
            title: "Avocado Toast",
            description: "Quick breakfast option with avocado and bread",
            image: "/placeholder.jpg",
          },
        ]);
      }
    })
    .then(function (result) {
      if (result) {
        console.log("Sample recipes added to the database.");
      }
    })
    .catch(function (err) {
      console.error("Error counting or seeding recipes:", err.message);
    });

  // Confirm Spoonacular API key is loaded
  if (!process.env.SPOONACULAR_KEY) {
    console.warn(
      "Warning: SPOONACULAR_KEY not found in .env — Spoonacular API calls will fail."
    );
  }

  // Register routes BEFORE starting server ===
  app.use("/api/recipes", recipesRoutes);

  // Start HTTP server
  const PORT = process.env.PORT || 5000;
  const server = http.createServer(app);

  server.listen(PORT, function () {
    console.log("Server running on port " + PORT);
  });

  // Handle server errors
  server.on("error", function (err) {
    if (err.code === "EADDRINUSE") {
      console.error(
        "Port " +
          PORT +
          " is already in use. Please free it or change PORT in your .env file."
      );
      process.exit(1);
    } else {
      throw err;
    }
  });
});
