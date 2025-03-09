const express = require('express');
const recipeController = require('../controllers/recipeController');

const router = express.Router();

// Define routes for recipe operations
router.post('/recipes', recipeController.create);
router.get('/recipes', recipeController.getAll);
router.get('/recipes/:id', recipeController.getById);
router.put('/recipes/:id', recipeController.rename);
router.delete('/recipes/:id', recipeController.delete);
router.post('/recipes/:recipeId/ingredients/:ingredientId', recipeController.addIngredient);
router.delete('/recipes/:recipeId/ingredients/:ingredientId', recipeController.removeIngredient);
router.post('/recipes/:id/toggleFavorite', recipeController.toggleFavorite);
router.post('/recipes/:id/duplicate', recipeController.duplicate);
router.get('/recipes/withAllInStock', recipeController.getWithAllInStock);
router.get('/recipes/withAllButThreshold/:threshold', recipeController.getWithAllButThreshold);
router.post('/recipes/missingIngredients', recipeController.getMissingIngredients);

module.exports = router;
