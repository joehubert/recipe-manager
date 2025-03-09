-- Initial database schema migration
-- Recipe Manager Database Initialization Script

-- Create enum type for ingredient categories
CREATE TYPE ingredient_category AS ENUM (
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
);

-- Create enum type for units
CREATE TYPE unit_type AS ENUM (
    'g', 
    'kg', 
    'oz', 
    'lb', 
    'ml', 
    'l', 
    'tsp', 
    'tbsp', 
    'cup', 
    'pint', 
    'quart', 
    'gallon', 
    'piece', 
    'slice', 
    'pinch', 
    'bunch', 
    'clove', 
    'to taste'
);

-- Create recipe table
CREATE TABLE recipe (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    favorite BOOLEAN DEFAULT FALSE
);

-- Create ingredient table
CREATE TABLE ingredient (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    category ingredient_category NOT NULL,
    in_stock BOOLEAN DEFAULT FALSE
);

-- Create recipe_ingredient junction table
CREATE TABLE recipe_ingredient (
    id SERIAL PRIMARY KEY,
    recipe_id INTEGER NOT NULL REFERENCES recipe(id) ON DELETE CASCADE,
    ingredient_id INTEGER NOT NULL REFERENCES ingredient(id) ON DELETE CASCADE,
    seq INTEGER NOT NULL,  -- display order of ingredients
    amount NUMERIC,
    units unit_type,
    UNIQUE(recipe_id, ingredient_id)  -- prevent duplicate ingredients in a recipe
);

-- Create indexes for performance
CREATE INDEX idx_recipe_favorite ON recipe(favorite);
CREATE INDEX idx_ingredient_category ON ingredient(category);
CREATE INDEX idx_ingredient_in_stock ON ingredient(in_stock);
CREATE INDEX idx_recipe_ingredient_recipe_id ON recipe_ingredient(recipe_id);
CREATE INDEX idx_recipe_ingredient_ingredient_id ON recipe_ingredient(ingredient_id);
CREATE INDEX idx_recipe_ingredient_seq ON recipe_ingredient(seq);

-- Add comments for documentation
COMMENT ON TABLE recipe IS 'Stores recipe information';
COMMENT ON TABLE ingredient IS 'Stores ingredient information';
COMMENT ON TABLE recipe_ingredient IS 'Junction table linking recipes to ingredients with quantities';
COMMENT ON COLUMN recipe.favorite IS 'Flag indicating if recipe is marked as favorite';
COMMENT ON COLUMN ingredient.in_stock IS 'Flag indicating if ingredient is currently in stock';
COMMENT ON COLUMN recipe_ingredient.seq IS 'Display order for the ingredient within the recipe';
