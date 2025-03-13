import React, { useState } from 'react';
import { Check, X, Trash2, GripVertical, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

import { updateRecipeIngredient, removeIngredientFromRecipe } from '../../services/recipeService';

const IngredientItem = ({ ingredient, recipeId, onUpdate, onRemove }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [amount, setAmount] = useState(ingredient.amount || '');
    const [units, setUnits] = useState(ingredient.units || '');

    const handleSave = async () => {
        try {
            const updatedIngredient = await updateRecipeIngredient(
                recipeId,
                ingredient.ingredient_id,
                { amount: amount || null, units: units || null }
            );
            onUpdate(updatedIngredient);
            setIsEditing(false);
            toast.success('Ingredient updated');
        } catch (error) {
            toast.error('Failed to update ingredient');
        }
    };

    const handleRemove = async () => {
        try {
            await removeIngredientFromRecipe(recipeId, ingredient.ingredient_id);
            onRemove(ingredient.id);
            toast.success('Ingredient removed');
        } catch (error) {
            toast.error('Failed to remove ingredient');
        }
    };

    const getCategoryBadgeColor = (category) => {
        const colors = {
            'dairy': 'bg-blue-100 text-blue-800',
            'meat': 'bg-red-100 text-red-800',
            'produce': 'bg-green-100 text-green-800',
            'bakery': 'bg-yellow-100 text-yellow-800',
            'canned goods': 'bg-purple-100 text-purple-800',
            'dry goods': 'bg-orange-100 text-orange-800',
            'frozen': 'bg-cyan-100 text-cyan-800',
            'spices': 'bg-rose-100 text-rose-800',
            'condiments': 'bg-amber-100 text-amber-800',
            'beverages': 'bg-indigo-100 text-indigo-800',
            'other': 'bg-gray-100 text-gray-800'
        };

        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="flex items-center p-3 bg-white border border-gray-200 rounded-lg">
            <div className="flex-shrink-0 mr-3 cursor-move">
                <GripVertical className="h-5 w-5 text-gray-400" />
            </div>

            <div className="flex-1 flex flex-col sm:flex-row sm:items-center">
                <div className="flex-1">
                    <div className="font-medium text-gray-900">{ingredient.ingredient_name}</div>
                    <div className="flex flex-wrap items-center mt-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryBadgeColor(ingredient.category)}`}>
                            {ingredient.category}
                        </span>

                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${ingredient.in_stock
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                            {ingredient.in_stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>
                </div>

                <div className="mt-2 sm:mt-0 sm:ml-4 flex-shrink-0">
                    {isEditing ? (
                        <div className="flex items-center space-x-2">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                placeholder="Amount"
                                min="0"
                                step="0.01"
                            />

                            <select
                                value={units}
                                onChange={(e) => setUnits(e.target.value)}
                                className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            >
                                <option value="">Units</option>
                                <option value="g">g</option>
                                <option value="kg">kg</option>
                                <option value="oz">oz</option>
                                <option value="lb">lb</option>
                                <option value="ml">ml</option>
                                <option value="l">l</option>
                                <option value="tsp">tsp</option>
                                <option value="tbsp">tbsp</option>
                                <option value="cup">cup</option>
                                <option value="pint">pint</option>
                                <option value="quart">quart</option>
                                <option value="gallon">gallon</option>
                                <option value="piece">piece</option>
                                <option value="slice">slice</option>
                                <option value="pinch">pinch</option>
                                <option value="bunch">bunch</option>
                                <option value="clove">clove</option>
                                <option value="to taste">to taste</option>
                            </select>

                            <button
                                onClick={handleSave}
                                className="p-1 text-green-600 hover:text-green-800"
                            >
                                <Check className="h-5 w-5" />
                            </button>

                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-1 text-red-600 hover:text-red-800"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            {(ingredient.amount || ingredient.units) && (
                                <span className="text-gray-600 mr-4">
                                    {ingredient.amount} {ingredient.units}
                                </span>
                            )}

                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-1 text-gray-400 hover:text-gray-700"
                                aria-label="Edit ingredient"
                            >
                                <Edit className="h-5 w-5" />
                            </button>

                            <button
                                onClick={handleRemove}
                                className="p-1 text-gray-400 hover:text-red-600 ml-1"
                                aria-label="Remove ingredient"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IngredientItem;