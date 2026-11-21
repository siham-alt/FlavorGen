import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Email envoyé :", email);
        try {
            const response = await axios.post("http://localhost:8000/api/forgot-password", { email });
            setMessage(response.data.status);
            setError(""); // Réinitialiser l'erreur en cas de succès
        } catch (err) {
            setError("Erreur lors de l'envoi de l'email");
        }
    };

    return (
        <div className="container">
            <h2>Réinitialisation du mot de passe</h2>
            {message && <p className="text-success">{message}</p>}
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Entrez votre email"
                    className="form-control"
                    required
                />
                <button type="submit" className="btn btn-primary mt-2">Envoyer</button>
            </form>
        </div>
    );
};

export default ForgotPassword;
