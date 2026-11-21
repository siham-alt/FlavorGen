import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUserCircle } from '@fortawesome/free-solid-svg-icons'; // Importez l'icône de profil
import './Testimonials.css';
import axios from 'axios';

const TestimonialCard = ({ testimonial }) => {
    return (
        <div className="testimonial-card">
            <div className="testimonial-header">
                <div className="testimonial-author">
                <FontAwesomeIcon icon={faUserCircle} className="profile-icon" /> {/* Icône de profil */}
                    {testimonial.user && testimonial.user.nom ? testimonial.user.nom : "Utilisateur inconnu"}</div>
                <div className="testimonial-stars">
                    {Array(testimonial.stars).fill().map((_, i) => (
                        <FontAwesomeIcon key={i} icon={faStar} className="star-icon filled" />
                    ))}
                    {Array(5 - testimonial.stars).fill().map((_, i) => (
                        <FontAwesomeIcon key={i} icon={faStar} className="star-icon" />
                    ))}
                </div>
            </div>
            <div className="testimonial-quote">
                <strong>{testimonial.title}</strong>
                <p>{testimonial.quote}</p>
            </div>
            <div className="testimonial-date">{testimonial.date}</div>
        </div>
    );
};


function Testimonials({ user }) { // Récupérez user en tant que prop
    const [newTestimonial, setNewTestimonial] = useState({
        title: '',
        quote: '',
        stars: 5,
        date: new Date().toISOString().slice(0, 10),
        user_id: null,
    });

    const [showAddForm, setShowAddForm] = useState(false);
    const [testimonials, setTestimonials] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/testimonials");
                console.log(response.data); // Vérifiez la structure des données
                setTestimonials(response.data);
            } catch (err) {
                console.error("Erreur lors de la récupération des avis", err);
                setError("Erreur lors de la récupération des avis. Veuillez réessayer.");
            }
        };

        fetchTestimonials();
    }, []);

    const handleAddTestimonial = async () => {
        const token = JSON.parse(localStorage.getItem('token'));
        if (!token) {
            setError("Veuillez vous connecter pour ajouter un avis.");
            return;
        }

        try {
            const userId = user ? user.id : null; // Récupérez l'ID de l'utilisateur à partir de l'objet user

            await axios.post('http://localhost:8000/api/testimonials', {
                ...newTestimonial,
                user_id: userId,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setTestimonials([...testimonials, { ...newTestimonial, user:{nom:user.nom} }]);
            setNewTestimonial({ title: '', quote: '', stars: 5, date: new Date().toISOString().slice(0, 10), user_id: userId });
            setShowAddForm(false);
        } catch (err) {
            console.error("Erreur lors de l'ajout d'un avis", err);
            setError("Erreur lors de l'ajout de l'avis. Veuillez réessayer.");
        }
    };

    const handleStarClick = (star) => {
        setNewTestimonial({ ...newTestimonial, stars: star });
    };

    const toggleAddForm = () => {
        setShowAddForm(!showAddForm);
    };

    return (
        <section className="testimonials">
            <h2>What Our Users Say</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="testimonials-grid">
                {testimonials.map((testimonial, index) => (
                    <TestimonialCard key={index} testimonial={testimonial} />
                ))}
            </div>
            <button onClick={toggleAddForm} className="btn start-btn">Add a Review</button>
            {showAddForm && (
                localStorage.getItem('token') ? (
                    <div className="add-testimonial">
                        <h3>Add a Review</h3>
                        <input
                            type="text"
                            placeholder="Review Title"
                            value={newTestimonial.title}
                            onChange={(e) => setNewTestimonial({ ...newTestimonial, title: e.target.value })}
                        />
                        <textarea
                            placeholder="Your Review"
                            value={newTestimonial.quote}
                            onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
                        />
                        <div className="rating">
                            {Array(5).fill().map((_, i) => (
                                <FontAwesomeIcon
                                    key={i}
                                    icon={faStar}
                                    className={`star-icon ${i < newTestimonial.stars ? 'filled' : ''}`}
                                    onClick={() => handleStarClick(i + 1)}
                                />
                            ))}
                        </div>
                        <button onClick={handleAddTestimonial}>Add</button>
                    </div>
                ) : (
                    <p className="error-message">Please log in to add a review</p>
                )
            )}
        </section>
    );
}

export default Testimonials;