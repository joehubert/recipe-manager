import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create a new ingredient
export const createIngredient = async ({ name, category, inStock = false }) => {
    const response = await axios.post(`${API_URL}/ingredients`, {
        name,
        category,
        in_stock: inStock
    });
    return response.data;
};

// Get all ingredients
export const getAllIngredients = async () => {
    const response = await axios.get(`${API_URL}/ingredients`);
    return response.data;
};

// Get ingredients by categories
export const getIngredientsByCategories = async (categories) => {
    const response = await axios.post(`${API_URL}/ingredients/categories`, { categories });
    return response.data;
};

// Update ingredient name
export const updateIngredientName = async (id, name) => {
    const response = await axios.patch(`${API_URL}/ingredients/${id}/rename`, { name });
    return response.data;
};

// Update ingredient in_stock status
export const updateInStock = async (id, inStock) => {
    const response = await axios.patch(`${API_URL}/ingredients/${id}/in-stock`, { inStock });
    return response.data;
};

// Bulk update in_stock status
export const bulkUpdateInStock = async (ids, inStock) => {
    const response = await axios.patch(`${API_URL}/ingredients/bulk-update-stock`, { ids, inStock });
    return response.data;
};

// Delete an ingredient
export const deleteIngredient = async (id) => {
    const response = await axios.delete(`${API_URL}/ingredients/${id}`);
    return response.data;
};

// Import ingredients
export const importIngredients = async (ingredients) => {
    const response = await axios.post(`${API_URL}/ingredients/import`, { ingredients });
    return response.data;
};

// Get missing ingredients for a list of recipes
export const getMissingIngredients = async (recipeIds) => {
    const response = await axios.post(`${API_URL}/recipes/missing-ingredients`, { recipeIds });
    return response.data;
};