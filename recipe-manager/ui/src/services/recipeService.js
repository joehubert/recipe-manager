import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create a new recipe
export const createRecipe = async (name) => {
    const response = await axios.post(`${API_URL}/recipes`, { name });
    return response.data;
};

// Get all recipes
export const getAllRecipes = async () => {
    const response = await axios.get(`${API_URL}/recipes`);
    return response.data;
};

// Get a recipe by ID
export const getRecipeById = async (id) => {
    const response = await axios.get(`${API_URL}/recipes/${id}`);
    return response.data;
};

// Update recipe name
export const updateRecipeName = async (id, name) => {
    const response = await axios.patch(`${API_URL}/recipes/${id}/rename`, { name });
    return response.data;
};

// Delete a recipe
export const deleteRecipe = async (id) => {
    const response = await axios.delete(`${API_URL}/recipes/${id}`);
    return response.data;
};

// Add an ingredient to a recipe
export const addIngredientToRecipe = async (recipeId, ingredientId, data = {}) => {
    const response = await axios.post(
        `${API_URL}/recipes/${recipeId}/ingredients/${ingredientId}`,
        data
    );
    return response.data;
};

// Update a recipe ingredient
export const updateRecipeIngredient = async (recipeId, ingredientId, data) => {
    const response = await axios.patch(
        `${API_URL}/recipes/${recipeId}/ingredients/${ingredientId}`,
        data
    );
    return response.data;
};

// Remove an ingredient from a recipe
export const removeIngredientFromRecipe = async (recipeId, ingredientId) => {
    const response = await axios.delete(`${API_URL}/recipes/${recipeId}/ingredients/${ingredientId}`);
    return response.data;
};

// Toggle favorite status
export const toggleFavorite = async (id) => {
    const response = await axios.patch(`${API_URL}/recipes/${id}/favorite`);
    return response.data;
};

// Duplicate a recipe
export const duplicateRecipe = async (id) => {
    const response = await axios.post(`${API_URL}/recipes/${id}/duplicate`);
    return response.data;
};

// Get recipes with all ingredients in stock
export const getRecipesWithAllInStock = async () => {
    const response = await axios.get(`${API_URL}/recipes/instock/all`);
    return response.data;
};

// Get recipes with all but threshold ingredients in stock
export const getRecipesWithAllButThreshold = async (threshold) => {
    const response = await axios.get(`${API_URL}/recipes/instock/threshold/${threshold}`);
    return response.data;
};

// Get missing ingredients for a list of recipes
export const getMissingIngredientsForRecipes = async (recipeIds) => {
    const response = await axios.post(`${API_URL}/recipes/missing-ingredients`, { recipeIds });
    return response.data;
};