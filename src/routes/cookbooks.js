const express = require("express");
const auth = require("../middlewares/auth");
const cookbookController = require("../controllers/cookbookController");

const router = express.Router();

// Public Spoonacular API routes
router.get("/search", cookbookController.searchRecipes);
router.get("/recipe/:id", cookbookController.getRecipeById);

// Protected user cookbook routes
router.get("/", auth, cookbookController.getUserCookbook);
router.post("/", auth, cookbookController.addToCookbook);
router.put("/:id", auth, cookbookController.updateCookbookItem);
router.delete("/:id", auth, cookbookController.deleteCookbookItem);

module.exports = router;
