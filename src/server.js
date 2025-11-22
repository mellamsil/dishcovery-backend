const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const connectDB = require("./config/db");
const Recipe = require("./models/recipe");
const { PORT, MONGO_URI, SPOONACULAR_API_KEY } = require("./config/config");

// Connect to MongoDB
connectDB(MONGO_URI);

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
  return null;
});

db.once("open", () => {
  console.log("MongoDB connected successfully");

  // Seed sample recipes if database is empty
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
      return null;
    })
    .then((result) => {
      if (result) console.log("Sample recipes added to the database.");
    })
    .catch((err) =>
      console.error("Error counting or seeding recipes:", err.message)
    );

  // Confirm Spoonacular API key presence
  if (!SPOONACULAR_API_KEY) {
    console.warn(
      "Warning: SPOONACULAR_API_KEY not found in .env — Spoonacular API calls will fail."
    );
  }

  // Start server
  const server = http.createServer(app);

  server.listen(PORT, "0.0.0.0", () =>
    console.log(`Server running on port ${PORT}`)
  );

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

  return null;
});
