import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ handleLogout, handleShowModal }) {
    const navigate = useNavigate();

    const handleLogoutAndNavigate = () => {
        handleLogout();
        navigate('/');
    };

    return (
        <div className="sidebar">
            <NavLink to="/" className="sidebar-link">🏠Home</NavLink>
            <NavLink to="/Dashboard" className="sidebar-link">🍽️️Recipe Generator</NavLink>
            <NavLink to="/Dashboard/Favorites" className="sidebar-link">⭐Favorites</NavLink>
            <NavLink
                to="/Dashboard/EditProfile"
                className="sidebar-link"
                onClick={(e) => {
                    e.preventDefault();
                    handleShowModal();
                }}
            >
                ⚙ Settings
            </NavLink>
            <NavLink to="/Dashboard/MealPlanner" className="sidebar-link">📆 Meal Planner</NavLink>
            <NavLink to="/Dashboard/History" className="sidebar-link">📜 History</NavLink>
            <button className="sidebar-link sidebar-logout" onClick={handleLogoutAndNavigate}>🔓Logout</button>
        </div>
    );
}

export default Sidebar;