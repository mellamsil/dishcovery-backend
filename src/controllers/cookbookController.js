const CookbookItem = require("../models/cookbook");
const fetch = require("node-fetch");
const { SPOONACULAR_API_KEY } = require("../config/config");

// Search recipes from Spoonacular API
exports.searchRecipes = function (req, res) {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ message: "Search query is required." });
  }

  const url =
    "https://api.spoonacular.com/recipes/complexSearch?query=" +
    encodeURIComponent(query) +
    "&number=10&apiKey=" +
    SPOONACULAR_API_KEY;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      res.json(data.results || []);
    })
    .catch(function (err) {
      console.error("Spoonacular API error:", err.message);
      res
        .status(500)
        .json({ message: "Error fetching recipes from Spoonacular API." });
    });
};

// Get detailed recipe information by ID
exports.getRecipeById = function (req, res) {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Recipe ID is required." });
  }

  const url =
    "https://api.spoonacular.com/recipes/" +
    id +
    "/information?apiKey=" +
    SPOONACULAR_API_KEY;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      res.json(data);
    })
    .catch(function (err) {
      console.error("Error fetching recipe details:", err.message);
      res.status(500).json({ message: "Error fetching recipe details." });
    });
};

// Get all user's saved cookbook items
exports.getUserCookbook = function (req, res) {
  CookbookItem.find({ userId: req.userId }, function (err, items) {
    if (err) {
      console.error("Error fetching cookbook items:", err.message);
      return res
        .status(500)
        .json({ message: "Error fetching cookbook items." });
    }
    res.json(items);
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
    title: title,
    description: description,
    instructions: instructions,
    notes: notes,
  });

  newItem.save(function (err, savedItem) {
    if (err) {
      console.error("Error saving cookbook item:", err.message);
      return res.status(500).json({ message: "Error saving cookbook item." });
    }
    res.status(201).json(savedItem);
  });
};

// Delete a cookbook item
exports.deleteCookbookItem = function (req, res) {
  CookbookItem.findOneAndDelete(
    { _id: req.params.id, userId: req.userId },
    function (err, deletedItem) {
      if (err) {
        console.error("Error deleting cookbook item:", err.message);
        return res
          .status(500)
          .json({ message: "Error deleting cookbook item." });
      }
      if (!deletedItem) {
        return res.status(404).json({ message: "Item not found." });
      }
      res.json({ message: "Cookbook item deleted successfully." });
    }
  );
};

// Update a cookbook item
exports.updateCookbookItem = function (req, res) {
  const { title, description, instructions, notes } = req.body;

  CookbookItem.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    {
      title: title,
      description: description,
      instructions: instructions,
      notes: notes,
    },
    { new: true },
    function (err, updatedItem) {
      if (err) {
        console.error("Error updating cookbook item:", err.message);
        return res
          .status(500)
          .json({ message: "Error updating cookbook item." });
      }
      if (!updatedItem) {
        return res.status(404).json({ message: "Item not found." });
      }
      res.json(updatedItem);
    }
  );
};
