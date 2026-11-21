import React from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom'; // Importez Link et useNavigate
function Navbar() {
    const userData = localStorage.getItem('user');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/'); // Redirige vers la page d'accueil après la déconnexion
    };

    if (!userData) {
        return (
            <div className="navbar">
                <div className="profile-icon">Profil</div>
            </div>
        );
    }

    try {
        const user = JSON.parse(userData);

        return (
            <div className="navbar">
                <div className="user-profile-container">
                    <div className="profile-icon">{user.nom.charAt(0).toUpperCase()}</div>
                    <div className="user-info">
                        <div className="user-name">{user.nom}</div>
                    </div>
                    
                </div>
            </div>
        );
    } catch (error) {
        console.error("Erreur lors du parsing des données utilisateur :", error);
        return (
            <div className="navbar">
                <div className="profile-icon">Erreur</div>
            </div>
        );
    }
}

export default Navbar;