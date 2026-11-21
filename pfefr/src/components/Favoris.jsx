import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'react-sweetalert2';
import AddToMealPlanner from './AddToMealPlanner';
import './Favoris.css';

function Favoris() {
    const [favorites, setFavorites] = useState([]);
    const [recipeDetails, setRecipeDetails] = useState(null);
    const [selectedRecipeId, setSelectedRecipeId] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [recipeIdToDelete, setRecipeIdToDelete] = useState(null);
    const [showMealPlannerModal, setShowMealPlannerModal] = useState(false);
    const [recipeToAdd, setRecipeToAdd] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('token'));
            if (!token) {
                console.error("Missing token.");
                return;
            }
            const response = await axios.get('http://127.0.0.1:8000/api/favoris', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFavorites(response.data);
        } catch (error) {
            console.error('Error fetching favorites', error);
        }
    };

    const handleRemoveFavorite = (recipeId) => {
        setRecipeIdToDelete(recipeId);
        setShowConfirm(true);
    };

    const removeFavorite = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('token'));
            if (!token) {
                console.error("Missing token.");
                return;
            }
            await axios.delete(`http://127.0.0.1:8000/api/favoris/${recipeIdToDelete}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchFavorites();
            if (selectedRecipeId === recipeIdToDelete) {
                setRecipeDetails(null);
                setSelectedRecipeId(null);
            }
        } catch (error) {
            console.error('Error removing favorite', error);
        }
        setShowConfirm(false);
        setRecipeIdToDelete(null);
    };

    const displayRecipeDetails = async (recipeId) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'));
            if (!token) {
                console.error("Missing token.");
                return;
            }
            const response = await axios.get(`http://127.0.0.1:8000/api/recipes/${recipeId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRecipeDetails(response.data);
            setSelectedRecipeId(recipeId);
        } catch (error) {
            console.error('Error fetching recipe details', error);
        }
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setRecipeIdToDelete(null);
    };

    const handleAddToPlanning = (recipeId) => {
        axios.get(`http://127.0.0.1:8000/api/recipes/${recipeId}`, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}` },
        })
        .then(response => {
            setRecipeToAdd(response.data);
            setShowMealPlannerModal(true);
        })
        .catch(error => {
            console.error('Error fetching recipe details for planning', error);
        });
    };

    const handleCloseMealPlannerModal = () => {
        setShowMealPlannerModal(false);
        setRecipeToAdd(null);
    };

    const handleMealPlanSuccess = (message) => {
        setSuccessMessage(message);
        setShowMealPlannerModal(false);
        setRecipeToAdd(null);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    return (
        <div className="favorites-page">
            {successMessage && <div className="success-message">{successMessage}</div>}
            <h1 className="favorites-title">My Favorite Recipes</h1>
            <table className="favorites-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {favorites.map(favorite => (
                        <React.Fragment key={favorite.id}>
                            <tr>
                            <img
        src={favorite.recipe.image.startsWith('http') ? favorite.recipe.image : `http://localhost:8000/storage/${favorite.recipe.image}`}
        alt={favorite.recipe.title}
        className="recipe-image"
    />                                <td>{favorite.recipe.title}</td>
                                <td>
                                    <button onClick={(e) => { e.stopPropagation(); displayRecipeDetails(favorite.recipe_id); }} className="details-button">View Details</button>
                                    <button onClick={(e) => { e.stopPropagation(); handleRemoveFavorite(favorite.recipe_id); }} className="delete-button">Remove</button>
                                    <button onClick={(e) => { e.stopPropagation(); handleAddToPlanning(favorite.recipe_id); }} className="planning-button">Planning</button>
                                </td>
                            </tr>
                            {selectedRecipeId === favorite.recipe_id && recipeDetails && (
                                <tr className="recipe-details-row">
                                    <td colSpan="3" className="recipe-details-cell">
                                        <div className="recipe-details-panel">
                                            <div className="recipe-details-header">
                                                <h2 style={{
                                                    fontFamily: 'Oswald, sans-serif',
                                                    fontSize: '2.8em',
                                                    fontWeight: '700',
                                                    color: '#ff6b6b',
                                                    textShadow: '3px 3px 5px rgba(0, 0, 0, 0.3)',
                                                    letterSpacing: '2px',
                                                    textTransform: 'uppercase',
                                                    borderBottom: '3px solid rgb(246, 108, 70)',
                                                    paddingBottom: '8px',
                                                    textAlign: 'center',
                                                    width: '100%'
                                                }}>
                                                    {recipeDetails.title}
                                                </h2>
                                                <button onClick={() => setSelectedRecipeId(null)} className="close-details">×</button>
                                            </div>
                                            <div className="recipe-details-content">
                                                <img src={recipeDetails.image} alt={recipeDetails.title} className="details-image" />
                                                <div className="recipe-details-text">
                                                    <p>⏱️ Time: {recipeDetails.ready_in_minutes ? `${recipeDetails.ready_in_minutes} min` : 'Not specified'}</p>
                                                    <p>🍽️ Servings: {recipeDetails.servings ? `${recipeDetails.servings} ` : 'Not specified'}</p>
                                                    <p>👨‍🍳 Difficulty: {recipeDetails.difficulty ? `${recipeDetails.difficulty} ` : 'Not specified'}</p>
                                                    <p>🌍 Cuisine: {recipeDetails.cuisine_type ? `${recipeDetails.cuisine_type} ` : 'Not specified'}</p>
                                                    <p>🥗 Diet: {recipeDetails.diet ? `${recipeDetails.diet} ` : 'Not specified'}</p>
                                                    <div className="ingredients-card">
                                                        <h3 className="ingredients">Ingredients</h3>
                                                        <ul>
                                                            {recipeDetails.ingredients.split(',').map((ingredient, index) => (
                                                                <li key={index}>{ingredient.trim()}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="instructions-card">
                                                        <h3 className="instructions">Instructions</h3>
                                                        <ol>
                                                            {recipeDetails.instructions.split('.').map((instruction, index) => (
                                                                <li key={index}>{instruction.trim()}</li>
                                                            ))}
                                                        </ol>
                                                    </div>
                                                    <div className="nutrition-card">
                                                        <h3 className="nutrition">⚡ Nutritional Values</h3>
                                                        <ul>
                                                            <li> • Calories : {recipeDetails.calories ? `${recipeDetails.calories} kcal` : 'Not specified'}</li>
                                                            <li>• Carbohydrates : {recipeDetails.carbohydrates ? `${recipeDetails.carbohydrates} g` : 'Not specified'}</li>
                                                            <li>• Fat : {recipeDetails.fat ? `${recipeDetails.fat} g` : 'Not specified'}</li>
                                                            <li>• Sugar : {recipeDetails.sugar ? `${recipeDetails.sugar} g` : 'Not specified'}</li>
                                                            <li>• Proteins : {recipeDetails.protein ? `${recipeDetails.protein} g` : 'Not specified'}</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            <Swal
                show={showConfirm}
                title="Are you sure?"
                text="Do you really want to remove this recipe from your favorites?"
                showCancelButton
                confirmButtonText="Yes, remove ✅"
                cancelButtonText="Cancel ❌"
                onConfirm={removeFavorite}
                onCancel={handleCancelDelete}
            />
            <AddToMealPlanner
                show={showMealPlannerModal}
                onHide={handleCloseMealPlannerModal}
                recipeDetails={recipeToAdd}
                onSuccess={handleMealPlanSuccess}
            />
        </div>
    );
}

export default Favoris;