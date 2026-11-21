import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Login = ({ closeModal, toggleSignupModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const url = '/images/a.avif'; // Store the URL in a variable

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password,
      });

      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', JSON.stringify(response.data.token));

      setSuccessMessage('Connexion réussie !');
      const user = response.data.user;
      closeModal();
      if (user && user.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      setError('Identifiants incorrects');
      setSuccessMessage('');
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await axios.post('http://localhost:8000/api/auth/google', {
        token: response.credential,
      });

      localStorage.setItem('token', JSON.stringify(res.data.token));
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setSuccessMessage('Connexion Google réussie !');
      const user = res.data.user;
      closeModal();
      if (user && user.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      setError('Erreur lors de l\'authentification Google.');
      setSuccessMessage('');
    }
  };

  const handleGoogleFailure = () => {
    setError('Google login failed. Please try again.');
    setSuccessMessage('');
  };

  // Initialize Google login script manually and render the button
  const initializeGoogleLogin = () => {
    if (window.google && window.google.accounts) { // Check if google is defined
      window.google.accounts.id.initialize({
        client_id: "356823762405-s8br8sa4lhnmf68v5uket1l7n4uirnrl.apps.googleusercontent.com",
        callback: handleGoogleSuccess,
      });
  
      window.google.accounts.id.renderButton(
        document.getElementById("google-login-button"),
        {
          theme: "outline",
          size: "medium",
          text: "Login with Google", // Set the custom text
        }
      );
    }
  };

  useEffect(() => {
    // Check if the script is already loaded
    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      initializeGoogleLogin();
    } else {
      // Load Google script dynamically if it's not already loaded
      const script = document.createElement('script');
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => initializeGoogleLogin(); // Initialize after the script is loaded
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="modal">
      <div className="modal-content d-flex">
        <div
          className="w-50 bg-image p-5 d-flex flex-column align-items-center rounded-start text-dark"
          style={{
            backgroundImage: `url(${url})`, // Use the URL variable here
            backgroundSize: 'cover',
            backgroundPosition: 'top',
            backgroundRepeat: 'no-repeat',
            padding: '2rem',
            justifyContent: 'flex-start',
          }}
        >
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2 className="fs-3 fw-bold" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
              Welcome!
            </h2>
            <p className="mt-2" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
              Discover unique recipes from your ingredients
            </p>
          </div>
        </div>

        <div className="w-50 p-5 position-relative">
          <button className="btn-close position-absolute top-0 end-0 p-3" onClick={closeModal}></button>
          <h2 className="fs-4 fw-bold text-dark text-center mb-4">Login</h2>
          {successMessage && <p className="text-success text-center">{successMessage}</p>}
          {error && <p className="text-danger text-center">{error}</p>}

          <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="form-control"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="form-control"
            />

            <div className="d-flex justify-content-between text-sm">
              <label className="d-flex align-items-center">
                <input type="checkbox" className="me-2" />
                <span>Remember me</span>
              </label>
              <a href="/forgot-password" className="text-warning text-decoration-underline">
                Mot de passe oublié ?
              </a>
            </div>

            <button type="submit" className="btn btn-custom text-white py-2 mt-3 w-100">
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-muted">
            Not registered yet?{' '}
            <span
              className="text-warning fw-semibold cursor-pointer text-decoration-underline"
              onClick={toggleSignupModal}
            >
              Sign up
            </span>
          </p>

          <div className="mt-4 d-flex justify-content-center gap-3">
            {/* Custom Google login button container */}
            <div id="google-login-button"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
