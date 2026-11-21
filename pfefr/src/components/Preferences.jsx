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
        console.log("Saved Preferences:", localPreferences);
        if (onClose) {
            onClose(localPreferences); // Pass the updated preferences back
        }
        navigate("/Dashboard"); // REDIRECT HERE
    };

    return (
        <div className="container mt-4">
            <h2>Your Dietary Preferences</h2>
            <p>Please indicate your intolerances and dietary preferences.</p>

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Intolerances</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ex: Gluten, Dairy, Nuts..."
                        name="intolerances"
                        value={localPreferences.intolerances}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Dietary Preference</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ex: Vegetarian, Gluten-Free, Paleo..."
                        name="diet"
                        value={localPreferences.diet}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Button variant="save" type="submit">
                    Save and Return
                </Button>
            </Form>
        </div>
    );
}

export default Preferences;