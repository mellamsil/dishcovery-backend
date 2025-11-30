const express = require("express");
const auth = require("../middlewares/auth");

const {
  getRecipes,
  createRecipe,
  deleteRecipe,
} = require("../controllers/recipesController");

const {
  validateCreateRecipe,
  validateItemId,
} = require("../middlewares/validation");

const router = express.Router();

// Get all recipes for the logged-in user
router.get("/", auth, getRecipes);

// Create a new recipe (with validation)
router.post("/", auth, validateCreateRecipe, createRecipe);

// Delete a recipe by ID (with ID validation)
router.delete("/:itemId", auth, validateItemId, deleteRecipe);

module.exports = router;

// const express = require("express");
// const fetch = require("node-fetch");
// const Recipe = require("../models/recipe");
// const auth = require("../middlewares/auth");
// const config = require("../config/config");
// const {
//   NotFoundError,
//   ForbiddenError,
//   InternalServerError,
// } = require("../utils/errors");

// const router = express.Router();

// // CREATE A NEW USER-ADDED RECIPE
// // POST /api/recipes
// router.post("/", auth, async (req, res, next) => {
//   try {
//     const recipe = new Recipe({
//       title: req.body.title || "Untitled Recipe",
//       description: req.body.description || "No description provided.",
//       image:
//         req.body.image && req.body.image.trim() !== ""
//           ? req.body.image
//           : "https://via.placeholder.com/300x200?text=No+Image",
//       author: req.user.id,
//     });

//     const savedRecipe = await recipe.save();
//     return res.status(201).json(savedRecipe);
//   } catch (err) {
//     console.error("Error creating recipe:", err);
//     return next(new InternalServerError("Failed to create recipe"));
//   }
// });

// // GET ALL RECIPES FROM SPOONACULAR
// // GET /api/recipes?q=...
// router.get("/", async (req, res, next) => {
//   try {
//     const q = req.query.q || "";
//     const apiKey = config.SPOONACULAR_API_KEY;

//     if (!apiKey) return res.json([]);

//     const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=30&addRecipeInformation=true${
//       q ? `&query=${encodeURIComponent(q)}` : ""
//     }`;

//     const response = await fetch(url);
//     const data = await response.json();

//     const recipes = Array.isArray(data.results)
//       ? data.results.map((r) => ({
//           _id: r.id,
//           title: r.title || "Untitled Recipe",
//           image:
//             r.image && r.image.trim() !== ""
//               ? r.image
//               : "https://via.placeholder.com/300x200?text=No+Image",
//           description: r.summary
//             ? r.summary.replace(/<[^>]*>?/gm, "")
//             : "No description available.",
//           author: null,
//         }))
//       : [];

//     return res.json(recipes);
//   } catch (err) {
//     console.error("Error fetching Spoonacular recipes:", err);
//     return next(
//       new InternalServerError("Error fetching recipes from Spoonacular")
//     );
//   }
// });

// // GET ALL RECIPES CREATED BY THE LOGGED-IN USER
// // GET /api/recipes/saved
// router.get("/saved", auth, async (req, res, next) => {
//   try {
//     const recipes = await Recipe.find({ author: req.user.id }).sort({
//       createdAt: -1,
//     });
//     return res.json(recipes);
//   } catch (err) {
//     console.error("Error fetching saved recipes:", err);
//     return next(new InternalServerError("Error fetching saved recipes"));
//   }
// });

// // GET ONE RECIPE BY ID (MongoDB only)
// // GET /api/recipes/:id
// router.get("/:id", async (req, res, next) => {
//   try {
//     const recipe = await Recipe.findById(req.params.id).populate(
//       "author",
//       "name email"
//     );
//     if (!recipe) throw new NotFoundError("Recipe not found");
//     return res.json(recipe);
//   } catch (err) {
//     return next(err);
//   }
// });

// // UPDATE RECIPE (AUTHOR ONLY)
// // PUT /api/recipes/:id
// router.put("/:id", auth, async (req, res, next) => {
//   try {
//     const recipe = await Recipe.findById(req.params.id);
//     if (!recipe) throw new NotFoundError("Recipe not found");
//     if (recipe.author.toString() !== req.user.id)
//       throw new ForbiddenError("Not authorized");

//     const updatedData = {
//       title: req.body.title || recipe.title,
//       description: req.body.description || recipe.description,
//       image:
//         req.body.image && req.body.image.trim() !== ""
//           ? req.body.image
//           : recipe.image,
//     };

//     const updatedRecipe = await Recipe.findByIdAndUpdate(
//       req.params.id,
//       updatedData,
//       { new: true }
//     );

//     return res.json(updatedRecipe);
//   } catch (err) {
//     return next(err);
//   }
// });

// // DELETE RECIPE (AUTHOR ONLY)
// // DELETE /api/recipes/:id
// router.delete("/:id", auth, async (req, res, next) => {
//   try {
//     const recipe = await Recipe.findById(req.params.id);
//     if (!recipe) throw new NotFoundError("Recipe not found");
//     if (recipe.author.toString() !== req.user.id)
//       throw new ForbiddenError("Not authorized");

//     await recipe.deleteOne();
//     return res.json({ message: "Recipe deleted successfully" });
//   } catch (err) {
//     return next(err);
//   }
// });

// module.exports = router;
