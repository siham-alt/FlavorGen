import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './RecipeDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUtensils } from '@fortawesome/free-solid-svg-icons';

function RecipeDetails() {
    const { id: recipeId } = useParams();
    const [recipeDetails, setRecipeDetails] = useState(null);
    const apiKey = '9b9ba307be4646eea2f3cb0c7b3977a9';
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            try {
                const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, {
                    params: {
                        apiKey: apiKey,
                        includeNutrition: true,
                    },
                });
                setRecipeDetails(response.data);
            } catch (error) {
                console.error('Error fetching recipe details', error);
            }
        };

        fetchRecipeDetails();
    }, [recipeId]);

    if (!recipeDetails) {
        return <div className="loading-container">Loading...</div>;
    }

    const handleGoBack = () => {
        navigate('/recipeslist');
    };

    return (
        <div className="details-recette-container">
            <div className="section-entete">
                <h1 className="titre-recette"><FontAwesomeIcon icon={faUtensils} style={{ marginRight: '8px' }} />
                    Details of: {recipeDetails.title}</h1>
                <button onClick={handleGoBack} className="bouton-retour">
                    <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '8px' }} />
                    Back
                </button>
            </div>

            <div className="section-contenu">
                <div className="colonne-gauche">
                    <img src={recipeDetails.image} alt={recipeDetails.title} className="image-recette" />
                    <div className="meta-recette">
                        <p><strong>⏱️Time:</strong> {recipeDetails.readyInMinutes} min</p>
                        <p><strong>🍽️Servings:</strong> {recipeDetails.servings}</p>
                        <p><strong>🌍Cuisine:</strong> {recipeDetails.cuisines.join(', ') || 'Not specified'}</p>
                        <p><strong>🥗Diet:</strong> {recipeDetails.diets.join(', ') || 'Not specified'}</p>
                    </div>
                </div>
                <div className="colonne-droite">
                    <section className="section-ingredients">
                        <h2>🛒Ingredients</h2><br></br>
                        <ul className="liste-ingredients">
                            {recipeDetails.extendedIngredients.map(ingredient => (
                                <li key={ingredient.id}>{ingredient.original}</li>
                            ))}
                        </ul>
                    </section>
                    <section className="section-instructions">
                        <h2>📝Instructions</h2><br></br>
                        <ol className="instructions">
                            {recipeDetails.analyzedInstructions[0]?.steps.map(step => (
                                <li key={step.number}>{step.step}</li>
                            )) || <li>Not available.</li>}
                        </ol>
                    </section>
                    <section className="section-nutrition">
                        <h2>⚡Nutrition</h2><br></br>
                        <div className="nutrition">
                            {recipeDetails.nutrition.nutrients.map(nutrient => (
                                <div className="boite-nutri" key={nutrient.name}>
                                    {nutrient.name}: <strong>{nutrient.amount} {nutrient.unit}</strong>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default RecipeDetails;