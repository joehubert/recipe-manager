// Recipe Ingredient junction model
const db = require('../utils/db');

class RecipeIngredient {
    // Add an ingredient to a recipe
    static async addIngredient(recipeId, ingredientId, amount, units) {
        // Get current max sequence number
        const seqQuery = 'SELECT COALESCE(MAX(seq), 0) + 1 as next_seq FROM recipe_ingredient WHERE recipe_id = $1';
        const seqResult = await db.query(seqQuery, [recipeId]);
        const seq = seqResult.rows[0].next_seq;

        // Add the ingredient
        const query = `
      INSERT INTO recipe_ingredient (recipe_id, ingredient_id, seq, amount, units) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;
        const result = await db.query(query, [recipeId, ingredientId, seq, amount, units]);
        return result.rows[0];
    }

    // Remove an ingredient from a recipe
    static async removeIngredient(recipeId, ingredientId) {
        const query = `
      DELETE FROM recipe_ingredient 
      WHERE recipe_id = $1 AND ingredient_id = $2 
      RETURNING *
    `;
        const result = await db.query(query, [recipeId, ingredientId]);

        // Reorder the sequence numbers
        await db.query(`
      WITH numbered AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY seq) AS new_seq
        FROM recipe_ingredient
        WHERE recipe_id = $1
      )
      UPDATE recipe_ingredient ri
      SET seq = n.new_seq
      FROM numbered n
      WHERE ri.id = n.id
    `, [recipeId]);

        return result.rows[0];
    }

    // Get all ingredients for a recipe
    static async getByRecipeId(recipeId) {
        const query = `
      SELECT ri.*, i.name as ingredient_name, i.category, i.in_stock
      FROM recipe_ingredient ri
      JOIN ingredient i ON ri.ingredient_id = i.id
      WHERE ri.recipe_id = $1
      ORDER BY ri.seq
    `;
        const result = await db.query(query, [recipeId]);
        return result.rows;
    }

    // Update the sequence number of an ingredient
    static async updateSequence(id, newSeq) {
        // Get current recipe_id and seq
        const getCurrentQuery = 'SELECT recipe_id, seq FROM recipe_ingredient WHERE id = $1';
        const currentResult = await db.query(getCurrentQuery, [id]);

        if (currentResult.rows.length === 0) {
            throw new Error(`Recipe ingredient with ID ${id} not found`);
        }

        const { recipe_id, seq } = currentResult.rows[0];

        // Start a transaction
        const client = await db.getClient();

        try {
            await client.query('BEGIN');

            if (newSeq > seq) {
                // Moving down - shift up all items in between
                await client.query(`
          UPDATE recipe_ingredient 
          SET seq = seq - 1
          WHERE recipe_id = $1 AND seq > $2 AND seq <= $3
        `, [recipe_id, seq, newSeq]);
            } else if (newSeq < seq) {
                // Moving up - shift down all items in between
                await client.query(`
          UPDATE recipe_ingredient 
          SET seq = seq + 1
          WHERE recipe_id = $1 AND seq >= $2 AND seq < $3
        `, [recipe_id, newSeq, seq]);
            } else {
                // No change needed
                await client.query('ROLLBACK');
                return await this.getById(id);
            }

            // Update the current item to the new sequence
            const updateQuery = 'UPDATE recipe_ingredient SET seq = $1 WHERE id = $2 RETURNING *';
            const result = await client.query(updateQuery, [newSeq, id]);

            await client.query('COMMIT');
            return result.rows[0];
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }

    // Get a recipe_ingredient by ID
    static async getById(id) {
        const query = 'SELECT * FROM recipe_ingredient WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    // Update the amount and units
    static async update(id, amount, units) {
        const query = 'UPDATE recipe_ingredient SET amount = $1, units = $2 WHERE id = $3 RETURNING *';
        const result = await db.query(query, [amount, units, id]);
        return result.rows[0];
    }
}

module.exports = RecipeIngredient;