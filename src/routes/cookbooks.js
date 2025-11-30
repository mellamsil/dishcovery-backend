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

// const express = require("express");
// const auth = require("../middlewares/auth");
// const Cookbook = require("../models/cookbook");
// const cookbookController = require("../controllers/cookbookController");

// const router = express.Router();

// // Public Spoonacular API routes
// router.get("/search", cookbookController.searchRecipes);
// router.get("/recipe/:id", cookbookController.getRecipeById);

// // Protected user cookbook routes
// router.get("/", auth, cookbookController.getUserCookbook);

// // Add recipe to user cookbook
// router.post("/", auth, (req, res) => {
//   const userId = req.user.id;
//   const recipeData = req.body;

//   Cookbook.create({ ...recipeData, user: userId })
//     .then((recipe) => {
//       res.status(201).json(recipe);
//     })
//     .catch((err) => {
//       res
//         .status(500)
//         .json({ message: "Error saving recipe", error: err.message });
//     });
// });

// router.put("/:id", auth, cookbookController.updateCookbookItem);
// router.delete("/:id", auth, cookbookController.deleteCookbookItem);

// module.exports = router;
