import React, { useState } from "react";
import { searchRecipes, getRecipeDetails } from "./services/spoonacularService";

const RecipeSearch = () => {
    const [ingredients, setIngredients] = useState("");
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    const handleSearch = async () => {
        const ingredientList = ingredients.split(",").map(ing => ing.trim());
        const data = await searchRecipes(ingredientList);
        setRecipes(data);
    };

    const handleRecipeClick = async (recipeId) => {
        const recipeDetails = await getRecipeDetails(recipeId);
        setSelectedRecipe(recipeDetails);
    };

    return (
        <div>
            <h2>🔎 Rechercher des Recettes</h2>
            <input
                type="text"
                placeholder="Entrez les ingrédients (ex: tomate, oignon, poulet)"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
            />
            <button onClick={handleSearch}>Rechercher</button>

            <div>
                <h3>🍽️ Résultats :</h3>
                <ul>
                    {recipes.map((recipe) => (
                        <li key={recipe.id}>
                            <h4>{recipe.title}</h4>
                            <img src={recipe.image} alt={recipe.title} width="200" />
                            <button onClick={() => handleRecipeClick(recipe.id)}>Voir Détails</button>
                        </li>
                    ))}
                </ul>
            </div>

            {selectedRecipe && (
                <div>
                    <h3>📜 Détails de la Recette :</h3>
                    <h4>{selectedRecipe.title}</h4>
                    <img src={selectedRecipe.image} alt={selectedRecipe.title} width="400" />

                    <p><strong>⏳ Temps de préparation :</strong> {selectedRecipe.readyInMinutes} min</p>
                    <p><strong>🔥 Temps de cuisson :</strong> {selectedRecipe.cookingMinutes || "Non précisé"} min</p>
                    <p><strong>🍽️ Portions :</strong> {selectedRecipe.servings}</p>

                    {selectedRecipe.nutrition && selectedRecipe.nutrition.nutrients.length > 0 && (
                        <p><strong>💪 Calories :</strong> {selectedRecipe.nutrition.nutrients.find(n => n.name === "Calories")?.amount} kcal</p>
                    )}

                    <h5>🛒 Ingrédients :</h5>
                    <ul>
                        {selectedRecipe.extendedIngredients.map((ingredient, index) => (
                            <li key={index}>{ingredient.original}</li>
                        ))}
                    </ul>

                    <h5>📖 Instructions :</h5>
                    <p>{selectedRecipe.instructions || "Aucune instruction disponible."}</p>
                </div>
            )}
        </div>
    );
};

export default RecipeSearch;
