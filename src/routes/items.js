const express = require("express");
const itemsController = require("../controllers/items");

const router = express.Router();

// GET all items (optional, for testing)
router.get("/", itemsController.getItems);

// Spoonacular API routes
router.get("/search", itemsController.searchRecipes);
router.get("/:id", itemsController.getRecipeById);

module.exports = router;
