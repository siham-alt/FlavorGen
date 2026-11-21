import React, { useState } from "react";
import Login from "./login";
import Signup from "./Signup";

const AuthModal = ({ closeModal }) => {
  const [isLogin, setIsLogin] = useState(true); // true = Login, false = Signup

  return (
    <div className="modal-overlay">
      {isLogin ? (
        <Login closeModal={closeModal} openSignup={() => setIsLogin(false)} />
      ) : (
        <Signup closeModal={closeModal} openLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
};

export default AuthModal;
