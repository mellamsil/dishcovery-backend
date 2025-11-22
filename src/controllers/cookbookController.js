const fetch = require("node-fetch");
const CookbookItem = require("../models/cookbook");
const { SPOONACULAR_API_KEY } = require("../config/config");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../utils/errors");

// SEARCH RECIPES FROM SPOONACULAR
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
      new InternalServerError("Error fetching recipes from Spoonacular.")
    );
  }
};

// GET RECIPE DETAILS BY ID
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

// GET ALL USER'S COOKBOOK ITEMS
exports.getUserCookbook = async (req, res, next) => {
  try {
    const items = await CookbookItem.find({ userId: req.user.id });
    return res.json(items);
  } catch (err) {
    return next(new InternalServerError("Error fetching cookbook items."));
  }
};

// ADD NEW ITEM TO COOKBOOK
exports.addToCookbook = async (req, res, next) => {
  try {
    const recipe = req.body;

    if (!recipe.title) {
      return next(new BadRequestError("Title is required."));
    }

    const newItem = await CookbookItem.create({
      userId: req.user.id,
      title: recipe.title,
      description: recipe.description || "",
      instructions: recipe.instructions || "",
      notes: recipe.notes || "",
      image: recipe.image || "",
    });

    return res.status(201).json(newItem);
  } catch (err) {
    return next(new InternalServerError("Error saving cookbook item."));
  }
};

// DELETE COOKBOOK ITEM
exports.deleteCookbookItem = async (req, res, next) => {
  try {
    const deletedItem = await CookbookItem.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deletedItem) return next(new NotFoundError("Item not found."));

    return res.json({ message: "Cookbook item deleted successfully." });
  } catch (err) {
    return next(new InternalServerError("Error deleting cookbook item."));
  }
};

// UPDATE COOKBOOK ITEM
exports.updateCookbookItem = async (req, res, next) => {
  try {
    const recipe = req.body;

    const updatedItem = await CookbookItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        title: recipe.title,
        description: recipe.description,
        instructions: recipe.instructions,
        notes: recipe.notes,
      },
      { new: true }
    );

    if (!updatedItem) return next(new NotFoundError("Item not found."));

    return res.json(updatedItem);
  } catch (err) {
    return next(new InternalServerError("Error updating cookbook item."));
  }
};
