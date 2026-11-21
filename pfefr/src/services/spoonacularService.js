import axios from "axios";

const API_URL = "http://localhost:8000/api"; // L'URL de ton backend Laravel

export const searchRecipes = async (ingredients) => {
    try {
        const response = await axios.get(`${API_URL}/search-recipes`, {
            params: { ingredients }
        });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des recettes :", error);
        return [];
    }
};

export const getRecipeDetails = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/recipes/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des détails de la recette :", error);
        return null;
    }
};
