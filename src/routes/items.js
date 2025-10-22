const express = require("express");
const itemsController = require("../controllers/items");
const auth = require("../middlewares/auth");
const {
  validateCreateItem,
  validateItemId,
} = require("../middlewares/validation");

const router = express.Router();

// Get all items for the logged-in user
router.get("/", auth, itemsController.getItems);

// Create a new item
router.post("/", auth, validateCreateItem, itemsController.createItem);

// Delete an item by ID
router.delete("/:itemId", auth, validateItemId, itemsController.deleteItem);

// Spoonacular recipe API routes (public)
router.get("/search", itemsController.searchRecipes);
router.get("/recipe/:id", itemsController.getRecipeById);

module.exports = router;
