import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Book, Search } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/') return 'Recipes';
        if (path.startsWith('/recipes/')) return 'Recipe Details';
        if (path === '/ingredients') return 'Ingredients';
        if (path === '/shopping-list') return 'Shopping List';
        return 'Recipe Manager';
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 mr-2 rounded-md text-gray-600 hover:bg-gray-100 md:hidden"
                        aria-label="Toggle menu"
                    >
                        <Menu size={24} />
                    </button>

                    <Link to="/" className="flex items-center">
                        <Book className="h-8 w-8 text-emerald-600 mr-2" />
                        <span className="text-xl font-semibold text-gray-800 hidden sm:inline">Recipe Manager</span>
                    </Link>
                </div>

                <div className="text-xl font-medium text-gray-800 flex-1 text-center hidden sm:block">
                    {getPageTitle()}
                </div>

                <div className="flex items-center">
                    <div className="relative md:w-64 hidden md:block">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;