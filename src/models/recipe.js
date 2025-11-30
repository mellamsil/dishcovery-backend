const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    ingredients: { type: String, required: true }, // stored as string for simplicity
    instructions: { type: String, required: true },
    notes: { type: String, default: "" },
    cuisine: { type: String, default: "" },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
