const express = require("express");
const router = express.Router();
const Cookbook = require("../models/Cookbook");
const authMiddleware = require("../middleware/authMiddleware");

// Get all recipes for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const recipes = await Cookbook.find({ userId: req.userId });
    res.json(recipes);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Add a new recipe
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, instructions, notes, image } = req.body;
    const newRecipe = new Cookbook({
      userId: req.userId,
      title,
      description,
      instructions,
      notes,
      image,
    });
    await newRecipe.save();
    res.json(newRecipe);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update a recipe
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedRecipe = await Cookbook.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!updatedRecipe) return res.status(404).send("Recipe not found");
    res.json(updatedRecipe);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete a recipe
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedRecipe = await Cookbook.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!deletedRecipe) return res.status(404).send("Recipe not found");
    res.json({ message: "Recipe deleted" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
