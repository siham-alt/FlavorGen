import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import RecipesList from './RecipesList';
import Preferences from "./Preferences";
import RecipeSearch from "./RecipeSearch";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from './ResetPassword';
import Dashboard from './components/Dashboard';
import History from './components/History';
import RecipeDetails from './RecipeDetails'; // Importez RecipeDetails
import MealPlanner from './components/MealPlanner'; // Ajouté ici
import Admin from './admin/adDashboard';  


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/preferences" element={<Preferences />} />
                <Route path="/recipes" element={<RecipeSearch />} />
                <Route path="/recipeslist" element={<RecipesList />} />
                <Route path="/Dashboard/*" element={<Dashboard />} /> {/* Modifié ici */}
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/History" element={<History />} />
                <Route path="/MealPlanner" element={<MealPlanner />} />
                <Route path="/recipe/:id" element={<RecipeDetails />} /> {/* Route pour RecipeDetails */}
                <Route path='/admin/*' element={<Admin />} />


            </Routes>
        </Router>
    );
}

export default App;