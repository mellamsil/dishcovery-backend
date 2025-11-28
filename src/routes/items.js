const express = require("express");
const auth = require("../middlewares/auth");

const {
  getItems,
  createItem,
  deleteItem,
  searchRecipes,
  getRecipeById,
} = require("../controllers/itemsController");

const {
  validateCreateItem,
  validateItemId,
} = require("../middlewares/validation");

const router = express.Router();

// Get all items (protected route)
router.get("/", auth, getItems);

// Create item (protected + validated)
router.post("/", auth, validateCreateItem, createItem);

// Delete item by ID (protected + validated)
router.delete("/:itemId", auth, validateItemId, deleteItem);

// Spoonacular public recipe search routes
router.get("/search", searchRecipes);
router.get("/recipe/:id", getRecipeById);

module.exports = router;
