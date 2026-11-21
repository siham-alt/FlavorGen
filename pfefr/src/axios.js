import axios from 'axios';

const instance = axios.create({
 baseURL: 'http://127.0.0.1:8000/api', // L'URL de votre API Laravel
  withCredentials: true, // Important pour les cookies de session
  
});

export default instance;
