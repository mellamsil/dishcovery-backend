const mongoose = require("mongoose");

const cookbookSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  instructions: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  image: String,
});

// Prevent OverwriteModelError during development with nodemon
module.exports =
  mongoose.models.Cookbook || mongoose.model("Cookbook", cookbookSchema);
