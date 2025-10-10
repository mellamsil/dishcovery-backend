const { SPOONACULAR_API_KEY } = require("../config/config");
const fetch = require("node-fetch"); // Remove if Node 18+ with built-in fetch

// GET /api/items - placeholder (optional)
exports.getItems = (req, res) => {
  res.status(200).json({ message: "Items route working" });
};

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
