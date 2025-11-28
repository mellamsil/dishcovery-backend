const Recipe = require("../models/recipe");
const {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} = require("../utils/errors");

// GET /recipes - Get all recipes for the current user
exports.getRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find({ owner: req.user._id });
    res.status(200).json(recipes);
  } catch (err) {
    next(err);
  }
};

// POST /recipes - Create a new recipe
exports.createRecipe = async (req, res, next) => {
  try {
    const { title, ingredients, description, instructions, imageUrl, cuisine } =
      req.body;

    if (!title || !ingredients || !instructions) {
      throw new BadRequestError(
        "Title, ingredients, and instructions are required"
      );
    }

    // Convert ingredients string to array if it's a string
    const ingredientsArray = Array.isArray(ingredients)
      ? ingredients
      : ingredients
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i);

    const recipe = await Recipe.create({
      title: title.trim(),
      ingredients: ingredientsArray,
      description: description?.trim() || "",
      instructions: instructions.trim(),
      image: imageUrl?.trim() || "",
      cuisine: cuisine?.trim() || "",
      owner: req.user._id,
    });

    res.status(201).json(recipe);
  } catch (err) {
    next(err);
  }
};

// DELETE /recipes/:id - Delete a recipe by ID
exports.deleteRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestError("Invalid recipe ID");
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) throw new NotFoundError("Recipe not found");

    if (!recipe.owner.equals(req.user._id)) {
      throw new ForbiddenError("You are not allowed to delete this recipe");
    }

    await recipe.deleteOne();
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (err) {
    next(err);
  }
};
