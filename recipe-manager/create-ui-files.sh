#!/bin/bash

# Create the main ui directory if it doesn't exist
#mkdir -p ui

# # Create directories
mkdir -p ui/src
mkdir -p ui/src/layouts
mkdir -p ui/src/components/common
mkdir -p ui/src/components/recipes
mkdir -p ui/src/components/ingredients
mkdir -p ui/src/pages
mkdir -p ui/src/services

# Create files
touch ui/src/App.js
touch ui/src/layouts/MainLayout.js
touch ui/src/components/common/Header.js
touch ui/src/components/common/Sidebar.js
touch ui/src/components/common/Loading.js
touch ui/src/components/common/ErrorMessage.js
touch ui/src/components/common/ConfirmationDialog.js
touch ui/src/components/recipes/RecipeCard.js
touch ui/src/pages/RecipeList.js
touch ui/src/pages/RecipeDetail.js
touch ui/src/components/recipes/IngredientItem.js
touch ui/src/components/recipes/AddIngredientForm.js
touch ui/src/pages/IngredientManagement.js
touch ui/src/components/ingredients/IngredientList.js
touch ui/src/components/ingredients/IngredientRow.js
touch ui/src/components/ingredients/AddIngredientModal.js
touch ui/src/components/ingredients/ImportIngredientsModal.js
touch ui/src/pages/ShoppingList.js
touch ui/src/pages/NotFound.js
touch ui/src/services/recipeService.js
touch ui/src/services/ingredientService.js
touch ui/src/index.js
touch ui/src/index.css
touch ui/package.json
touch ui/tailwind.config.js
touch ui/postcss.config.js
touch ui/Dockerfile
touch ui/nginx.conf
touch ui/.env
touch ui/.gitignore
touch ui/README.md

echo "Created empty files for Recipe Manager UI structure"