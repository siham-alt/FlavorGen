import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt, faSun, faUtensils, faMoon, faInfoCircle, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import Swal from 'react-sweetalert2';
import { Eye } from 'react-bootstrap-icons';
import { motion, AnimatePresence } from 'framer-motion';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import './MealPlanner.css';

const mealPlanItemVariants = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }, exit: { opacity: 0, x: 20, transition: { duration: 0.2 } } };

function MealPlanner() {
    const [date, setDate] = useState(new Date());
    const [mealPlans, setMealPlans] = useState([]);
    const [newRecipe, setNewRecipe] = useState({ title: '', image: null, ready_in_minutes: '', servings: '', difficulty: '', cuisine_type: '', diet: '', ingredients: '', instructions: '', calories: '', carbohydrates: '', fat: '', sugar: '', protein: '' });
    const [mealType, setMealType] = useState('breakfast');
    const [error, setError] = useState(null);
    const [detailsRecette, setDetailsRecette] = useState(null);
    const [selectedRecipeId, setSelectedRecipeId] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [mealPlanIdToDelete, setMealPlanIdToDelete] = useState(null);
    const [nutritionSummary, setNutritionSummary] = useState({ calories: 0, protein: 0, carbohydrates: 0, fat: 0 });
    const [loading, setLoading] = useState(false);
    const [isEditingRecipe, setIsEditingRecipe] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => { fetchMealPlans(); }, [date]);
    useEffect(() => { calculateNutritionSummary(); }, [mealPlans]);

    const fetchMealPlans = async () => {
        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem("token"));
            const response = await axios.get('http://localhost:8000/api/meal-plans', { params: { date: date.toISOString().split('T')[0] }, headers: { Authorization: `Bearer ${token}` } });
            setMealPlans(response.data);
        } catch (err) { console.error(err); setError("Failed to fetch meal plans. Please check your network connection."); } finally { setLoading(false); }
    };

    const calculateNutritionSummary = () => {
        let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
        mealPlans.forEach(plan => {
            if (plan.recipe) {
                totalCalories += plan.recipe.calories || 0;
                totalProtein += plan.recipe.protein || 0;
                totalCarbs += plan.recipe.carbohydrates || 0;
                totalFat += plan.recipe.fat || 0;
            }
        });
        setNutritionSummary({ calories: totalCalories.toFixed(2), protein: totalProtein.toFixed(2), carbohydrates: totalCarbs.toFixed(2), fat: totalFat.toFixed(2) });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width, height = img.height;
                    if (width > height) { if (width > 800) { height *= 800 / width; width = 800; } } else { if (height > 600) { width *= 600 / height; height = 600; } }
                    canvas.width = width; canvas.height = height;
                    const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, width, height);
                    let dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    if (dataUrl.length > 100000) { dataUrl = canvas.toDataURL('image/jpeg', 0.6); }
                    if (dataUrl.length > 100000) { dataUrl = canvas.toDataURL('image/jpeg', 0.4); }
                    setNewRecipe({ ...newRecipe, image: dataUrl });
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddMealPlan = async () => {
        setError(null);
        const today = new Date(); today.setHours(0, 0, 0, 0); const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        if (selectedDate < today) { setError("Vous ne pouvez pas planifier un repas pour une date passée."); return; }
        let errors = {}; if (!newRecipe.title) errors.title = "Le titre est obligatoire."; if (!newRecipe.ingredients) errors.ingredients = "Les ingrédients sont obligatoires."; if (!newRecipe.instructions) errors.instructions = "Les instructions sont obligatoires."; if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem("token"));
            const recipeResponse = await axios.post('http://localhost:8000/api/recipes', { ...newRecipe }, { headers: { Authorization: `Bearer ${token}` } });
            const recipeId = recipeResponse.data.id;
            if (!recipeId) { throw new Error("La création de la recette a échoué."); }
            await axios.post('http://localhost:8000/api/meal-plans', { date: date.toISOString().split('T')[0], meal_type: mealType, recipe_id: recipeId }, { headers: { Authorization: `Bearer ${token}` } });
            await fetchMealPlans();
            setNewRecipe({ title: '', image: null, ready_in_minutes: '', servings: '', difficulty: '', cuisine_type: '', diet: '', ingredients: '', instructions: '', calories: '', carbohydrates: '', fat: '', sugar: '', protein: '' });
            setFormErrors({});
        } catch (err) { console.error(err); setError("Failed to add meal plan. Please try again."); } finally { setLoading(false); }
    };

    const handleSupprimerMealPlan = (mealPlanId) => { setMealPlanIdToDelete(mealPlanId); setShowConfirm(true); };
    const supprimerMealPlan = async () => { try { const token = JSON.parse(localStorage.getItem('token')); await axios.delete(`http://127.0.0.1:8000/api/meal-plans/${mealPlanIdToDelete}`, { headers: { Authorization: `Bearer ${token}` } }); await fetchMealPlans(); } catch (error) { console.error('Erreur lors de la suppression du plan de repas', error); setError("Failed to delete meal plan. Please try again."); } setShowConfirm(false); setMealPlanIdToDelete(null); };
    const handleCancelDelete = () => { setShowConfirm(false); setMealPlanIdToDelete(null); };
    const afficherDetailsRecette = (recipe) => { setDetailsRecette(recipe); setSelectedRecipeId(recipe.id); };

    const renderRecipeForm = () => {
        if (!isEditingRecipe) { return (<Button onClick={() => setIsEditingRecipe(true)}> <FontAwesomeIcon icon={faPlus} /> Ajouter une recette manuellement </Button>); }
        return (
            <div className="manual-recipe-form">
                <div className="form-row"> <TextField label="Titre" value={newRecipe.title} onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })} fullWidth error={!!formErrors.title} helperText={formErrors.title} /> </div>
                <div className="form-row"> <input type="file" accept="image/*" onChange={handleImageChange} /> </div>
                <div className="form-row"> <TextField label="Temps de préparation (min)" type="number" value={newRecipe.ready_in_minutes} onChange={(e) => setNewRecipe({ ...newRecipe, ready_in_minutes: e.target.value })} fullWidth /> </div>
                <div className="form-row"> <TextField label="Nombre de portions" type="number" value={newRecipe.servings} onChange={(e) => setNewRecipe({ ...newRecipe, servings: e.target.value })} fullWidth /> </div>
                <div className="form-row"> <Select label="Difficulté" value={newRecipe.difficulty} onChange={(e) => setNewRecipe({ ...newRecipe, difficulty: e.target.value })} fullWidth> <MenuItem value="">Sélectionner la difficulté</MenuItem> <MenuItem value="Facile">Facile</MenuItem> <MenuItem value="Moyen">Moyen</MenuItem> <MenuItem value="Difficile">Difficile</MenuItem> </Select> </div>
                <div className="form-row"> <TextField label="Type de cuisine" value={newRecipe.cuisine_type} onChange={(e) => setNewRecipe({ ...newRecipe, cuisine_type: e.target.value })} fullWidth /> </div>
                <div className="form-row"> <TextField label="Régime" value={newRecipe.diet} onChange={(e) => setNewRecipe({ ...newRecipe, diet: e.target.value })} fullWidth /> </div>
                <div className="form-row"> <TextField label="Ingrédients" multiline rows={4} value={newRecipe.ingredients} onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value })} fullWidth error={!!formErrors.ingredients} helperText={formErrors.ingredients} /> </div>
                <div className="form-row"> <TextField label="Instructions" multiline rows={4} value={newRecipe.instructions} onChange={(e) => setNewRecipe({ ...newRecipe, instructions: e.target.value })} fullWidth error={!!formErrors.instructions} helperText={formErrors.instructions} /> </div>
                <div className="form-row"> <TextField label="Calories" type="number" value={newRecipe.calories} onChange={(e) => setNewRecipe({ ...newRecipe, calories: e.target.value })} fullWidth /> </div>
                <div className="form-row"> <TextField label="Glucides (g)" type="number" value={newRecipe.carbohydrates} onChange={(e) => setNewRecipe({ ...newRecipe, carbohydrates: e.target.value })} fullWidth /> </div>
                <div className="form-row"> <TextField label="Lipides (g)" type="number" value={newRecipe.fat} onChange={(e) => setNewRecipe({ ...newRecipe, fat: e.target.value })} fullWidth /> </div>
                <div className="form-row"> <TextField label="Sucre (g)" type="number" value={newRecipe.sugar} onChange={(e) => setNewRecipe({ ...newRecipe, sugar: e.target.value })} fullWidth /> </div>
                <div className="form-row"> <TextField label="Protéines (g)" type="number" value={newRecipe.protein} onChange={(e) => setNewRecipe({ ...newRecipe, protein: e.target.value })} fullWidth /> </div>
                <div className="flex justify-end gap-4 mt-4"> <Button variant="outlined" onClick={() => setIsEditingRecipe(false)}> <FontAwesomeIcon icon={faTimes} /> Annuler </Button> <Button variant="contained" onClick={handleAddMealPlan} disabled={loading}> {loading ? 'Chargement...' : <><FontAwesomeIcon icon={faSave} /> Enregistrer et Ajouter</>} </Button> </div>
            </div>
        );
    };

    return (
        <div className="meal-planner-container">
            <div className="left-section">
                <div className="calendar-container"> <Calendar value={date} onChange={setDate} locale="fr-FR" className="custom-calendar" /> </div>
                <div className="nutrition-summary">
                    <h3>Résumé nutritionnel de la journée </h3>
                    <div className="nutrition-grid">
                        <div className="nutrition-item"> <span className="nutrition-label">Calories:</span> <span className="nutrition-value calories">{nutritionSummary.calories} kcal ⚡</span> </div>
                        <div className="nutrition-item"> <span className="nutrition-label">Protéines:</span> <span className="nutrition-value protein">{nutritionSummary.protein} g </span> </div>
                        <div className="nutrition-item"> <span className="nutrition-label">Glucides:</span> <span className="nutrition-value carbs">{nutritionSummary.carbohydrates} g </span> </div>
                        <div className="nutrition-item"> <span className="nutrition-label">Lipides:</span> <span className="nutrition-value fat">{nutritionSummary.fat} g </span> </div>
                    </div>
                </div>
            </div>
            <div className="meal-plan-content">
                <div className="meal-plan-header">
                    <h2> Planification pour {date.toLocaleDateString()} </h2>
                    <div className="meal-plan-form">
                        <select value={mealType} onChange={e => setMealType(e.target.value)}>
                            <option value="breakfast"><FontAwesomeIcon icon={faSun} />  Petit déjeuner 🥞 </option>
                            <option value="lunch"><FontAwesomeIcon icon={faUtensils} />  Déjeuner 🍱 ️</option>
                            <option value="dinner"><FontAwesomeIcon icon={faMoon} />  Dîner 🍲 </option>
                            <option value="snack"> Snack 🍪 </option>
                        </select>
                        {renderRecipeForm()}
                    </div>
                </div>
                {error && <p className="error-message">{error}</p>}
                <div className="meal-plan-list">
                    <h3>Planification </h3>
                    {loading ? (
                        <p>Chargement des plans de repas... ⏳</p>
                    ) : (
                        ['breakfast', 'lunch', 'dinner', 'snack'].map((type) => (
                            <div key={type} className="meal-plan-section">
                                <h4 className={type}>{type.charAt(0).toUpperCase() + type.slice(1)} </h4>
                                <AnimatePresence>
                                    {mealPlans
                                        .filter((plan) => plan.meal_type === type)
                                        .map((plan) => {
                                            const recipe = plan.recipe;
                                            let imageUrl = recipe?.image;
                                            if (recipe?.image && !recipe?.image.startsWith('http')) {
                                                imageUrl = `http://localhost:8000/storage/${recipe?.image}`;
                                            }
                                            return (
                                                <motion.div
                                                    key={plan.id}
                                                    className="meal-plan-item"
                                                    variants={mealPlanItemVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                >
                                                    <img
                                                        src={imageUrl}
                                                        alt={recipe?.title}
                                                        className="recipe-image"
                                                        onClick={() => afficherDetailsRecette(recipe)}
                                                    />
                                                    <div className="meal-plan-details">
                                                        <span>{recipe?.title}</span>
                                                        <Button
                                                            variant="outline-primary"
                                                            className="eye-button"
                                                            onClick={() => afficherDetailsRecette(recipe)}
                                                        >
                                                            <Eye />
                                                        </Button>
                                                        <Button
                                                            className="delete-button"
                                                            variant="destructive"
                                                            onClick={() => handleSupprimerMealPlan(plan.id)}
                                                        >
                                                            <FontAwesomeIcon icon={faTrashAlt} />
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                </AnimatePresence>
                            </div>
                        ))
                    )}
                </div>
                {selectedRecipeId && detailsRecette && (
                    <div className="recipe-details-modal">
                        <div className="recipe-details-content">
                            <h2>{detailsRecette.title} ️</h2>
                            {detailsRecette.image && (
                                <img
                                    src={detailsRecette.image.startsWith('http') ? detailsRecette.image : `http://localhost:8000/storage/${detailsRecette.image}`}
                                    alt={detailsRecette.title}
                                    className="details-image"
                                />
                            )}
                            <div className="recipe-details-info">
                                <div className="recipe-details-section"> <h3><FontAwesomeIcon icon={faInfoCircle} /> Informations générales</h3> <p><strong>⏱️Temps de préparation:</strong> {detailsRecette.ready_in_minutes} min </p> <p><strong>🍽️Portions:</strong> {detailsRecette.servings} </p> <p><strong>👨‍🍳Difficulté:</strong> {detailsRecette.difficulty} ‍</p> {detailsRecette.cuisine_type && <p><strong>🌍Type de cuisine:</strong> {detailsRecette.cuisine_type} </p>} {detailsRecette.diet && <p><strong>🥗Régime:</strong> {detailsRecette.diet} </p>} </div>
                                <div className="recipe-details-section"> <h3>🛒Ingrédients </h3> <p>{detailsRecette.ingredients}</p> </div>
                                <div className="recipe-details-section"> <h3>📝Instructions ‍</h3> <p>{detailsRecette.instructions}</p> </div>
                                <div className="recipe-details-section"> <h3>Informations nutritionnelles ⚡</h3> {detailsRecette.calories && <p><strong>Calories:</strong> {detailsRecette.calories} kcal</p>} {detailsRecette.carbohydrates && <p><strong>Glucides:</strong> {detailsRecette.carbohydrates} g </p>} {detailsRecette.fat && <p><strong>Lipides:</strong> {detailsRecette.fat} g </p>} {detailsRecette.sugar && <p><strong>Sucre:</strong> {detailsRecette.sugar} g </p>} {detailsRecette.protein && <p><strong>Protéines:</strong> {detailsRecette.protein} g </p>} </div>
                            </div>
                            <button onClick={() => setSelectedRecipeId(null)}>Fermer ❌</button>
                        </div>
                    </div>
                )}
                <Swal show={showConfirm} title="Êtes-vous sûr ?" text="Voulez-vous vraiment retirer ce plan de repas ?" showCancelButton confirmButtonText="Oui, retirer ✅" cancelButtonText="Annuler ❌" onConfirm={supprimerMealPlan} onCancel={handleCancelDelete} />
            </div>
        </div>
    );
}

export default MealPlanner;