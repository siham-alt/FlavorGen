import React, { useEffect, useState } from "react";
import './UserProfile.css';
import { useNavigate } from "react-router-dom";

const UserProfile = ({ handleLogout }) => {
    const userData = localStorage.getItem("user");
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (userData) {
            try {
                const user = JSON.parse(userData);
                setIsAdmin(user.role === 'admin'); // Assurez-vous que le champ 'role' existe dans vos données utilisateur
            } catch (error) {
                console.error("Erreur lors du parsing des données utilisateur :", error);
            }
        }
    }, [userData]);

    if (userData === null || userData === undefined) {
        return <div className="user-profile">Utilisateur non connecté</div>;
    }

    try {
        const user = JSON.parse(userData);

        const handleDashboardClick = () => {
            navigate('/Dashboard');
        };

        const handleAdminDashboardClick = () => {
            navigate('/admin'); // Assurez-vous que cette route existe
        };

        return (
            <div className="user-profile">
                <div>
                    <p>{user.nom}</p>
                    <p>{user.email}</p>
                    <button className="btnn" onClick={handleDashboardClick}>Dashboard (User)</button><br />
                    {isAdmin && (
                        <>
                            <button className="btnn" onClick={handleAdminDashboardClick}>Dashboard (Admin )</button><br />
                        </>
                    )}
                    <button className="btnn" onClick={handleLogout}>Déconnexion</button>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Erreur lors du parsing des données utilisateur :", error);
        return <div className="user-profile">Erreur lors du chargement du profil</div>;
    }
};

export default UserProfile;