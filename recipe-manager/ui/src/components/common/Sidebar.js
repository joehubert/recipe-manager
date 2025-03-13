import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, BookOpen, Clipboard, ShoppingBag, BookmarkPlus } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navLinkClasses = ({ isActive }) =>
        `flex items-center p-3 rounded-lg ${isActive
            ? 'bg-emerald-100 text-emerald-700 font-medium'
            : 'text-gray-700 hover:bg-gray-100'
        }`;

    return (
        <>
            {/* Mobile Sidebar Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-30 h-screen w-64 pt-16 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="absolute top-3 right-3 md:hidden">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="h-full p-4 overflow-y-auto">
                    <ul className="space-y-2">
                        <li>
                            <NavLink to="/" className={navLinkClasses} end>
                                <BookOpen className="w-5 h-5 mr-3" />
                                Recipes
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/ingredients" className={navLinkClasses}>
                                <Clipboard className="w-5 h-5 mr-3" />
                                Ingredients
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/shopping-list" className={navLinkClasses}>
                                <ShoppingBag className="w-5 h-5 mr-3" />
                                Shopping List
                            </NavLink>
                        </li>
                        <li className="pt-4 mt-4 border-t border-gray-200">
                            <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase">
                                Quick Actions
                            </div>
                            <button className="w-full flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100">
                                <BookmarkPlus className="w-5 h-5 mr-3" />
                                New Recipe
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;