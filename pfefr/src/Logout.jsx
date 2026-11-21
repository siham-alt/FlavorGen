import React from 'react';
import axios from 'axios';

const Logout = () => {
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/api/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Supprimer le token
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (err) {
      console.log('Error logging out:', err);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
