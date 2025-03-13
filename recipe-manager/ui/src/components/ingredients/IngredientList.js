import React from 'react';
import IngredientRow from './IngredientRow';

const IngredientList = ({
    ingredients,
    selectedIngredients,
    onSelect,
    onUpdate,
    onDelete
}) => {
    return (
        <>
            {ingredients.map(ingredient => (
                <IngredientRow
                    key={ingredient.id}
                    ingredient={ingredient}
                    isSelected={selectedIngredients.includes(ingredient.id)}
                    onSelect={onSelect}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                />
            ))}
        </>
    );
};

export default IngredientList;