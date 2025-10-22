require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const connectDB = require("./config/db");
const Recipe = require("./models/recipe");

// Connect to MongoDB
connectDB();

const db = mongoose.connection;

db.on("error", (err) =>
  console.error("MongoDB connection error:", err.message)
);

db.once("open", () => {
  console.log("MongoDB connected successfully");

  // Seed sample recipes only if database is empty
  Recipe.countDocuments({})
    .then((count) => {
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
    .then((result) => {
      if (result) console.log("Sample recipes added to the database.");
    })
    .catch((err) =>
      console.error("Error counting or seeding recipes:", err.message)
    );

  // Confirm Spoonacular API key presence
  if (!process.env.SPOONACULAR_API_KEY) {
    console.warn(
      "Warning: SPOONACULAR_API_KEY not found in .env — Spoonacular API calls will fail."
    );
  }

  // Start server
  const PORT = process.env.PORT || 5000;
  const server = http.createServer(app);

  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Free it or change PORT in .env.`
      );
      process.exit(1);
    } else {
      throw err;
    }
  });
});
