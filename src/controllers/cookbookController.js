const CookbookItem = require("../models/cookbooks"); // ensure correct file name
const { SPOONACULAR_API_KEY } = require("../config/config");
const fetch = require("node-fetch"); // Remove if Node 18+ with built-in fetch

// Search recipes from Spoonacular API
exports.searchRecipes = (req, res) => {
  const query = req.query.q;
  if (!query)
    return res.status(400).json({ message: "Search query is required." });

  const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
    query
  )}&number=10&apiKey=${SPOONACULAR_API_KEY}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => res.json(data.results || []))
    .catch((err) => {
      console.error("Spoonacular API error:", err.message);
      res
        .status(500)
        .json({ message: "Error fetching recipes from Spoonacular API." });
    });
};

// Get detailed recipe information by ID
exports.getRecipeById = (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: "Recipe ID is required." });

  const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => res.json(data))
    .catch((err) => {
      console.error("Error fetching recipe details:", err.message);
      res.status(500).json({ message: "Error fetching recipe details." });
    });
};

// Get all user's saved cookbook items
exports.getUserCookbook = (req, res) => {
  CookbookItem.find({ userId: req.userId })
    .then((items) => res.json(items))
    .catch((err) => res.status(500).json({ message: err.message }));
};

// Add a new cookbook item
exports.addToCookbook = (req, res) => {
  const { title, description, instructions, notes } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required." });

  const newItem = new CookbookItem({
    userId: req.userId,
    title,
    description,
    instructions,
    notes,
  });

  newItem
    .save()
    .then((saved) => res.json(saved))
    .catch((err) => res.status(500).json({ message: err.message }));
};

// Delete a cookbook item
exports.deleteCookbookItem = (req, res) => {
  CookbookItem.findOneAndDelete({ _id: req.params.id, userId: req.userId })
    .then((deleted) => {
      if (!deleted) return res.status(404).json({ message: "Item not found." });
      res.json({ message: "Deleted successfully." });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

// Update a cookbook item
exports.updateCookbookItem = (req, res) => {
  const { title, description, instructions, notes } = req.body;

  CookbookItem.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { title, description, instructions, notes },
    { new: true }
  )
    .then((updated) => {
      if (!updated) return res.status(404).json({ message: "Item not found." });
      res.json(updated);
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
