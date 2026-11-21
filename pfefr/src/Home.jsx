import React, { useState, useEffect } from "react";
import "./Home.css";
import Login from "./Login";
import Signup from "./Signup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FaSearch, FaCalendarAlt, FaStar } from 'react-icons/fa';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import RecipeGenerator from "./RecipeGenerator";
import RecipesList from "./RecipesList";
import Testimonials from "./Testimonials";
import UserProfile from "./UserProfile";



const dishes = [
    { id: 1, name: "Gourmet Burger", img: "/images/pfe.png" },
    { id: 2, name: "Pasta Carbonara", img: "/images/plat.png" },
    { id: 3, name: "Margherita Pizza", img: "/images/photo.png" },
    { id: 4, name: "plat", img: "/images/pho1.png" },


];

function Home() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState(1);
    const [animation, setAnimation] = useState("initial");
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
    const [popularRecipes, setPopularRecipes] = useState([]);
    const [selectedDish, setSelectedDish] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [contactName, setContactName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [contactMessage, setContactMessage] = useState("");
    const [contactStatus, setContactStatus] = useState("");
    const navigate = useNavigate(); // Initialize useNavigate here
    const [contactSuccess, setContactSuccess] = useState(false); // New state for success message


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

    const getFirstLetter = (name) => {
        if (name) {
            return name.charAt(0).toUpperCase();
        }
        return "";
    };

    const handleNextDish = () => {
        setSelectedDish((prevIndex) => (prevIndex + 1) % dishes.length);
    };

    const fetchPopularRecipes = async () => {
        try {
            const response = await axios.get("https://api.spoonacular.com/recipes/random", {
                params: {
                    apiKey: "9b9ba307be4646eea2f3cb0c7b3977a9",
                    number: 3,
                },
            });
            setPopularRecipes(response.data.recipes);
        } catch (error) {
            console.error("Error fetching popular recipes", error);
        }
    };

    useEffect(() => {
        fetchPopularRecipes();
    }, []);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isTransitioning) {
                setTimeout(() => {
                    setIsTransitioning(true);
                    setAnimation("slide-out");
                    setTimeout(() => {
                        setCurrentIndex(nextIndex);
                        setNextIndex((prevIndex) => (prevIndex + 1) % dishes.length);
                        setAnimation("slide-in");
                        setTimeout(() => {
                            setAnimation("initial");
                            setIsTransitioning(false);
                        }, 300); // Réduction du délai à 300ms
                    }, 300); // Réduction du délai à 300ms
                }, 1000); // Réduction du délai à 2000ms
            }
        }, 500); // Réduction du délai à 3000ms
    
        return () => clearTimeout(timer);
    }, [nextIndex, isTransitioning]);
    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setContactStatus("Envoi en cours...");
        setContactSuccess(false); // Reset success message

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: contactName,
                    email: contactEmail,
                    message: contactMessage,
                }),
            });

            console.log("Response from server:", response); // Log de la réponse du serveur

            if (!response.ok) {
                // Si la réponse n'est pas OK (statut 2xx), lancez une erreur
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de l'envoi du message.");
            }

            const data = await response.json();
            setContactStatus(data.message);
            setContactSuccess(true); // Set success to true

            setContactName("");
            setContactEmail("");
            setContactMessage("");

            // Optionally, clear the status message after a few seconds
            setTimeout(() => {
                setContactStatus("");
                setContactSuccess(false);
            }, 3000);

        } catch (error) {
            console.error("Erreur lors de la requête:", error);
            setContactStatus(error.message || "Une erreur est survenue.");
            setContactSuccess(false);
        }
    };
    const [loginError, setLoginError] = useState(null);

    const handleStartNowClick = () => {
        if (user) {
            // User is logged in, navigate to dashboard
            window.location.href = "/Dashboard";
        } else {
            // User is not logged in, display error message
            setLoginError("Please log in first to access the dashboard.");
        }
    };

    const goToHomePage = () => {
        navigate("/"); // Navigate to the root path (home page)
    };
    return (
        <div className="home-container">
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
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-left">
                        <h1>Welcome to FlavorGen</h1>
                        <p>
                            Discover a new way to cook with FlavorGen. Find delicious recipes using the ingredients you already have, scan your refrigerator to automatically detect your ingredients, and save your favorite recipes for easy access.
                        </p>
                        <button onClick={handleStartNowClick} className="btn start-btn">
                            Start Now
                        </button>
                        {loginError && <p className="error-message">{loginError}</p>}           
                           </div>
                    <div className="plats-section">
                        <div className="plats-container">
                            <img
                                src={dishes[currentIndex].img}
                                alt={dishes[currentIndex].name}
                                className={`plat-item ${animation}`}
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section className="features">
                <h2>Key Features</h2>
                <div className="features-grid">
                    {[
                        { icon: <FaSearch />, title: "Easy Search", text: "Find recipes with what you have." },
                        { icon: <FaCalendarAlt />, title: "Meal Planning", text: "Plan your meals in advance." },
                        { icon: <FaStar />, title: "Favorites", text: "Save your favorite recipes." },
                    ].map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.text}</p>
                        </div>
                    ))}
                </div>
            </section>
            <br /><br /><br /><br /><br />
            <section className="recettes-populaires">
                <h2>Popular Recipes</h2>
                <div className="recettes-grid">
                    {popularRecipes.map((recipe) => (
                        <div key={recipe.id} className="recette-card">
                            <img src={recipe.image} alt={recipe.title} />
                            <div className="recette-content">
                                <h3>{recipe.title}</h3>
                                <p>{recipe.summary.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...'}</p>
                                <Link to={`/recipe/${recipe.id}`} className="btn">View Recipe</Link>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Link to="/recipeslist" className="btn">View More</Link>
                </div>
            </section>
            <br /><br />
            {isLoginModalOpen && <Login closeModal={() => setIsLoginModalOpen(false)} toggleSignupModal={() => { setIsLoginModalOpen(false); setIsSignupModalOpen(true); }} />}
            {isSignupModalOpen && <Signup closeModal={() => setIsSignupModalOpen(false)} toggleLoginModal={() => { setIsSignupModalOpen(false); setIsLoginModalOpen(true); }} />}
            {showModal && <RecipeGenerator show={showModal} handleClose={() => setShowModal(false)} />}
            <Testimonials user={user} />
            <br></br><br></br><br></br><br></br><br></br><br></br>
            <footer className="footer-new">
    <div className="footer-wave"></div>
    <div className="footer-container">
        <div className="footer-top">
            <div className="footer-brand">
                <h1 className="logo1">FlavorGen</h1>
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
                        <li><Link to="/recipegenerator">Generate Recipes</Link></li> 
                        <li><Link to="/history">History</Link></li>
                        <li><Link to="/MealPlanner">meal plannig</Link></li>

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
                <form onSubmit={handleContactSubmit}>
    <input
        type="text"
        placeholder="Your Name"
        value={contactName}
        onChange={(e) => setContactName(e.target.value)}
    />
    <input
        type="email"
        placeholder="Your Email"
        value={contactEmail}
        onChange={(e) => setContactEmail(e.target.value)}
    />
    <textarea
        placeholder="Your Message"
        value={contactMessage}
        onChange={(e) => setContactMessage(e.target.value)}
    ></textarea>
    <button type="submit">Send Message</button>
    {contactStatus && (
            <p
                className={
                    contactSuccess
                        ? "success-message"
                        : contactStatus === "Envoi en cours..."
                        ? "sending-message"
                        : "error-message"
                }
            >
                {contactStatus}
            </p>
        )}    </form>
            </div>
        </div>
        <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} FlavorGen. All rights reserved.</p>
        </div>
    </div>
</footer>
        </div>
    );
}

export default Home;