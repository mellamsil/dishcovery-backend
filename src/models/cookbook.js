const mongoose = require("mongoose");

const cookbookSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    instructions: { type: String, default: "" },
    notes: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

// Prevent OverwriteModelError during development with nodemon
module.exports =
  mongoose.models.Cookbook || mongoose.model("Cookbook", cookbookSchema);
