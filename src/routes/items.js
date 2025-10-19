const express = require("express");
const itemsController = require("../controllers/items");
const auth = require("../middlewares/auth"); // make sure you have auth middleware

const {
  validateCreateItem,
  validateItemId,
} = require("../middlewares/validation");

const router = express.Router();

// GET all items (for the logged-in user)
router.get("/", auth, itemsController.getItems);

// POST create new item
router.post("/", auth, validateCreateItem, itemsController.createItem);

// DELETE an item by ID
router.delete("/:itemId", auth, validateItemId, itemsController.deleteItem);

// Spoonacular API routes
router.get("/search", itemsController.searchRecipes);
router.get("/recipe/:id", itemsController.getRecipeById); // changed to /recipe/:id to avoid conflict with /:itemId

module.exports = router;
