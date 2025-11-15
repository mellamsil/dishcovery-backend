const express = require("express");
const fetch = require("node-fetch");
const Recipe = require("../models/recipe");

const auth = require("../middlewares/auth");
const {
  NotFoundError,
  ForbiddenError,
  InternalServerError,
} = require("../utils/errors");

const router = express.Router();

// Create a new user-added recipe
router.post("/", auth, (req, res) => {
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
    .then((savedRecipe) => res.status(201).json(savedRecipe))
    .catch(() =>
      res
        .status(new InternalServerError("Failed to create recipe").statusCode)
        .json({ message: "Failed to create recipe" })
    );
});

// Get all recipes from Spoonacular (home/search)
router.get("/", (req, res) => {
  const q = req.query.q || "";
  const apiKey = process.env.SPOONACULAR_API_KEY;

  if (!apiKey) return res.json([]);

  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=30&addRecipeInformation=true${
    q ? `&query=${encodeURIComponent(q)}` : ""
  }`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) =>
      res.json(
        Array.isArray(data.results)
          ? data.results.map((r) => ({
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
            }))
          : []
      )
    )
    .catch(() => res.json([]));
});

// Get all recipes created by the logged-in user (Dashboard)
router.get("/saved", auth, (req, res) => {
  console.log(req.user);
  return Recipe.find({ author: req.user.id })
    .sort({ createdAt: -1 })
    .then((recipes) => res.json(recipes))
    .catch(() =>
      res
        .status(
          new InternalServerError("Error fetching saved recipes").statusCode
        )
        .json({ message: "Error fetching saved recipes" })
    );
});

// Get one recipe by ID (MongoDB only)
router.get("/:id", (req, res) =>
  Recipe.findById(req.params.id)
    .populate("author", "name email")
    .then((recipe) =>
      recipe
        ? res.json(recipe)
        : Promise.reject(new NotFoundError("Recipe not found"))
    )
    .catch((err) =>
      res.status(err.statusCode || 500).json({ message: err.message })
    )
);

// Update recipe (author only)
router.put("/:id", auth, (req, res) =>
  Recipe.findById(req.params.id)
    .then((recipe) => {
      if (!recipe) throw new NotFoundError("Recipe not found");
      if (recipe.author.toString() !== req.user.id)
        throw new ForbiddenError("Not authorized");

      const updatedData = {
        title: req.body.title || recipe.title,
        description: req.body.description || recipe.description,
        image:
          req.body.image && req.body.image.trim() !== ""
            ? req.body.image
            : recipe.image,
      };

      return Recipe.findByIdAndUpdate(req.params.id, updatedData, {
        new: true,
      });
    })
    .then((updatedRecipe) => res.json(updatedRecipe))
    .catch((err) =>
      res.status(err.statusCode || 500).json({ message: err.message })
    )
);

// Delete recipe (author only)
router.delete("/:id", auth, (req, res) =>
  Recipe.findById(req.params.id)
    .then((recipe) => {
      if (!recipe) throw new NotFoundError("Recipe not found");
      if (recipe.author.toString() !== req.user.id)
        throw new ForbiddenError("Not authorized");

      return recipe.deleteOne();
    })
    .then(() => res.json({ message: "Recipe deleted successfully" }))
    .catch((err) =>
      res.status(err.statusCode || 500).json({ message: err.message })
    )
);

module.exports = router;
