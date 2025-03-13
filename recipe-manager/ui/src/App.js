import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import RecipeList from './pages/RecipeList';
import RecipeDetail from './pages/RecipeDetail';
import IngredientManagement from './pages/IngredientManagement';
import ShoppingList from './pages/ShoppingList';
import NotFound from './pages/NotFound';

function App() {
    return (
        <Router>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<RecipeList />} />
                    <Route path="recipes/:id" element={<RecipeDetail />} />
                    <Route path="ingredients" element={<IngredientManagement />} />
                    <Route path="shopping-list" element={<ShoppingList />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;