const fetch = require("node-fetch");
const { SPOONACULAR_API_KEY } = require("../config/config");
const Item = require("../models/item");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
} = require("../utils/errors");

// Create item (POST /api/items)
exports.createItem = async (req, res, next) => {
  try {
    const { title, description, imageUrl } = req.body;
    const owner = req.user.id;

    if (!title) return next(new BadRequestError("Title is required."));

    const newItem = await Item.create({ title, description, imageUrl, owner });
    return res.status(201).json(newItem);
  } catch (err) {
    return next(new InternalServerError("Server error creating recipe item."));
  }
};

// DELETE item (DELETE /api/items/:itemId)
exports.deleteItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findById(itemId);

    if (!item) return next(new NotFoundError("Item not found."));
    if (!item.owner.equals(req.user.id))
      return next(new UnauthorizedError("Not authorized to delete this item."));

    await item.deleteOne();
    return res.json({ message: "Item deleted successfully." });
  } catch (err) {
    return next(new InternalServerError("Server error deleting recipe item."));
  }
};

// GET all items for user (GET /api/items)
exports.getItems = async (req, res, next) => {
  try {
    const items = await Item.find({ owner: req.user.id });
    return res.json(items);
  } catch (err) {
    return next(new InternalServerError("Error fetching recipe items."));
  }
};

// Search recipes from Spoonacular (GET /api/items/search?q=...)
exports.searchRecipes = async (req, res, next) => {
  try {
    const query = req.query.q;
    if (!query) return next(new BadRequestError("Search query is required."));

    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
      query
    )}&number=10&apiKey=${SPOONACULAR_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();
    return res.json(data.results || []);
  } catch (err) {
    return next(
      new InternalServerError("Error fetching recipes from Spoonacular API.")
    );
  }
};

// GET recipe details by ID (GET /api/items/:id)
exports.getRecipeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next(new BadRequestError("Recipe ID is required."));

    const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();
    return res.json(data);
  } catch (err) {
    return next(new InternalServerError("Error fetching recipe details."));
  }
};
