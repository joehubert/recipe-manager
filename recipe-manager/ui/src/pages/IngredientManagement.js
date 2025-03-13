import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, Upload, Check, CheckSquare, Square, X } from 'lucide-react';
import toast from 'react-hot-toast';

import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import IngredientList from '../components/ingredients/IngredientList';
import AddIngredientModal from '../components/ingredients/AddIngredientModal';
import ImportIngredientsModal from '../components/ingredients/ImportIngredientsModal';
import { getAllIngredients, bulkUpdateInStock } from '../services/ingredientService';

const IngredientManagement = () => {
    const [ingredients, setIngredients] = useState([]);
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);

    // Category options from the enum in database
    const categoryOptions = [
        'all',
        'dairy',
        'meat',
        'produce',
        'bakery',
        'canned goods',
        'dry goods',
        'frozen',
        'spices',
        'condiments',
        'beverages',
        'other'
    ];

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
                setError('Failed to load ingredients. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchIngredients();
    }, []);

    // Apply filters and search
    useEffect(() => {
        let result = [...ingredients];

        // Apply category filter
        if (activeCategory !== 'all') {
            result = result.filter(ingredient => ingredient.category === activeCategory);
        }

        // Apply search filter
        if (searchTerm) {
            result = result.filter(ingredient =>
                ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredIngredients(result);
    }, [ingredients, searchTerm, activeCategory]);

    const handleAddIngredient = (newIngredient) => {
        setIngredients([...ingredients, newIngredient]);
        toast.success(`${newIngredient.name} added successfully`);
        setShowAddModal(false);
    };

    const handleImportIngredients = (importedIngredients) => {
        setIngredients([...ingredients, ...importedIngredients]);
        toast.success(`${importedIngredients.length} ingredients imported successfully`);
        setShowImportModal(false);
    };

    const handleSelectIngredient = (id) => {
        if (selectedIngredients.includes(id)) {
            setSelectedIngredients(selectedIngredients.filter(item => item !== id));
        } else {
            setSelectedIngredients([...selectedIngredients, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedIngredients.length === filteredIngredients.length) {
            setSelectedIngredients([]);
        } else {
            setSelectedIngredients(filteredIngredients.map(ingredient => ingredient.id));
        }
    };

    const handleBulkUpdateStock = async (inStock) => {
        if (selectedIngredients.length === 0) {
            toast.error('No ingredients selected');
            return;
        }

        try {
            const updatedIngredients = await bulkUpdateInStock(selectedIngredients, inStock);

            // Update the ingredients in the state
            setIngredients(ingredients.map(ing => {
                if (selectedIngredients.includes(ing.id)) {
                    return { ...ing, in_stock: inStock };
                }
                return ing;
            }));

            toast.success(`${selectedIngredients.length} ingredients updated`);
            setSelectedIngredients([]);
        } catch (err) {
            toast.error('Failed to update ingredients');
        }
    };

    const handleUpdateIngredient = (updatedIngredient) => {
        setIngredients(ingredients.map(ing =>
            ing.id === updatedIngredient.id ? updatedIngredient : ing
        ));
    };

    const handleDeleteIngredient = (id) => {
        setIngredients(ingredients.filter(ing => ing.id !== id));
        setSelectedIngredients(selectedIngredients.filter(ingId => ingId !== id));
    };

    if (loading) return <Loading />;
    if (error) return <ErrorMessage message={error} retry={() => window.location.reload()} fullPage />;

    return (
        <div>
            <div className="mb-6 bg-white rounded-lg shadow p-4">
                <div className="sm:flex sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                    <h1 className="text-2xl font-bold text-gray-900">Ingredients</h1>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center"
                        >
                            <Plus className="h-5 w-5 mr-1" />
                            Add Ingredient
                        </button>

                        <button
                            onClick={() => setShowImportModal(true)}
                            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center"
                        >
                            <Upload className="h-5 w-5 mr-1" />
                            Import
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Search and Filters */}
                <div className="p-4 border-b border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative col-span-1">
                            <input
                                type="text"
                                placeholder="Search ingredients..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="md:col-span-2 overflow-x-auto">
                            <div className="flex space-x-1 whitespace-nowrap">
                                <span className="mt-2 mr-1 text-gray-700 flex items-center">
                                    <Filter className="h-5 w-5 mr-1" />
                                    Categories:
                                </span>

                                {categoryOptions.map(category => (
                                    <button
                                        key={category}
                                        className={`px-3 py-1.5 rounded-full text-sm capitalize ${activeCategory === category
                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        onClick={() => setActiveCategory(category)}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedIngredients.length > 0 && (
                    <div className="bg-gray-50 px-4 py-3 flex items-center">
                        <span className="text-gray-700">
                            {selectedIngredients.length} selected
                        </span>

                        <div className="ml-auto flex space-x-2">
                            <button
                                onClick={() => handleBulkUpdateStock(true)}
                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded flex items-center"
                            >
                                <Check className="h-4 w-4 mr-1" />
                                Mark In Stock
                            </button>

                            <button
                                onClick={() => handleBulkUpdateStock(false)}
                                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded flex items-center"
                            >
                                <X className="h-4 w-4 mr-1" />
                                Mark Out of Stock
                            </button>
                        </div>
                    </div>
                )}

                {/* Ingredients List */}
                {filteredIngredients.length === 0 ? (
                    <div className="text-center p-8">
                        <p className="text-gray-500 mb-4">
                            {ingredients.length === 0
                                ? "You haven't added any ingredients yet."
                                : "No ingredients match your current filters."
                            }
                        </p>

                        {ingredients.length === 0 ? (
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg inline-flex items-center"
                            >
                                <Plus className="h-5 w-5 mr-1" />
                                Add Your First Ingredient
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setActiveCategory('all');
                                }}
                                className="text-emerald-600 hover:text-emerald-700 font-medium"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="p-4 w-12">
                                            <button
                                                onClick={handleSelectAll}
                                                className="p-2 rounded hover:bg-gray-200"
                                            >
                                                {selectedIngredients.length === filteredIngredients.length ? (
                                                    <CheckSquare className="h-5 w-5 text-emerald-600" />
                                                ) : (
                                                    <Square className="h-5 w-5 text-gray-400" />
                                                )}
                                            </button>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <IngredientList
                                        ingredients={filteredIngredients}
                                        selectedIngredients={selectedIngredients}
                                        onSelect={handleSelectIngredient}
                                        onUpdate={handleUpdateIngredient}
                                        onDelete={handleDeleteIngredient}
                                    />
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Ingredient Modal */}
            <AddIngredientModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddIngredient}
                categoryOptions={categoryOptions.filter(c => c !== 'all')}
            />

            {/* Import Ingredients Modal */}
            <ImportIngredientsModal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                onImport={handleImportIngredients}
                categoryOptions={categoryOptions.filter(c => c !== 'all')}
            />
        </div>
    );
};

export default IngredientManagement;