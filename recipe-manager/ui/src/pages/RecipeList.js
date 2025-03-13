import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, List, Plus, Filter, Star, CheckCircle, Search } from 'lucide-react';

import RecipeCard from '../components/recipes/RecipeCard';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { getAllRecipes } from '../services/recipeService';

const RecipeList = () => {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');

    // Filter states
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
    const [showOnlyInStock, setShowOnlyInStock] = useState(false);
    const [missingThreshold, setMissingThreshold] = useState(null);

    // Fetch recipes
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setLoading(true);
                const data = await getAllRecipes();
                setRecipes(data);
                setFilteredRecipes(data);
            } catch (err) {
                console.error('Failed to fetch recipes:', err);
                setError('Failed to load recipes. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    // Apply filters and search
    useEffect(() => {
        let result = [...recipes];

        // Apply search filter
        if (searchTerm) {
            result = result.filter(recipe =>
                recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply favorites filter
        if (showOnlyFavorites) {
            result = result.filter(recipe => recipe.favorite);
        }

        // Apply in-stock filter
        if (showOnlyInStock) {
            result = result.filter(recipe => recipe.allIngredientsInStock);
        }

        // Apply missing threshold filter
        if (missingThreshold !== null) {
            result = result.filter(recipe =>
                recipe.missingIngredientsCount <= missingThreshold
            );
        }

        setFilteredRecipes(result);
    }, [recipes, searchTerm, showOnlyFavorites, showOnlyInStock, missingThreshold]);

    const handleCreateRecipe = () => {
        navigate('/recipes/new');
    };

    const resetFilters = () => {
        setSearchTerm('');
        setShowOnlyFavorites(false);
        setShowOnlyInStock(false);
        setMissingThreshold(null);
    };

    if (loading) return <Loading />;
    if (error) return <ErrorMessage message={error} retry={() => window.location.reload()} fullPage />;

    return (
        <div>
            {/* Search and Filters Section */}
            <div className="mb-6 bg-white rounded-lg shadow p-4">
                <div className="md:flex md:justify-between md:items-center space-y-4 md:space-y-0">
                    {/* Search input - visible on mobile, hidden on medium+ screens (handled in header) */}
                    <div className="relative md:hidden">
                        <input
                            type="text"
                            placeholder="Search recipes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700 flex items-center">
                            <Filter className="h-5 w-5 mr-1" />
                            Filters:
                        </span>

                        <button
                            className={`px-3 py-1.5 rounded-full text-sm flex items-center ${showOnlyFavorites
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                        >
                            <Star className={`h-4 w-4 mr-1 ${showOnlyFavorites ? 'fill-current' : ''}`} />
                            Favorites
                        </button>

                        <button
                            className={`px-3 py-1.5 rounded-full text-sm flex items-center ${showOnlyInStock
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            onClick={() => setShowOnlyInStock(!showOnlyInStock)}
                        >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            In Stock
                        </button>

                        <select
                            className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm appearance-none cursor-pointer"
                            value={missingThreshold === null ? '' : missingThreshold}
                            onChange={(e) => {
                                const value = e.target.value === '' ? null : parseInt(e.target.value);
                                setMissingThreshold(value);
                            }}
                        >
                            <option value="">Missing Ingredients</option>
                            <option value="0">None missing</option>
                            <option value="1">≤ 1 missing</option>
                            <option value="2">≤ 2 missing</option>
                            <option value="3">≤ 3 missing</option>
                            <option value="5">≤ 5 missing</option>
                        </select>

                        {(showOnlyFavorites || showOnlyInStock || missingThreshold !== null || searchTerm) && (
                            <button
                                className="text-sm text-gray-600 hover:text-gray-900"
                                onClick={resetFilters}
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    {/* View Toggle and Create Button */}
                    <div className="flex items-center space-x-2">
                        <div className="bg-gray-100 rounded-lg p-1 flex">
                            <button
                                className={`p-1.5 rounded ${view === 'grid' ? 'bg-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setView('grid')}
                                aria-label="Grid view"
                            >
                                <Grid className="h-5 w-5" />
                            </button>
                            <button
                                className={`p-1.5 rounded ${view === 'list' ? 'bg-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setView('list')}
                                aria-label="List view"
                            >
                                <List className="h-5 w-5" />
                            </button>
                        </div>

                        <button
                            onClick={handleCreateRecipe}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center"
                        >
                            <Plus className="h-5 w-5 mr-1" />
                            New Recipe
                        </button>
                    </div>
                </div>
            </div>

            {/* Results */}
            {filteredRecipes.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
                    <p className="text-gray-600 mb-4">
                        {recipes.length === 0
                            ? "You haven't created any recipes yet."
                            : "No recipes match your current filters."
                        }
                    </p>
                    {recipes.length === 0 ? (
                        <button
                            onClick={handleCreateRecipe}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg inline-flex items-center"
                        >
                            <Plus className="h-5 w-5 mr-1" />
                            Create Your First Recipe
                        </button>
                    ) : (
                        <button
                            onClick={resetFilters}
                            className="text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            ) : (
                <div>
                    {view === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredRecipes.map(recipe => (
                                <div key={recipe.id} className="h-full">
                                    <RecipeCard recipe={recipe} view="grid" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredRecipes.map(recipe => (
                                <RecipeCard key={recipe.id} recipe={recipe} view="list" />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RecipeList;