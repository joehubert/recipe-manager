import React, { useState, useEffect } from 'react';
import { Search, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

import { getAllIngredients } from '../../services/ingredientService';
import { addIngredientToRecipe } from '../../services/recipeService';

const AddIngredientForm = ({ recipeId, onAdd, onCancel }) => {
    const [ingredients, setIngredients] = useState([]);
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [amount, setAmount] = useState('');
    const [units, setUnits] = useState('');
    const [showResults, setShowResults] = useState(false);

    // Fetch all ingredients
    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                setLoading(true);
                const data = await getAllIngredients();
                setIngredients(data);
                setFilteredIngredients(data);
            } catch (err) {
                console.error('Failed to fetch ingredients:', err);
                setError('Failed to load ingredients');
            } finally {
                setLoading(false);
            }
        };

        fetchIngredients();
    }, []);

    // Filter ingredients based on search term
    useEffect(() => {
        if (searchTerm) {
            const filtered = ingredients.filter(ingredient =>
                ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredIngredients(filtered);
            setShowResults(true);
        } else {
            setFilteredIngredients(ingredients);
            setShowResults(false);
        }
    }, [searchTerm, ingredients]);

    const handleSelectIngredient = (ingredient) => {
        setSelectedIngredient(ingredient);
        setSearchTerm(ingredient.name);
        setShowResults(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedIngredient) {
            toast.error('Please select an ingredient');
            return;
        }

        try {
            const newIngredient = await addIngredientToRecipe(
                recipeId,
                selectedIngredient.id,
                { amount: amount || null, units: units || null }
            );

            onAdd(newIngredient);
            toast.success(`${selectedIngredient.name} added to recipe`);
        } catch (err) {
            console.error('Failed to add ingredient:', err);
            toast.error('Failed to add ingredient to recipe');
        }
    };

    const handleSearchFocus = () => {
        if (searchTerm) {
            setShowResults(true);
        }
    };

    return (
        <div className="mt-6 border border-gray-300 rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Ingredient</h3>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Ingredient Search */}
                    <div className="md:col-span-2 relative">
                        <label htmlFor="ingredient-search" className="block text-sm font-medium text-gray-700 mb-1">
                            Ingredient
                        </label>
                        <div className="relative">
                            <input
                                id="ingredient-search"
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={handleSearchFocus}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Search ingredients..."
                                autoComplete="off"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Search Results */}
                        {showResults && (
                            <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {filteredIngredients.length === 0 ? (
                                    <div className="px-4 py-3 text-sm text-gray-500">No ingredients found</div>
                                ) : (
                                    <ul className="py-1">
                                        {filteredIngredients.map(ingredient => (
                                            <li
                                                key={ingredient.id}
                                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                                                onClick={() => handleSelectIngredient(ingredient)}
                                            >
                                                <span>{ingredient.name}</span>
                                                <span className={`text-xs px-2 py-1 rounded-full ${ingredient.in_stock
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {ingredient.in_stock ? 'In Stock' : 'Out of Stock'}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Amount */}
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                            Amount
                        </label>
                        <input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="Amount"
                            min="0"
                            step="0.01"
                        />
                    </div>

                    {/* Units */}
                    <div>
                        <label htmlFor="units" className="block text-sm font-medium text-gray-700 mb-1">
                            Units
                        </label>
                        <select
                            id="units"
                            value={units}
                            onChange={(e) => setUnits(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">Select Units</option>
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
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="mr-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        <X className="h-4 w-4 inline mr-1" />
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                        disabled={!selectedIngredient}
                    >
                        <Plus className="h-4 w-4 inline mr-1" />
                        Add Ingredient
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddIngredientForm;