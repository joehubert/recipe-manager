import React, { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

import { createIngredient } from '../../services/ingredientService';

const AddIngredientModal = ({ isOpen, onClose, onAdd, categoryOptions }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [inStock, setInStock] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error('Ingredient name is required');
            return;
        }

        if (!category) {
            toast.error('Category is required');
            return;
        }

        try {
            setIsSubmitting(true);
            const newIngredient = await createIngredient({ name, category, inStock });
            onAdd(newIngredient);

            // Reset form
            setName('');
            setCategory('');
            setInStock(false);
        } catch (err) {
            toast.error('Failed to create ingredient');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setName('');
        setCategory('');
        setInStock(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                    onClick={handleCancel}
                ></div>

                {/* Modal panel */}
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="absolute top-0 right-0 pt-4 pr-4">
                        <button
                            type="button"
                            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                            onClick={handleCancel}
                        >
                            <span className="sr-only">Close</span>
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    Add New Ingredient
                                </h3>

                                <form onSubmit={handleSubmit} className="mt-4">
                                    <div className="mb-4">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="Enter ingredient name"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                            Category
                                        </label>
                                        <select
                                            id="category"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 capitalize"
                                        >
                                            <option value="">Select a category</option>
                                            {categoryOptions.map(option => (
                                                <option key={option} value={option} className="capitalize">
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="inStock"
                                                checked={inStock}
                                                onChange={(e) => setInStock(e.target.checked)}
                                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="inStock" className="ml-2 block text-sm text-gray-700">
                                                In Stock
                                            </label>
                                        </div>
                                    </div>

                                    <div className="mt-6 sm:flex sm:flex-row-reverse">
                                        <button
                                            type="submit"
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Adding...' : 'Add Ingredient'}
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddIngredientModal;