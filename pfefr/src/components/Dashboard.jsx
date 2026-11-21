import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import Sidebar from './Sidebar';
import Navbar from './Navbar';
import RecipeGenerator from './RecipeGenerator';
import Favoris from './Favoris';
import History from './History';
import EditProfile from './EditProfile';
import MealPlanner from './MealPlanner'; // Import MealPlanner

import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleShowModal = () => {
        console.log('Showing modal');
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    return (
        <div className="dashboard">
            <Sidebar handleLogout={handleLogout} handleShowModal={handleShowModal} />
            <div className="dashboard-content">
                <Navbar />
                <div className="main-content">
                    <Routes>
                        <Route path="/" element={<RecipeGenerator />} />
                        <Route path="/Favorites" element={<Favoris />} />
                        <Route path="/History" element={<History />} />
                        <Route path="/MealPlanner" element={<MealPlanner />} /> {/* Ajout de la route pour MealPlanner */}
                    </Routes>
                    {showModal && <EditProfile handleClose={handleCloseModal} />}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;