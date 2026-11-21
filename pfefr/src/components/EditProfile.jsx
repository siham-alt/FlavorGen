import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';

const EditProfile = ({ handleClose }) => {
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        mot_de_passe_actuel: '',
        password: '',
        password_confirmation: '',
    });

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = JSON.parse(localStorage.getItem('token'));
        console.log(token);
        if (!token) {
            setError('Veuillez vous connecter.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.put(
                'http://localhost:8000/api/updateProfile',
                {
                    nom: formData.nom,
                    email: formData.email,
                    mot_de_passe_actuel: formData.mot_de_passe_actuel,
                    password: formData.password,
                    password_confirmation: formData.password_confirmation,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Correct way to use template literals
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );

            console.log("Réponse de l'API:", response.data);
            setSuccessMessage('Profil mis à jour avec succès.');
            setError('');
            handleClose();
        } catch (apiError) {
            console.error("Erreur lors de la mise à jour du profil:", apiError);
            setError('Erreur lors de la mise à jour du profil. Veuillez réessayer.');
            setSuccessMessage('');

            if (apiError.response && apiError.response.data && apiError.response.data.errors) {
                setError(JSON.stringify(apiError.response.data.errors));
            } else if (apiError.response && apiError.response.status === 500) {
                setError('Erreur interne du serveur. Veuillez réessayer plus tard.');
            } else if (apiError.response && apiError.response.status === 422) {
                setError('Le mot de passe actuel est incorrect.');
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="modal">
            <div className="modal-content d-flex">
                <div className="w-50 bg-image p-5 d-flex flex-column align-items-center rounded-start text-dark" style={{ backgroundImage: 'url(/images/a.avif)', backgroundSize: 'cover', backgroundPosition: 'top', backgroundRepeat: 'no-repeat', padding: '2rem', justifyContent: 'flex-start' }}>
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <h2 className="fs-3 fw-bold" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Mettre à jour votre profil</h2>
                        <p className="mt-2" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>Modifiez vos informations personnelles</p>
                    </div>
                </div>

                <div className="w-50 p-5 position-relative">
                    <button className="btn-close position-absolute top-0 end-0 p-3" onClick={handleClose}></button>
                    <h2 className="fs-4 fw-bold text-dark text-center mb-4">Mettre à jour le profil</h2>
                    {error && <p className="text-danger text-center">{error}</p>}
                    {successMessage && <p className="text-success text-center">{successMessage}</p>}
                    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                        <input type="text" name="nom" value={formData.nom} onChange={handleChange} placeholder="Votre nom" className="form-control" />
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Votre email" className="form-control" />
                        <input type="password" name="mot_de_passe_actuel" value={formData.mot_de_passe_actuel} onChange={handleChange} placeholder="Mot de passe actuel" className="form-control" required />
                        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Nouveau mot de passe" className="form-control" />
                        <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} placeholder="Confirmer le mot de passe" className="form-control" />

                        <button type="submit" className="btn btn-custom text-white py-2 mt-3 w-100" disabled={loading}>
                            {loading ? 'Chargement...' : 'Mettre à jour'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;