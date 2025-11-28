require("dotenv").config(); // Load env vars first
const fs = require("fs");
const https = require("https");
const http = require("http");
const path = require("path");
const app = require("./app");
const connectDB = require("./config/db");
const Recipe = require("./models/recipe");

const {
  PORT = 5000,
  NODE_ENV,
  SPOONACULAR_API_KEY,
  SSL_KEY_PATH,
  SSL_CERT_PATH,
} = require("./config/config");

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log(" MongoDB connected successfully");

    // Seed sample recipes (only if empty)
    const recipeCount = await Recipe.countDocuments();
    if (recipeCount === 0) {
      console.log(" Seeding sample recipes...");
      await Recipe.create([
        {
          title: "Spaghetti Carbonara",
          description: "Classic Italian pasta with eggs, cheese, and pancetta",
          imageUrl: "/placeholder.jpg",
        },
        {
          title: "Avocado Toast",
          description: "Quick breakfast with avocado on bread",
          imageUrl: "/placeholder.jpg",
        },
      ]);
      console.log("Sample recipes added");
    }

    // Warn if external API key is missing
    if (!SPOONACULAR_API_KEY) {
      console.warn(
        "⚠ SPOONACULAR_API_KEY missing — External API calls will fail."
      );
    }

    let server;

    if (NODE_ENV === "production") {
      console.log("Starting server in PRODUCTION mode (HTTPS)");

      if (!SSL_KEY_PATH || !SSL_CERT_PATH) {
        console.error(
          "SSL_KEY_PATH or SSL_CERT_PATH is missing in .env. Cannot launch HTTPS server."
        );
        process.exit(1);
      }

      // Load SSL certificates
      const credentials = {
        key: fs.readFileSync(path.resolve(SSL_KEY_PATH)),
        cert: fs.readFileSync(path.resolve(SSL_CERT_PATH)),
      };

      server = https.createServer(credentials, app);
    } else {
      console.log("Starting server in DEVELOPMENT mode (HTTP)");
      server = http.createServer(app);
    }

    // Listen on PORT
    server.listen(PORT, () => {
      console.log(
        `${NODE_ENV === "production" ? "HTTPS" : "HTTP"} server running on port ${PORT}`
      );
    });

    // Handle startup errors
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use.`);
      } else {
        console.error("Server error:", err);
      }
      process.exit(1);
    });
  } catch (err) {
    console.error("Server startup failed:", err);
    process.exit(1);
  }
}

// Start the server
startServer();

// Handle runtime errors gracefully
process.on("unhandledRejection", (reason, promise) => {
  console.error(" Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception thrown:", err);
  process.exit(1);
});
