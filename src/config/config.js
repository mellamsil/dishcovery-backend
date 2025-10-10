require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dishcovery",
  JWT_SECRET: process.env.JWT_SECRET || "super-secret-key",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS || 60000,
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX || 100,
  NODE_ENV: process.env.NODE_ENV || "development",
  SPOONACULAR_API_KEY: process.env.SPOONACULAR_API_KEY || "",
};
