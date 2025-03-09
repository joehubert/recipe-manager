// Ingredient controller with CRUD operations
const Ingredient = require('../models/Ingredient');

// Controller for ingredient-related operations
const ingredientController = {
    // Create a new ingredient
    async create(req, res) {
        try {
            const { name, category } = req.body;

            if (!name || !category) {
                return res.status(400).json({ error: 'Name and category are required' });
            }

            const ingredient = await Ingredient.create({ name, category });
            res.status(201).json(ingredient);
        } catch (error) {
            console.error('Error creating ingredient:', error);
            res.status(500).json({ error: 'Failed to create ingredient' });
        }
    },

    // Get all ingredients
    async getAll(req, res) {
        try {
            const ingredients = await Ingredient.getAll();
            res.json(ingredients);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
            res.status(500).json({ error: 'Failed to fetch ingredients' });
        }
    },

    // Get ingredients by categories
    async getByCategories(req, res) {
        try {
            const { categories } = req.body;

            if (!Array.isArray(categories) || categories.length === 0) {
                return res.status(400).json({ error: 'Categories array is required' });
            }

            const ingredients = await Ingredient.getByCategories(categories);
            res.json(ingredients);
        } catch (error) {
            console.error('Error fetching ingredients by categories:', error);

            // Check for PostgreSQL enum violation
            if (error.code === '22P02' && error.message.includes('invalid input value for enum')) {
                return res.status(400).json({ error: 'Invalid category value' });
            }

            res.status(500).json({ error: 'Failed to fetch ingredients' });
        }
    },

    // Rename an ingredient
    async rename(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ error: 'Ingredient name is required' });
            }

            const ingredient = await Ingredient.rename(id, name);

            if (!ingredient) {
                return res.status(404).json({ error: 'Ingredient not found' });
            }

            res.json(ingredient);
        } catch (error) {
            console.error('Error renaming ingredient:', error);
            res.status(500).json({ error: 'Failed to rename ingredient' });
        }
    },

    // Delete an ingredient
    async delete(req, res) {
        try {
            const { id } = req.params;
            const ingredient = await Ingredient.delete(id);

            if (!ingredient) {
                return res.status(404).json({ error: 'Ingredient not found' });
            }

            res.json({ message: 'Ingredient deleted successfully', ingredient });
        } catch (error) {
            console.error('Error deleting ingredient:', error);
            res.status(500).json({ error: 'Failed to delete ingredient' });
        }
    },

    // Update in_stock status
    async updateInStock(req, res) {
        try {
            const { id } = req.params;
            const { inStock } = req.body;

            if (typeof inStock !== 'boolean') {
                return res.status(400).json({ error: 'inStock must be a boolean value' });
            }

            const ingredient = await Ingredient.updateInStock(id, inStock);

            if (!ingredient) {
                return res.status(404).json({ error: 'Ingredient not found' });
            }

            res.json(ingredient);
        } catch (error) {
            console.error('Error updating ingredient in_stock status:', error);
            res.status(500).json({ error: 'Failed to update ingredient' });
        }
    },

    // Bulk update in_stock status
    async bulkUpdateInStock(req, res) {
        try {
            const { ids, inStock } = req.body;

            if (!Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({ error: 'Ingredient IDs array is required' });
            }

            if (typeof inStock !== 'boolean') {
                return res.status(400).json({ error: 'inStock must be a boolean value' });
            }

            const ingredients = await Ingredient.bulkUpdateInStock(ids, inStock);
            res.json(ingredients);
        } catch (error) {
            console.error('Error bulk updating ingredient in_stock status:', error);
            res.status(500).json({ error: 'Failed to update ingredients' });
        }
    },

    // Import ingredients
    async importIngredients(req, res) {
        try {
            const { ingredients } = req.body;

            if (!Array.isArray(ingredients) || ingredients.length === 0) {
                return res.status(400).json({ error: 'Ingredients array is required' });
            }

            // Validate each ingredient
            for (const ingredient of ingredients) {
                if (!ingredient.name || !ingredient.category) {
                    return res.status(400).json({
                        error: 'Each ingredient must have name and category',
                        invalidIngredient: ingredient
                    });
                }
            }

            const createdIngredients = await Ingredient.importIngredients(ingredients);
            res.status(201).json(createdIngredients);
        } catch (error) {
            console.error('Error importing ingredients:', error);

            // Check for PostgreSQL enum violation
            if (error.code === '22P02' && error.message.includes('invalid input value for enum')) {
                return res.status(400).json({ error: 'Invalid category value' });
            }

            res.status(500).json({ error: 'Failed to import ingredients' });
        }
    }
};

module.exports = ingredientController;