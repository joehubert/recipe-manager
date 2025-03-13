import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PlusCircle, Check, Share2, ShoppingCart, Trash } from 'lucide-react';
import toast from 'react-hot-toast';

import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import { getAllRecipes } from '../services/recipeService';
import { getMissingIngredients, bulkUpdateInStock } from '../services/ingredientService';

const ShoppingList = () => {
    const location = useLocation();
    const initialRecipeIds = location.state?.selectedRecipeIds || [];

    const [recipes, setRecipes] = useState([]);
    const [selectedRecipeIds, setSelectedRecipeIds] = useState(initialRecipeIds);
    const [missingIngredients, setMissingIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMissing, setLoadingMissing] = useState(false);
    const [error, setError] = useState(null);
    const [showClearConfirmation, setShowClearConfirmation] = useState(false);

    // Fetch all recipes
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setLoading(true);
                const data = await getAllRecipes();
                setRecipes(data);

                // Load missing ingredients for any initially selected recipes
                if (initialRecipeIds.length > 0) {
                    fetchMissingIngredients(initialRecipeIds);
                } else {
                    setLoading(false);
                }
            } catch (err) {
                console.error('Failed to fetch recipes:', err);
                setError('Failed to load recipes. Please try again.');
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [initialRecipeIds]);

    // Group ingredients by category
    const groupedIngredients = missingIngredients.reduce((acc, ingredient) => {
        if (!acc[ingredient.category]) {
            acc[ingredient.category] = [];
        }
        acc[ingredient.category].push(ingredient);
        return acc;
    }, {});

    // Sort categories for display
    const sortedCategories = Object.keys(groupedIngredients).sort();

    const fetchMissingIngredients = async (recipeIds) => {
        if (recipeIds.length === 0) {
            setMissingIngredients([]);
            return;
        }

        try {
            setLoadingMissing(true);
            const ingredients = await getMissingIngredients(recipeIds);
            setMissingIngredients(ingredients);
        } catch (err) {
            console.error('Failed to fetch missing ingredients:', err);
            toast.error('Failed to load missing ingredients');
        } finally {
            setLoadingMissing(false);
            setLoading(false);
        }
    };

    const handleRecipeToggle = (recipeId) => {
        const newSelectedIds = selectedRecipeIds.includes(recipeId)
            ? selectedRecipeIds.filter(id => id !== recipeId)
            : [...selectedRecipeIds, recipeId];

        setSelectedRecipeIds(newSelectedIds);
        fetchMissingIngredients(newSelectedIds);
    };

    const handleMarkAsInStock = async (ingredientIds) => {
        try {
            await bulkUpdateInStock(ingredientIds, true);

            // Update the local state
            setMissingIngredients(missingIngredients.filter(
                ing => !ingredientIds.includes(ing.id)
            ));

            toast.success('Ingredients marked as in stock');
        } catch (err) {
            toast.error('Failed to update ingredients');
        }
    };

    const handleMarkAllAsInStock = async () => {
        if (missingIngredients.length === 0) return;

        const ingredientIds = missingIngredients.map(ing => ing.id);
        handleMarkAsInStock(ingredientIds);
    };

    const handleCategoryMarkAsInStock = (category) => {
        if (!groupedIngredients[category] || groupedIngredients[category].length === 0) return;

        const ingredientIds = groupedIngredients[category].map(ing => ing.id);
        handleMarkAsInStock(ingredientIds);
    };

    const handleClearList = () => {
        setSelectedRecipeIds([]);
        setMissingIngredients([]);
        setShowClearConfirmation(false);
    };

    const handleShareList = () => {
        // Generate text for shopping list
        let shareText = "Shopping List:\n\n";

        sortedCategories.forEach(category => {
            shareText += `${category.toUpperCase()}:\n`;
            groupedIngredients[category].forEach(ingredient => {
                shareText += `- ${ingredient.name}\n`;
            });
            shareText += '\n';
        });

        // Use the clipboard API to copy the text
        navigator.clipboard.writeText(shareText)
            .then(() => toast.success('Shopping list copied to clipboard'))
            .catch(() => toast.error('Failed to copy to clipboard'));
    };

    if (loading) return <Loading />;
    if (error) return <ErrorMessage message={error} retry={() => window.location.reload()} fullPage />;

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <ShoppingCart className="h-6 w-6 mr-2" />
                        Shopping List
                    </h1>

                    <div className="flex space-x-2">
                        <button
                            onClick={handleShareList}
                            className="flex items-center px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            disabled={missingIngredients.length === 0}
                        >
                            <Share2 className="h-4 w-4 mr-1.5" />
                            Share List
                        </button>

                        <button
                            onClick={handleMarkAllAsInStock}
                            className="flex items-center px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                            disabled={missingIngredients.length === 0}
                        >
                            <Check className="h-4 w-4 mr-1.5" />
                            Mark All In Stock
                        </button>

                        <button
                            onClick={() => setShowClearConfirmation(true)}
                            className="flex items-center px-3 py-1.5 text-sm bg-white border border-red-300 rounded-lg text-red-600 hover:bg-red-50"
                            disabled={selectedRecipeIds.length === 0}
                        >
                            <Trash className="h-4 w-4 mr-1.5" />
                            Clear List
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 min-h-[400px]">
                {/* Recipe Selection */}
                <div className="p-4 border-r border-gray-200">
                    <div className="mb-4">
                        <h2 className="text-lg font-medium text-gray-900 mb-2">Select Recipes</h2>
                        <p className="text-sm text-gray-500">Choose recipes to see what ingredients you need</p>
                    </div>

                    <div className="max-h-[500px] overflow-y-auto pr-2">
                        {recipes.length === 0 ? (
                            <div className="text-center p-4">
                                <p className="text-gray-500">No recipes found</p>
                            </div>
                        ) : (
                            <ul className="space-y-2">
                                {recipes.map(recipe => (
                                    <li key={recipe.id}>
                                        <label className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedRecipeIds.includes(recipe.id)}
                                                onChange={() => handleRecipeToggle(recipe.id)}
                                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                            />
                                            <span className="ml-2 text-gray-700">{recipe.name}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Shopping List */}
                <div className="col-span-1 md:col-span-3 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Missing Ingredients</h2>

                    {loadingMissing ? (
                        <Loading />
                    ) : missingIngredients.length === 0 ? (
                        <div className="text-center p-8">
                            <p className="text-gray-500 mb-4">
                                {selectedRecipeIds.length === 0
                                    ? "Select recipes to see what ingredients you need."
                                    : "No missing ingredients for the selected recipes!"
                                }
                            </p>

                            {selectedRecipeIds.length === 0 && (
                                <p className="text-sm text-gray-400">
                                    Choose recipes from the list on the left to build your shopping list
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {sortedCategories.map(category => (
                                <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="flex items-center justify-between bg-gray-50 px-4 py-2 border-b border-gray-200">
                                        <h3 className="text-md font-medium text-gray-700 capitalize">{category}</h3>

                                        <button
                                            onClick={() => handleCategoryMarkAsInStock(category)}
                                            className="flex items-center text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200"
                                        >
                                            <Check className="h-3 w-3 mr-1" />
                                            Mark All In Stock
                                        </button>
                                    </div>

                                    <ul className="divide-y divide-gray-200">
                                        {groupedIngredients[category].map(ingredient => (
                                            <li key={ingredient.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                                                <span className="text-gray-700">{ingredient.name}</span>

                                                <button
                                                    onClick={() => handleMarkAsInStock([ingredient.id])}
                                                    className="flex items-center text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100"
                                                >
                                                    <Check className="h-3 w-3 mr-1" />
                                                    In Stock
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Clear Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={showClearConfirmation}
                onClose={() => setShowClearConfirmation(false)}
                onConfirm={handleClearList}
                title="Clear Shopping List"
                message="Are you sure you want to clear your shopping list? This will unselect all recipes."
                confirmText="Clear List"
                isDangerous={true}
            />
        </div>
    );
};

export default ShoppingList;