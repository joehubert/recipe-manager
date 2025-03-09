// Ingredient model
const db = require('../utils/db');

class Ingredient {
    // Create a new ingredient
    static async create({ name, category }) {
        const query = 'INSERT INTO ingredient (name, category, in_stock) VALUES ($1, $2, false) RETURNING *';
        const result = await db.query(query, [name, category]);
        return result.rows[0];
    }

    // Get all ingredients
    static async getAll() {
        const query = 'SELECT * FROM ingredient ORDER BY name';
        const result = await db.query(query);
        return result.rows;
    }

    // Get an ingredient by ID
    static async getById(id) {
        const query = 'SELECT * FROM ingredient WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    // Get ingredients by category
    static async getByCategories(categories) {
        const query = 'SELECT * FROM ingredient WHERE category = ANY($1::ingredient_category[]) ORDER BY name';
        const result = await db.query(query, [categories]);
        return result.rows;
    }

    // Rename an ingredient
    static async rename(id, name) {
        const query = 'UPDATE ingredient SET name = $1 WHERE id = $2 RETURNING *';
        const result = await db.query(query, [name, id]);
        return result.rows[0];
    }

    // Delete an ingredient
    static async delete(id) {
        const query = 'DELETE FROM ingredient WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    // Update in_stock status
    static async updateInStock(id, inStock) {
        const query = 'UPDATE ingredient SET in_stock = $1 WHERE id = $2 RETURNING *';
        const result = await db.query(query, [inStock, id]);
        return result.rows[0];
    }

    // Update in_stock status for multiple ingredients
    static async bulkUpdateInStock(ids, inStock) {
        const query = 'UPDATE ingredient SET in_stock = $1 WHERE id = ANY($2::int[]) RETURNING *';
        const result = await db.query(query, [inStock, ids]);
        return result.rows;
    }

    // Import a list of ingredients
    static async importIngredients(ingredients) {
        // Use a transaction to ensure data consistency
        const client = await db.getClient();

        try {
            await client.query('BEGIN');

            const results = [];

            for (const { category, name } of ingredients) {
                // Check if ingredient already exists
                const checkQuery = 'SELECT id FROM ingredient WHERE LOWER(name) = LOWER($1)';
                const checkResult = await client.query(checkQuery, [name]);

                // Skip if exists
                if (checkResult.rows.length > 0) {
                    continue;
                }

                // Insert new ingredient
                const insertQuery = `
          INSERT INTO ingredient (name, category, in_stock) 
          VALUES ($1, $2, false) 
          RETURNING *
        `;
                const insertResult = await client.query(insertQuery, [name, category]);
                results.push(insertResult.rows[0]);
            }

            await client.query('COMMIT');
            return results;
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }
}

module.exports = Ingredient;