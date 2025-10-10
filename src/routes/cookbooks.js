const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const cookbookController = require("../controllers/cookbookController");

const router = express.Router();

// Public Spoonacular routes
router.get("/search", cookbookController.searchRecipes);
router.get("/recipe/:id", cookbookController.getRecipeById);

// Protected CRUD routes for user’s saved recipes
router.get("/", authMiddleware, cookbookController.getUserCookbook);
router.post("/", authMiddleware, cookbookController.addToCookbook);
router.put("/:id", authMiddleware, cookbookController.updateCookbookItem);
router.delete("/:id", authMiddleware, cookbookController.deleteCookbookItem);

module.exports = router;
