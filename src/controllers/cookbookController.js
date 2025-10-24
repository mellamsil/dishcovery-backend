const fetch = require("node-fetch");
const CookbookItem = require("../models/cookbook");
const { SPOONACULAR_API_KEY } = require("../config/config");

// Search recipes from Spoonacular API
exports.searchRecipes = function (req, res) {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ message: "Search query is required." });
  }

  const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
    query
  )}&number=10&apiKey=${SPOONACULAR_API_KEY}`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => res.json(data.results || []))
    .catch((err) => {
      console.error("Spoonacular API error:", err.message);
      return res
        .status(500)
        .json({ message: "Error fetching recipes from Spoonacular API." });
    });
};

// Get detailed recipe information by ID
exports.getRecipeById = function (req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Recipe ID is required." });
  }

  const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => res.json(data))
    .catch((err) => {
      console.error("Error fetching recipe details:", err.message);
      return res
        .status(500)
        .json({ message: "Error fetching recipe details." });
    });
};

// Get all user's saved cookbook items
exports.getUserCookbook = function (req, res) {
  return CookbookItem.find({ userId: req.userId }, (err, items) => {
    if (err) {
      console.error("Error fetching cookbook items:", err.message);
      return res
        .status(500)
        .json({ message: "Error fetching cookbook items." });
    }
    return res.json(items);
  });
};

// Add a new cookbook item
exports.addToCookbook = function (req, res) {
  const { title, description, instructions, notes } = req.body;
  if (!title) {
    return res.status(400).json({ message: "Title is required." });
  }

  const newItem = new CookbookItem({
    userId: req.userId,
    title,
    description,
    instructions,
    notes,
  });

  return newItem.save((err, savedItem) => {
    if (err) {
      console.error("Error saving cookbook item:", err.message);
      return res.status(500).json({ message: "Error saving cookbook item." });
    }
    return res.status(201).json(savedItem);
  });
};

// Delete a cookbook item
exports.deleteCookbookItem = function (req, res) {
  return CookbookItem.findOneAndDelete(
    { _id: req.params.id, userId: req.userId },
    (err, deletedItem) => {
      if (err) {
        console.error("Error deleting cookbook item:", err.message);
        return res
          .status(500)
          .json({ message: "Error deleting cookbook item." });
      }
      if (!deletedItem) {
        return res.status(404).json({ message: "Item not found." });
      }
      return res.json({ message: "Cookbook item deleted successfully." });
    }
  );
};

// Update a cookbook item
exports.updateCookbookItem = function (req, res) {
  const { title, description, instructions, notes } = req.body;

  return CookbookItem.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { title, description, instructions, notes },
    { new: true },
    (err, updatedItem) => {
      if (err) {
        console.error("Error updating cookbook item:", err.message);
        return res
          .status(500)
          .json({ message: "Error updating cookbook item." });
      }
      if (!updatedItem) {
        return res.status(404).json({ message: "Item not found." });
      }
      return res.json(updatedItem);
    }
  );
};
