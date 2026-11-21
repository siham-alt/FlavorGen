import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import './AddToMealPlanner.css';

function AddToMealPlanner({ recipeDetails, show, onHide, onSuccess }) {
    const [date, setDate] = useState(new Date());
    const [mealType, setMealType] = useState('breakfast');
    const [error, setError] = useState(null);
    const modalRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const token = JSON.parse(localStorage.getItem("token"));

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onHide();
            }
        };

        if (show) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [show, onHide]);

    const handleAddToMealPlan = async () => {
        setError(null);
        setLoading(true);

        try {
            if (!token) {
                setError("Missing token.");
                setLoading(false);
                return;
            }

            let instructions = [];

            if (recipeDetails && recipeDetails.analyzedInstructions && recipeDetails.analyzedInstructions.length > 0) {
                recipeDetails.analyzedInstructions.forEach(instruction => {
                    instruction.steps.forEach(step => {
                        instructions.push(step.step);
                    });
                });
            } else if (recipeDetails && recipeDetails.instructions) {
                instructions = recipeDetails.instructions.split('\n');
            } else {
                instructions = ["Instructions not available."];
            }

            if (!instructions || instructions.length === 0) {
                instructions = ["Instructions not available."];
            }

            const recipeResponse = await axios.post(
                "http://localhost:8000/api/recipes",
                {
                    title: recipeDetails && recipeDetails.title ? recipeDetails.title : "Title not available",
                    image: recipeDetails && recipeDetails.image ? recipeDetails.image : null,
                    ready_in_minutes: recipeDetails && recipeDetails.readyInMinutes ? recipeDetails.readyInMinutes : null,
                    servings: recipeDetails && recipeDetails.servings ? recipeDetails.servings : null,
                    instructions: instructions.join('\n'),
                    ingredients: recipeDetails && recipeDetails.extendedIngredients ? recipeDetails.extendedIngredients.map((ing) => ing.original).join(", ") : "Ingredients not specified",
                    difficulty: recipeDetails && recipeDetails.veryPopular ? "Popular" : recipeDetails && recipeDetails.cheap ? "Economical" : "Standard",
                    cuisine_type: recipeDetails && recipeDetails.cuisines && recipeDetails.cuisines.length > 0 ? recipeDetails.cuisines.join(", ") : null,
                    diet: recipeDetails && recipeDetails.diets && recipeDetails.diets.length > 0 ? recipeDetails.diets.join(", ") : null,
                    calories: recipeDetails && recipeDetails.nutrition && recipeDetails.nutrition.nutrients ? recipeDetails.nutrition.nutrients.find(n => n.name === "Calories")?.amount || null : null,
                    carbohydrates: recipeDetails && recipeDetails.nutrition && recipeDetails.nutrition.nutrients ? recipeDetails.nutrition.nutrients.find(n => n.name === "Carbohydrates")?.amount || null : null,
                    fat: recipeDetails && recipeDetails.nutrition && recipeDetails.nutrition.nutrients ? recipeDetails.nutrition.nutrients.find(n => n.name === "Fat")?.amount || null : null,
                    sugar: recipeDetails && recipeDetails.nutrition && recipeDetails.nutrition.nutrients ? recipeDetails.nutrition.nutrients.find(n => n.name === "Sugar")?.amount || null : null,
                    protein: recipeDetails && recipeDetails.nutrition && recipeDetails.nutrition.nutrients ? recipeDetails.nutrition.nutrients.find(n => n.name === "Protein")?.amount || null : null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Recipe response:", recipeResponse.data);

            const mealPlanResponse = await axios.post(
                "http://localhost:8000/api/meal-plans",
                {
                    date: date.toISOString().split('T')[0],
                    recipe_id: recipeResponse.data.id,
                    meal_type: mealType,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Meal planner response:", mealPlanResponse.data);
            onSuccess("Recipe added successfully to meal planner.");
            setLoading(false);
            onHide();
        } catch (error) {
            if (error.response) {
                console.error("Error:", error.response.data);
                setError(JSON.stringify(error.response.data));
            } else {
                console.error("Error:", error.message);
                setError("Error adding to meal planner.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="meal-planner-modal-overlay">
            <div className="meal-planner-modal" ref={modalRef}>
                <div className="meal-planner-modal-header">
                    <h2>Add to Meal Planner</h2>
                    <button className="meal-planner-modal-close" onClick={onHide}>
                        &times;
                    </button>
                </div>
                <div className="meal-planner-modal-body">
                    <Form>
                        <Form.Group>
                            <Form.Label>Date</Form.Label>
                            <Calendar value={date} onChange={setDate} locale="en-US" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Meal Type</Form.Label>
                            <Form.Control as="select" value={mealType} onChange={(e) => setMealType(e.target.value)}>
                                <option value="breakfast">Breakfast 🥞</option>
                                <option value="lunch">Lunch 🍱</option>
                                <option value="dinner">Dinner 🍲</option>
                                <option value="snack">Snack 🍪</option>
                            </Form.Control>
                        </Form.Group>
                        {error && <Alert variant="danger">{error}</Alert>}
                    </Form>
                </div>
                <div className="meal-planner-modal-footer">
                    <Button variant="secondary" onClick={onHide}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddToMealPlan} disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Add'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default AddToMealPlanner;