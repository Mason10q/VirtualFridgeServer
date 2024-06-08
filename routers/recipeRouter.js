const express = require("express");
const recipeRouter = express.Router();

const recipeController = require("../controllers/recipeController.js");


recipeRouter.get("/list", recipeController.getRecipes);
recipeRouter.get("/search", recipeController.searchRecipes);
recipeRouter.get("/recipe", recipeController.getRecipe);
recipeRouter.get("/recipe/products", recipeController.getRecipeProducts);


module.exports = recipeRouter;