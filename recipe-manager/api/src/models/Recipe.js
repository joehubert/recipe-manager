// Recipe model
const db = require('../utils/db');

class Recipe {
    // Create a new recipe
    static async create(name) {
        const query = 'INSERT INTO recipe (name, favorite) VALUES ($1, false) RETURNING *';
        const result = await db.query(query, [name]);
        return result.rows[0];
    }

    // Get all recipes
    static async getAll() {
        const query = 'SELECT * FROM recipe ORDER BY name';
        const result = await db.query(query);
        return result.rows;
    }

    // Get a recipe by ID
    static async getById(id) {
        const query = 'SELECT * FROM recipe WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    // Rename a recipe
    static async rename(id, name) {
        const query = 'UPDATE recipe SET name = $1 WHERE id = $2 RETURNING *';
        const result = await db.query(query, [name, id]);
        return result.rows[0];
    }

    // Delete a recipe
    static async delete(id) {
        const query = 'DELETE FROM recipe WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    // Toggle favorite status
    static async toggleFavorite(id) {
        const query = 'UPDATE recipe SET favorite = NOT favorite WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    // Get recipes where all ingredients are in stock
    static async getWithAllIngredientsInStock() {
        const query = `
      SELECT r.* 
      FROM recipe r
      WHERE NOT EXISTS (
        SELECT 1 
        FROM recipe_ingredient ri
        JOIN ingredient i ON ri.ingredient_id = i.id
        WHERE ri.recipe_id = r.id AND i.in_stock = false
      )
      ORDER BY r.name
    `;
        const result = await db.query(query);
        return result.rows;
    }

    // Get recipes where all but a threshold of ingredients are in stock
    static async getWithAllButThresholdInStock(threshold) {
        const query = `
      SELECT r.*, COUNT(CASE WHEN i.in_stock = false THEN 1 END) as missing_count
      FROM recipe r
      LEFT JOIN recipe_ingredient ri ON r.id = ri.recipe_id
      LEFT JOIN ingredient i ON ri.ingredient_id = i.id
      GROUP BY r.id
      HAVING COUNT(CASE WHEN i.in_stock = false THEN 1 END) <= $1
      ORDER BY missing_count, r.name
    `;
        const result = await db.query(query, [threshold]);
        return result.rows;
    }

    // Get missing ingredients for a list of recipes
    static async getMissingIngredients(recipeIds) {
        const query = `
      SELECT DISTINCT i.id, i.name, i.category
      FROM ingredient i
      JOIN recipe_ingredient ri ON i.id = ri.ingredient_id
      WHERE ri.recipe_id = ANY($1::int[]) AND i.in_stock = false
      ORDER BY i.name
    `;
        const result = await db.query(query, [recipeIds]);
        return result.rows;
    }

    // Duplicate a recipe
    static async duplicate(id) {
        // Start a transaction
        const client = await db.getClient();

        try {
            await client.query('BEGIN');

            // Get original recipe
            const getRecipeQuery = 'SELECT name FROM recipe WHERE id = $1';
            const recipeResult = await client.query(getRecipeQuery, [id]);
            const originalRecipe = recipeResult.rows[0];

            if (!originalRecipe) {
                throw new Error(`Recipe with ID ${id} not found`);
            }

            // Create new recipe with "Copy of" prefix
            const newRecipeName = `Copy of ${originalRecipe.name}`;
            const createRecipeQuery = 'INSERT INTO recipe (name, favorite) VALUES ($1, false) RETURNING *';
            const newRecipeResult = await client.query(createRecipeQuery, [newRecipeName]);
            const newRecipe = newRecipeResult.rows[0];

            // Copy all ingredients
            const getIngredientsQuery = 'SELECT * FROM recipe_ingredient WHERE recipe_id = $1 ORDER BY seq';
            const ingredientsResult = await client.query(getIngredientsQuery, [id]);

            // Insert each ingredient into the new recipe
            for (const ingredient of ingredientsResult.rows) {
                await client.query(
                    'INSERT INTO recipe_ingredient (recipe_id, ingredient_id, seq, amount, units) VALUES ($1, $2, $3, $4, $5)',
                    [newRecipe.id, ingredient.ingredient_id, ingredient.seq, ingredient.amount, ingredient.units]
                );
            }

            await client.query('COMMIT');
            return newRecipe;
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }
}

module.exports = Recipe;