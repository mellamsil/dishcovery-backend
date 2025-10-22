const express = require("express");
const fetch = require("node-fetch");
const Recipe = require("../models/recipe");
const auth = require("../middlewares/auth");

const router = express.Router();

// Create a new user-added recipe
router.post("/", auth, function (req, res) {
  const recipe = new Recipe({
    title: req.body.title || "Untitled Recipe",
    description: req.body.description || "No description provided.",
    image:
      req.body.image && req.body.image.trim() !== ""
        ? req.body.image
        : "https://via.placeholder.com/300x200?text=No+Image",
    author: req.user.id,
  });

  recipe
    .save()
    .then(function (savedRecipe) {
      res.status(201).json(savedRecipe);
    })
    .catch(function (err) {
      console.error("Error creating recipe:", err.message);
      res.status(500).json({
        message: "Failed to create recipe",
        error: err.message,
      });
    });
});

// Get all recipes from Spoonacular (home/search)
router.get("/", function (req, res) {
  const q = req.query.q || "";
  const apiKey = process.env.SPOONACULAR_API_KEY;

  if (!apiKey) return res.json([]);

  let url =
    "https://api.spoonacular.com/recipes/complexSearch?apiKey=" +
    apiKey +
    "&number=30&addRecipeInformation=true";
  if (q) url += "&query=" + encodeURIComponent(q);

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let spoonacularRecipes = [];

      if (data && Array.isArray(data.results)) {
        spoonacularRecipes = data.results.map(function (r) {
          return {
            _id: r.id,
            title: r.title || "Untitled Recipe",
            image:
              r.image && r.image.trim() !== ""
                ? r.image
                : "https://via.placeholder.com/300x200?text=No+Image",
            description: r.summary
              ? r.summary.replace(/<[^>]*>?/gm, "")
              : "No description available.",
            author: null,
          };
        });
      }

      res.json(spoonacularRecipes);
    })
    .catch(function (err) {
      console.error("Error fetching Spoonacular recipes:", err.message);
      res.json([]);
    });
});

// Get all recipes created by the logged-in user (for Dashboard)
router.get("/saved", auth, function (req, res) {
  Recipe.find({ author: req.user.id })
    .sort({ createdAt: -1 })
    .then(function (recipes) {
      res.json(recipes);
    })
    .catch(function (err) {
      console.error("Error fetching saved recipes:", err.message);
      res.status(500).json([]);
    });
});

// Get one recipe by ID (MongoDB only)
router.get("/:id", function (req, res) {
  Recipe.findById(req.params.id)
    .populate("author", "name email")
    .then(function (recipe) {
      if (!recipe) return res.status(404).json({ message: "Recipe not found" });
      res.json(recipe);
    })
    .catch(function (err) {
      console.error("Error fetching recipe:", err.message);
      res.json({});
    });
});

// Update recipe (author only)
router.put("/:id", auth, function (req, res) {
  Recipe.findById(req.params.id)
    .then(function (recipe) {
      if (!recipe) return res.status(404).json({ message: "Recipe not found" });
      if (recipe.author.toString() !== req.user.id)
        return res.status(403).json({ message: "Not authorized" });

      recipe.title = req.body.title || recipe.title;
      recipe.description = req.body.description || recipe.description;
      recipe.image =
        req.body.image && req.body.image.trim() !== ""
          ? req.body.image
          : recipe.image;

      return recipe.save();
    })
    .then(function (updatedRecipe) {
      if (updatedRecipe) res.json(updatedRecipe);
    })
    .catch(function (err) {
      console.error("Error updating recipe:", err.message);
      res.json({});
    });
});

// Delete recipe (author only)
router.delete("/:id", auth, function (req, res) {
  Recipe.findById(req.params.id)
    .then(function (recipe) {
      if (!recipe) return res.status(404).json({ message: "Recipe not found" });
      if (recipe.author.toString() !== req.user.id)
        return res.status(403).json({ message: "Not authorized" });

      return recipe.deleteOne();
    })
    .then(function () {
      res.json({ message: "Recipe deleted successfully" });
    })
    .catch(function (err) {
      console.error("Error deleting recipe:", err.message);
      res.json({});
    });
});

module.exports = router;
