import React from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle, AlertCircle } from 'lucide-react';

const RecipeCard = ({ recipe, view = 'grid' }) => {
    const { id, name, favorite, allIngredientsInStock = false, missingIngredientsCount = 0 } = recipe;

    if (view === 'list') {
        return (
            <Link
                to={`/recipes/${id}`}
                className="block p-4 mb-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">{name}</h3>
                        {favorite && (
                            <Star className="h-5 w-5 text-yellow-400 ml-2 fill-current" />
                        )}
                    </div>

                    <div className="flex items-center">
                        {allIngredientsInStock ? (
                            <div className="flex items-center text-green-600">
                                <CheckCircle className="h-5 w-5 mr-1" />
                                <span className="text-sm">All ingredients in stock</span>
                            </div>
                        ) : (
                            <div className="flex items-center text-amber-600">
                                <AlertCircle className="h-5 w-5 mr-1" />
                                <span className="text-sm">{missingIngredientsCount} missing</span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link
            to={`/recipes/${id}`}
            className="block h-full bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow overflow-hidden"
        >
            <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-2">{name}</h3>
                    {favorite && (
                        <Star className="h-5 w-5 text-yellow-400 ml-2 flex-shrink-0 fill-current" />
                    )}
                </div>

                <div className="mt-4">
                    {allIngredientsInStock ? (
                        <div className="flex items-center text-green-600">
                            <CheckCircle className="h-5 w-5 mr-1" />
                            <span className="text-sm">All ingredients in stock</span>
                        </div>
                    ) : (
                        <div className="flex items-center text-amber-600">
                            <AlertCircle className="h-5 w-5 mr-1" />
                            <span className="text-sm">{missingIngredientsCount} missing ingredient{missingIngredientsCount !== 1 ? 's' : ''}</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default RecipeCard;