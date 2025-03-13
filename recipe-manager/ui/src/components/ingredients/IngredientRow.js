import React, { useState } from 'react';
import { CheckSquare, Square, Edit, Trash2, Check, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

import ConfirmationDialog from '../common/ConfirmationDialog';
import {
    updateIngredientName,
    updateInStock,
    deleteIngredient
} from '../../services/ingredientService';

const IngredientRow = ({
    ingredient,
    isSelected,
    onSelect,
    onUpdate,
    onDelete
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(ingredient.name);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const handleToggleInStock = async () => {
        try {
            const updatedIngredient = await updateInStock(ingredient.id, !ingredient.in_stock);
            onUpdate(updatedIngredient);
            toast.success(`${ingredient.name} marked as ${updatedIngredient.in_stock ? 'in stock' : 'out of stock'}`);
        } catch (err) {
            toast.error('Failed to update ingredient status');
        }
    };

    const handleSaveName = async () => {
        if (editedName.trim() === '') {
            toast.error('Ingredient name cannot be empty');
            return;
        }

        try {
            const updatedIngredient = await updateIngredientName(ingredient.id, editedName);
            onUpdate(updatedIngredient);
            setIsEditing(false);
            toast.success('Ingredient name updated');
        } catch (err) {
            toast.error('Failed to update ingredient name');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteIngredient(ingredient.id);
            onDelete(ingredient.id);
            toast.success(`${ingredient.name} deleted successfully`);
        } catch (err) {
            toast.error('Failed to delete ingredient');
            setShowDeleteConfirmation(false);
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
        <tr className="hover:bg-gray-50">
            <td className="p-4 w-12">
                <button
                    onClick={() => onSelect(ingredient.id)}
                    className="p-2 rounded hover:bg-gray-200"
                >
                    {isSelected ? (
                        <CheckSquare className="h-5 w-5 text-emerald-600" />
                    ) : (
                        <Square className="h-5 w-5 text-gray-400" />
                    )}
                </button>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                {isEditing ? (
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            autoFocus
                        />
                        <button
                            onClick={handleSaveName}
                            className="ml-2 p-1 text-green-600 hover:text-green-800"
                        >
                            <Save className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => {
                                setEditedName(ingredient.name);
                                setIsEditing(false);
                            }}
                            className="ml-1 p-1 text-red-600 hover:text-red-800"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                            {ingredient.name}
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="ml-2 p-1 text-gray-400 hover:text-gray-700"
                            aria-label="Edit ingredient name"
                        >
                            <Edit className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getCategoryBadgeColor(ingredient.category)}`}>
                    {ingredient.category}
                </span>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                <button
                    onClick={handleToggleInStock}
                    className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${ingredient.in_stock
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                >
                    {ingredient.in_stock ? (
                        <>
                            <Check className="h-3 w-3 mr-1" />
                            In Stock
                        </>
                    ) : (
                        <>
                            <X className="h-3 w-3 mr-1" />
                            Out of Stock
                        </>
                    )}
                </button>
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                    onClick={() => setShowDeleteConfirmation(true)}
                    className="p-2 text-gray-400 hover:text-red-600"
                    aria-label="Delete ingredient"
                >
                    <Trash2 className="h-5 w-5" />
                </button>
            </td>

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={showDeleteConfirmation}
                onClose={() => setShowDeleteConfirmation(false)}
                onConfirm={handleDelete}
                title="Delete Ingredient"
                message={`Are you sure you want to delete "${ingredient.name}"? This may affect recipes that use this ingredient.`}
                confirmText="Delete"
                isDangerous={true}
            />
        </tr>
    );
};

export default IngredientRow;