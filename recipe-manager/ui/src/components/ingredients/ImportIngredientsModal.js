import React, { useState } from 'react';
import { X, Info, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import { importIngredients } from '../../services/ingredientService';

const ImportIngredientsModal = ({ isOpen, onClose, onImport, categoryOptions }) => {
    const [importText, setImportText] = useState('');
    const [defaultCategory, setDefaultCategory] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!importText.trim()) {
            toast.error('Please enter some ingredients to import');
            return;
        }

        if (!defaultCategory) {
            toast.error('Please select a default category');
            return;
        }

        try {
            setIsSubmitting(true);

            // Parse the input text into ingredient objects
            const lines = importText.split('\n').filter(line => line.trim());
            const ingredientsToImport = [];

            for (const line of lines) {
                // Check if line has format "category, name"
                const match = line.match(/^([^,]+),\s*(.+)$/);

                if (match) {
                    const [, inputCategory, name] = match;
                    // Check if the category is valid
                    const category = categoryOptions.includes(inputCategory.trim().toLowerCase())
                        ? inputCategory.trim().toLowerCase()
                        : defaultCategory;

                    ingredientsToImport.push({ name: name.trim(), category });
                } else {
                    // If no category specified, use the default
                    ingredientsToImport.push({ name: line.trim(), category: defaultCategory });
                }
            }

            // Send to API
            const newIngredients = await importIngredients(ingredientsToImport);
            onImport(newIngredients);

            // Reset form
            setImportText('');
            setDefaultCategory('');
        } catch (err) {
            console.error('Failed to import ingredients:', err);
            toast.error('Failed to import ingredients');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setImportText('');
        setDefaultCategory('');
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
                                    Import Ingredients
                                </h3>

                                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-3">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <Info className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-blue-700">
                                                Enter one ingredient per line. You can optionally specify a category by using the format:
                                                <br />
                                                <code className="bg-blue-100 px-1 py-0.5 rounded">category, ingredient name</code>
                                                <br />
                                                If no category is specified, the default category will be used.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="mt-4">
                                    <div className="mb-4">
                                        <label htmlFor="default-category" className="block text-sm font-medium text-gray-700 mb-1">
                                            Default Category
                                        </label>
                                        <select
                                            id="default-category"
                                            value={defaultCategory}
                                            onChange={(e) => setDefaultCategory(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 capitalize"
                                            required
                                        >
                                            <option value="">Select a default category</option>
                                            {categoryOptions.map(option => (
                                                <option key={option} value={option} className="capitalize">
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="import-text" className="block text-sm font-medium text-gray-700 mb-1">
                                            Ingredients
                                        </label>
                                        <textarea
                                            id="import-text"
                                            value={importText}
                                            onChange={(e) => setImportText(e.target.value)}
                                            className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="Enter ingredients, one per line"
                                            required
                                        />
                                    </div>

                                    <div className="mt-6 sm:flex sm:flex-row-reverse">
                                        <button
                                            type="submit"
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Importing...' : 'Import Ingredients'}
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

    export default ImportIngredientsModal;