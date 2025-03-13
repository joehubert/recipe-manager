import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ChefHat } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <ChefHat className="h-24 w-24 text-gray-300 mb-6" />

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
            <p className="text-lg text-gray-600 max-w-md mb-8">
                We couldn't find the page you're looking for. It might have been moved or deleted.
            </p>

            <Link
                to="/"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center"
            >
                <Home className="h-5 w-5 mr-2" />
                Back to Recipes
            </Link>
        </div>
    );
};

export default NotFound;