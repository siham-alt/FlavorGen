import React, { useState } from 'react';
import axios from "axios";

const Signup = ({ closeModal, toggleLoginModal }) => {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", { withCredentials: true });

      const response = await axios.post("http://localhost:8000/api/signup", {
        nom,
        email,
        password,
        password_confirmation: confirmPassword,
      });

      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);

      setSuccessMessage("Signup successful! !");
      closeModal();
      toggleLoginModal();
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setError(Object.values(err.response.data.errors).flat().join("\n"));
      } else {
        setError("An error occurred. Please try again.");
      }
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content d-flex">
        <div className="w-50 bg-image p-5 d-flex flex-column align-items-center rounded-start text-dark"
          style={{ backgroundImage: `url('/images/a.avif')`, backgroundSize: 'cover', backgroundPosition: 'top', backgroundRepeat: 'no-repeat', padding: '2rem', justifyContent: 'flex-start' }}>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2 className="fs-3 fw-bold" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Welcome !</h2>
            <p className="mt-2" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>Discover unique recipes from your ingredients</p>
          </div>
        </div>

        <div className="w-50 p-5 position-relative">
          <button className="btn-close position-absolute top-0 end-0 p-3" onClick={closeModal}></button>
          <h2 className="fs-4 fw-bold text-dark text-center mb-4">Signup</h2>
          {successMessage && <p className="text-success text-center">{successMessage}</p>}
          {error && <p className="text-danger text-center">{error}</p>}

          <form onSubmit={handleSignup} className="d-flex flex-column gap-3">
            <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} placeholder=" Username" className="form-control" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="form-control" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder=" Password" className="form-control" />
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="form-control" />

            <button type="submit" className="btn btn-custom text-white py-2 mt-3 w-100" disabled={loading}>
              {loading ? "Loading..." : "Signup"}
            </button>
          </form>

          <p className="mt-4 text-center text-muted">
          Already registered? <span className="text-warning fw-semibold cursor-pointer text-decoration-underline" onClick={toggleLoginModal}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;