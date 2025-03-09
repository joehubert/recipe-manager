// Recipe routes
const express = require('express');
const recipeController = require('../controllers/recipeController');
const Recipe = require('../models/recipe');

const router = express.Router();

// GET /recipes - Get all recipes
router.get('/', recipeController.getAll);

// POST /recipes - Create a new recipe
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Recipe name is required' });
        }

        const recipe = await Recipe.create(name);
        res.status(201).json(recipe);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create recipe' });
    }
});

// GET /recipes/:id - Get a recipe by ID
router.get('/:id', recipeController.getById);

// PATCH /recipes/:id/rename - Rename a recipe
router.patch('/:id/rename', recipeController.rename);

// DELETE /recipes/:id - Delete a recipe
router.delete('/:id', recipeController.delete);

// POST /recipes/:id/duplicate - Duplicate a recipe
router.post('/:id/duplicate', recipeController.duplicate);

// PATCH /recipes/:id/favorite - Toggle favorite status
router.patch('/:id/favorite', recipeController.toggleFavorite);

// POST /recipes/:recipeId/ingredients/:ingredientId - Add an ingredient to a recipe
router.post('/:recipeId/ingredients/:ingredientId', recipeController.addIngredient);

// DELETE /recipes/:recipeId/ingredients/:ingredientId - Remove an ingredient from a recipe
router.delete('/:recipeId/ingredients/:ingredientId', recipeController.removeIngredient);

// GET /recipes/instock/all - Get recipes where all ingredients are in stock
router.get('/instock/all', recipeController.getWithAllInStock);

// GET /recipes/instock/threshold/:threshold - Get recipes where all but threshold ingredients are in stock
router.get('/instock/threshold/:threshold', recipeController.getWithAllButThreshold);

// POST /recipes/missing-ingredients - Get missing ingredients for a list of recipes
router.post('/missing-ingredients', recipeController.getMissingIngredients);

module.exports = router;