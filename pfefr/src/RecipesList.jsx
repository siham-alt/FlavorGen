import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RecipesList.css';
import Login from './Login';
import Signup from './Signup';
import UserProfile from './UserProfile';
import './Home.css';


import { faFacebookF, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimesCircle, faListUl } from '@fortawesome/free-solid-svg-icons';

function RecipesList() {
    const [recipes, setRecipes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recipesPerPage = 15;
    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate here

    const apiKey = '9b9ba307be4646eea2f3cb0c7b3977a9';

    useEffect(() => {
        const checkUserConnection = () => {
            const userData = localStorage.getItem("user");
            const tokenData = localStorage.getItem("token");

            if (userData && tokenData) {
                try {
                    const user = JSON.parse(userData);
                    setUser(user);
                } catch (error) {
                    console.error("Parsing error:", error);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        checkUserConnection();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const getFirstLetter = (nom) => {
        if (nom) {
            return nom.charAt(0).toUpperCase();
        }
        return "";
    };

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
                    params: {
                        apiKey: apiKey,
                        number: recipesPerPage,
                        offset: (currentPage - 1) * recipesPerPage,
                        query: searchQuery,
                    },
                });
                setRecipes(response.data.results);
            } catch (error) {
                console.error('Error fetching recipes', error);
            }
        };

        fetchRecipes();
    }, [currentPage, searchQuery]);

    const totalPages = Math.ceil(240 / recipesPerPage);

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
    };
    const goToHomePage = () => {
        navigate("/"); // Navigate to the root path (home page)
    };

    return (
        <div className="recipes-list-container">
            <nav className="navbar">
            <h1 className="logo" onClick={goToHomePage} style={{ cursor: 'pointer' }}>
                    <img src="/log1.jpg" alt="FlavorGen Logo" className="logo-image" />
                    FlavorGen
                </h1>
                <Link to="/recipeslist" className="nav-link">Recipe Lists</Link>
                {user ? (
                    <div className="user-profile">
                        <div className="dropdown">
                            <button className="dropdown-button" onClick={toggleDropdown}>
                                {getFirstLetter(user.nom)}
                            </button>
                            {isDropdownOpen && (
                                <div className="dropdown-content">
                                    <UserProfile user={user} handleLogout={handleLogout} />
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="auth-links">
                        <button onClick={() => setIsLoginModalOpen(true)} className="btn">Login</button>
                        <button onClick={() => setIsSignupModalOpen(true)} className="btn">Signup</button>
                    </div>
                )}
            </nav>
            <br />
            <h2>
                <FontAwesomeIcon icon={faListUl} style={{ marginRight: '10px' }} />
                RECIPE LIST
            </h2>
            <div className="search-bar">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                {searchQuery && (
                    <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="clear-icon"
                        onClick={handleClearSearch}
                    />
                )}
            </div>
            <div className="recipes-grid">
                {recipes.map(recipe => (
                    <div key={recipe.id} className="recipe-card">
                        <img src={recipe.image} alt={recipe.title} />
                        <h3>{recipe.title}</h3>
                        <Link to={`/recipe/${recipe.id}`} className="btn">View Recipe</Link>
                    </div>
                ))}
            </div>

            <div className="pagination">
                <button onClick={goToPreviousPage} disabled={currentPage === 1}>Previous</button>
                <span>Page {currentPage} / {totalPages}</span>
                <button onClick={goToNextPage} disabled={currentPage === totalPages}>Next</button>
            </div><br></br>
<br></br> <br></br> <footer className="footer-new">
    <div className="footer-wave"></div>
    <div className="footer-container">
        <div className="footer-top">
            <div className="footer-brand">
                <h1 className="logo">FlavorGen</h1>
                <p>Your destination for delicious recipes and culinary tips.</p>
                <div className="social-icons">
                    <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
                    <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
                    <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
                    <a href="#"><FontAwesomeIcon icon={faYoutube} /></a>
                </div>
            </div>
            <div className="footer-links-grid">
                <div className="footer-links-column">
                    <h3>Explore</h3>
                    <ul>
                        <li><Link to="/recipeslist">Recipes</Link></li>
                        <li><Link to="/recipes">Generate Recipes</Link></li> 
                        <li><Link to="/history">History</Link></li>
                    </ul>
                </div>
                <div className="footer-links-column">
                    <h3>Account</h3>
                    <ul>
                        <li><Link to="/profile">Profile</Link></li>
                        {/* Ajoutez d'autres liens liés au compte si nécessaire */}
                    </ul>
                </div>
                <div className="footer-links-column">
                    <h3>Legal</h3>
                    <ul>
                        <li><a href="#">Privacy</a></li>
                        <li><a href="#">Terms</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-contact">
                <h3>Contact Us</h3>
                <p>Have questions or feedback? Reach out to us!</p>
                <form>
                    <input type="text" placeholder="Your Name" />
                    <input type="email" placeholder="Your Email" />
                    <textarea placeholder="Your Message"></textarea>
                    <button type="submit">Send Message</button>
                </form>
            </div>
        </div>
        <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} FlavorGen. All rights reserved.</p>
        </div>
    </div>
</footer>
            {isLoginModalOpen && <Login closeModal={() => setIsLoginModalOpen(false)} toggleSignupModal={() => { setIsLoginModalOpen(false); setIsSignupModalOpen(true); }} />}
            {isSignupModalOpen && <Signup closeModal={() => setIsSignupModalOpen(false)} toggleLoginModal={() => { setIsSignupModalOpen(false); setIsLoginModalOpen(true); }} />}

        </div>
        
    );
}

export default RecipesList;