import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

function Preferences({ preferences, onClose }) {
    const navigate = useNavigate();
    const [localPreferences, setLocalPreferences] = useState({
        intolerances: preferences?.intolerances || "",
        diet: preferences?.diet || "",
    });

    const handleChange = (e) => {
        setLocalPreferences({ ...localPreferences, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const intolerancesList = localPreferences.intolerances
            .split(",")
            .map((intolerance) => intolerance.trim())
            .filter(Boolean)
            .join(",");

        localStorage.setItem("intolerances", intolerancesList);
        localStorage.setItem("diet", localPreferences.diet);
        console.log("Préférences enregistrées :", localPreferences);
        if (onClose) {
            onClose(localPreferences); // Pass the updated preferences back
        }
        navigate(-1);
    };

    return (
        <div className="container mt-4">
            <h2>Vos Préférences Alimentaires</h2>
            <p>Veuillez indiquer vos intolérances et votre régime alimentaire.</p>

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Intolérances</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ex: Gluten, Lait, Noix..."
                        name="intolerances"
                        value={localPreferences.intolerances}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Régime Alimentaire</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ex: Végétarien, Sans Gluten, Paléo..."
                        name="diet"
                        value={localPreferences.diet}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Enregistrer et revenir
                </Button>
            </Form>
        </div>
    );
}

export default Preferences;