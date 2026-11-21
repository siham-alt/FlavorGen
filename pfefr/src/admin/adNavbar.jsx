import React, { useState } from 'react';
import './adNavbar.css';
import { useNavigate } from 'react-router-dom';
import EditProfile from '../components/EditProfile'; // Importing the EditProfile modal
import { PersonCircle } from 'react-bootstrap-icons'; // Importing a profile icon

function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
    const userData = localStorage.getItem('user');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const openEditProfileModal = () => {
        setIsModalOpen(true); // Open the modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    if (!userData) {
        return (
            <div className="navbarr">
                <div className="user-avatar-container">
                    <PersonCircle size={30} className="user-avatar-icon-guest" />
                </div>
            </div>
        );
    }

    try {
        const user = JSON.parse(userData);

        return (
            <div className="navbarr">
                <div className="user-profile-container">
                    <div className="user-avatar-container" onClick={toggleDropdown}>
                        <PersonCircle size={30} className="user-avatar-icon" />
                    </div>
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            <div className="dropdown-item">
                                <div className="user-nom">{user.nom}</div>
                            </div>
                            <div className="dropdown-item" onClick={openEditProfileModal}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear-fill me-2" viewBox="0 0 16 16">
                                    <path d="M9.405 1.05c-.413-1.032-1.989-1.032-2.402 0l-.641 1.567a3.615 3.615 0 0 1-1.86a.916.916 0 0 0-1.06.437l-1.072 1.072a.751.751 0 0 0 .685 1.06l1.567.643a3.615 3.615 0 0 1 .906 1.86H1.032a1.032 1.032 0 0 0 0 2.064h1.032a3.615 3.615 0 0 1-.906 1.86l-1.567.643a.751.751 0 0 0-.685 1.06l1.072 1.072a.916.916 0 0 0 1.06.437l.641 1.567c.413 1.032 1.989 1.032 2.402 0l.641-1.567a3.615 3.615 0 0 1 1.86.906.916.916 0 0 0 1.06-.437l1.072-1.072a.751.751 0 0 0-.685-1.06l-1.567-.643a3.615 3.615 0 0 1-.906-1.86h1.032a1.032 1.032 0 0 0 0-2.064H13.968a3.615 3.615 0 0 1 .906-1.86l1.567-.643a.751.751 0 0 0 .685-1.06l-1.072-1.072a.916.916 0 0 0-1.06-.437l-.641-1.567a.413.413 0 0 0-.827 0zM8 10.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                                </svg>
                                Paramètres
                            </div>
                            <div className="dropdown-item" onClick={handleLogout}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-left me-2" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 2.5 2h8A1.5 1.5 0 0 1 12 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 1 12.5v-2a.5.5 0 0 1 1 0v2z"/>
                                    <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                                </svg>
                                Déconnexion
                            </div>
                        </div>
                    )}
                </div>

                {/* Displaying the EditProfile modal */}
                {isModalOpen && <EditProfile handleClose={handleCloseModal} />}
            </div>
        );
    } catch (error) {
        console.error("Error parsing user data:", error);
        return (
            <div className="navbar">
                <div className="user-avatar-container">
                    <PersonCircle size={30} className="user-avatar-icon-error" />
                </div>
            </div>
        );
    }
}

export default Navbar;