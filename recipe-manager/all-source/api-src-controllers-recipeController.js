// Recipe controller with CRUD operations
const Recipe = require('../models/Recipe');
const RecipeIngredient = require('../models/RecipeIngredient');

// Controller for recipe-related operations
const recipeController = {
    // Create a new recipe
    async create(req, res) {
        try {
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ error: 'Recipe name is required' });
            }

            const recipe = await Recipe.create(name);
            res.status(201).json(recipe);
        } catch (error) {
            console.error('Error creating recipe:', error);
            res.status(500).json({ error: 'Failed to create recipe' });
        }
    },

    // Get all recipes
    async getAll(req, res) {
        try {
            const recipes = await Recipe.getAll();
            res.json(recipes);
        } catch (error) {
            console.error('Error fetching recipes:', error);
            res.status(500).json({ error: 'Failed to fetch recipes' });
        }
    },

    // Get a recipe by ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const recipe = await Recipe.getById(id);

            if (!recipe) {
                return res.status(404).json({ error: 'Recipe not found' });
            }

            // Get ingredients for this recipe
            const ingredients = await RecipeIngredient.getByRecipeId(id);

            res.json({
                ...recipe,
                ingredients
            });
        } catch (error) {
            console.error('Error fetching recipe:', error);
            res.status(500).json({ error: 'Failed to fetch recipe' });
        }
    },

    // Rename a recipe
    async rename(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ error: 'Recipe name is required' });
            }

            const recipe = await Recipe.rename(id, name);

            if (!recipe) {
                return res.status(404).json({ error: 'Recipe not found' });
            }

            res.json(recipe);
        } catch (error) {
            console.error('Error renaming recipe:', error);
            res.status(500).json({ error: 'Failed to rename recipe' });
        }
    },

    // Delete a recipe
    async delete(req, res) {
        try {
            const { id } = req.params;
            const recipe = await Recipe.delete(id);

            if (!recipe) {
                return res.status(404).json({ error: 'Recipe not found' });
            }

            res.json({ message: 'Recipe deleted successfully', recipe });
        } catch (error) {
            console.error('Error deleting recipe:', error);
            res.status(500).json({ error: 'Failed to delete recipe' });
        }
    },

    // Add an ingredient to a recipe
    async addIngredient(req, res) {
        try {
            const { recipeId, ingredientId } = req.params;
            const { amount, units } = req.body;

            const recipeIngredient = await RecipeIngredient.addIngredient(
                recipeId,
                ingredientId,
                amount || null,
                units || null
            );

            res.status(201).json(recipeIngredient);
        } catch (error) {
            console.error('Error adding ingredient to recipe:', error);
            res.status(500).json({ error: 'Failed to add ingredient to recipe' });
        }
    },

    // Remove an ingredient from a recipe
    async removeIngredient(req, res) {
        try {
            const { recipeId, ingredientId } = req.params;
            const recipeIngredient = await RecipeIngredient.removeIngredient(recipeId, ingredientId);

            if (!recipeIngredient) {
                return res.status(404).json({ error: 'Recipe ingredient not found' });
            }

            res.json({ message: 'Ingredient removed from recipe successfully', recipeIngredient });
        } catch (error) {
            console.error('Error removing ingredient from recipe:', error);
            res.status(500).json({ error: 'Failed to remove ingredient from recipe' });
        }
    },

    // Toggle favorite status
    async toggleFavorite(req, res) {
        try {
            const { id } = req.params;
            const recipe = await Recipe.toggleFavorite(id);

            if (!recipe) {
                return res.status(404).json({ error: 'Recipe not found' });
            }

            res.json(recipe);
        } catch (error) {
            console.error('Error toggling favorite status:', error);
            res.status(500).json({ error: 'Failed to toggle favorite status' });
        }
    },

    // Duplicate a recipe
    async duplicate(req, res) {
        try {
            const { id } = req.params;
            const recipe = await Recipe.duplicate(id);
            res.status(201).json(recipe);
        } catch (error) {
            console.error('Error duplicating recipe:', error);
            res.status(500).json({ error: 'Failed to duplicate recipe' });
        }
    },

    // Get recipes with all ingredients in stock
    async getWithAllInStock(req, res) {
        try {
            const recipes = await Recipe.getWithAllIngredientsInStock();
            res.json(recipes);
        } catch (error) {
            console.error('Error fetching recipes with all ingredients in stock:', error);
            res.status(500).json({ error: 'Failed to fetch recipes' });
        }
    },

    // Get recipes with all but threshold ingredients in stock
    async getWithAllButThreshold(req, res) {
        try {
            const { threshold } = req.params;
            const thresholdNum = parseInt(threshold);

            if (isNaN(thresholdNum) || thresholdNum < 0) {
                return res.status(400).json({ error: 'Threshold must be a non-negative integer' });
            }

            const recipes = await Recipe.getWithAllButThresholdInStock(thresholdNum);
            res.json(recipes);
        } catch (error) {
            console.error('Error fetching recipes with threshold:', error);
            res.status(500).json({ error: 'Failed to fetch recipes' });
        }
    },

    // Get missing ingredients for a list of recipes
    async getMissingIngredients(req, res) {
        try {
            const { recipeIds } = req.body;

            if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
                return res.status(400).json({ error: 'Recipe IDs array is required' });
            }

            const ingredients = await Recipe.getMissingIngredients(recipeIds);
            res.json(ingredients);
        } catch (error) {
            console.error('Error fetching missing ingredients:', error);
            res.status(500).json({ error: 'Failed to fetch missing ingredients' });
        }
    }
};

module.exports = recipeController;