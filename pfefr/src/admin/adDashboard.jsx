import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Import Navigate
import axios from "axios";
import Sidebar from "./adSidebar";
import Users from "./adUsers";
import Stats from "./IngredientStats";
import Navbar from "./adNavbar";
import './addash.css';
import ContactMessages from "./ContactMessages";

const Admin = () => {
    const [activeUsers, setActiveUsers] = useState(0);
    const [inactiveUsers, setInactiveUsers] = useState(0);
    const token = JSON.parse(localStorage.getItem("token"));

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/users/stats", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setActiveUsers(response.data.active);
            setInactiveUsers(response.data.inactive);
        })
        .catch(error => console.error("Erreur lors du chargement des stats :", error));
    }, []);

    return (
        <div className="dashboard">
            <Sidebar className="sidebar" />
            <div className="dashboard-content">
                <Navbar />
                <div className="main-content">
                    {/* Cartes des statistiques */}

                    <Routes>
                        {/* Default route to display Stats */}
                        <Route path="/" element={<Navigate to="stats" />} />
                        <Route path="users" element={<Users />} />
                        <Route path="stats" element={<Stats />} />
                        <Route path="contacts" element={<ContactMessages />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Admin;