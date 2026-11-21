import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
    const { token } = useParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8000/api/reset-password", {
                email,
                password,
                password_confirmation: passwordConfirm,
                token
            });
            setMessage(response.data.status);
            setError("");
        } catch (err) {
            setError("Erreur lors de la réinitialisation du mot de passe");
        }
    };

    return (
        <div className="container">
            <h2>Réinitialiser le mot de passe</h2>
            {message && <p className="text-success">{message}</p>}
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nouveau mot de passe" required />
                <input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} placeholder="Confirmer le mot de passe" required />
                <button type="submit" className="btn btn-primary mt-2">Réinitialiser</button>
            </form>
        </div>
    );
};

export default ResetPassword;
