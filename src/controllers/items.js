const { SPOONACULAR_API_KEY } = require("../config/config");
const fetch = require("node-fetch");
const Item = require("../models/item");

// Local Cookbook/Recipe Management

// POST /api/items
exports.createItem = (req, res) => {
  const { title, description, imageUrl } = req.body;
  const owner = req.userId;

  if (!title) {
    return res.status(400).json({ message: "Title is required." });
  }

  Item.create({ title, description, imageUrl, owner })
    .then((newItem) => res.status(201).json(newItem))
    .catch((err) => {
      console.error("Error creating recipe item:", err.message);
      res.status(500).json({ message: "Server error creating recipe item." });
    });
};

// DELETE /api/items/:itemId
exports.deleteItem = (req, res) => {
  const itemId = req.params.itemId;

  Item.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).json({ message: "Item not found." });
      }

      if (!item.owner.equals(req.userId)) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this item." });
      }

      return item.deleteOne().then(() => {
        res.json({ message: "Item deleted successfully." });
      });
    })
    .catch((err) => {
      console.error("Error deleting recipe item:", err.message);
      res.status(500).json({ message: "Server error deleting recipe item." });
    });
};

// GET /api/items
exports.getItems = (req, res) => {
  Item.find({ owner: req.userId })
    .then((items) => res.status(200).json(items))
    .catch((err) => {
      console.error("Error fetching recipe items:", err.message);
      res.status(500).json({ message: "Error fetching recipe items." });
    });
};

// Spoonacular API Routes

// GET /api/items/search?q=...
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

// GET /api/items/:id
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
