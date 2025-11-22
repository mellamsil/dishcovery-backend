const rateLimit = require("express-rate-limit");
const config = require("../config/config");

const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // default 15 minutes
  max: config.RATE_LIMIT_MAX || 100, // default 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
});

module.exports = limiter;
