import React, { useState } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { Camera, InfoCircle } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

function RecipeGenerator({ show, handleClose }) {
  const [recipeInput, setRecipeInput] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_KEY = "478b661f7bd449668bdee10b8664204e";

  const navigate = useNavigate();

  const intolerances = localStorage.getItem("intolerances") || "";
  const diet = localStorage.getItem("diet") || "";

  // Fonction pour récupérer les recettes de base
  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    setRecipes([]);

    try {
      let url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${recipeInput}&number=5&apiKey=${API_KEY}`;

      if (intolerances) {
        url += `&intolerances=${intolerances}`;
      }
      if (diet) {
        url += `&diet=${diet}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des recettes.");
      }

      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer les détails d'une recette spécifique
  const fetchRecipeDetails = async (recipeId) => {
    setLoading(true);
    try {
      const url = `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=true&apiKey=${API_KEY}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des détails de la recette.");
      }

      const data = await response.json();
      setSelectedRecipe(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Générer une recette <span className="badge bg-success">IA</span></Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="alert alert-info d-flex align-items-center">
          <InfoCircle className="me-2" />
          Soyez aussi précis que possible. Plus vous fournissez d’informations, meilleurs seront les résultats.
        </div>

        <Button variant="light" className="w-100 mb-3" disabled>
          <Camera className="me-2" /> Prends une photo de tes ingrédients
        </Button>

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Qu’aimeriez-vous cuisiner ?</Form.Label>
            <Form.Control
              type="text"
              placeholder="Saisir une idée de recette ou des ingrédients..."
              value={recipeInput}
              onChange={(e) => setRecipeInput(e.target.value)}
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button variant="link" onClick={() => navigate("/preferences")}>
              🥗 Intolérances ou régime alimentaire ?
            </Button>
          </div>
        </Form>

        {loading && <Spinner animation="border" className="mt-3 d-block mx-auto" />}
        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

        {recipes.length > 0 && (
          <div className="mt-3">
            <h5>Recettes trouvées :</h5>
            <ul className="list-group">
              {recipes.map((recipe) => (
                <li key={recipe.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <img src={recipe.image} alt={recipe.title} width="50" className="me-2" />
                    {recipe.title}
                  </div>
                  <Button size="sm" variant="info" onClick={() => fetchRecipeDetails(recipe.id)}>
                    Voir détails
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedRecipe && (
          <div className="mt-4">
            <h4>{selectedRecipe.title}</h4>
            <img src={selectedRecipe.image} alt={selectedRecipe.title} className="img-fluid rounded" />
            <h5>⏱️ Temps total :</h5>
            <p>{selectedRecipe.readyInMinutes ? `${selectedRecipe.readyInMinutes} min` : "Non spécifié"}</p>

            {selectedRecipe.nutrition && selectedRecipe.nutrition.nutrients && (
              <>
                <h5>⚡ Valeurs nutritionnelles :</h5>
                <ul>
                  <li>Calories : {selectedRecipe.nutrition.nutrients.find(n => n.name === "Calories")?.amount || "Non spécifié"} kcal</li>
                  <li>Glucides : {selectedRecipe.nutrition.nutrients.find(n => n.name === "Carbohydrates")?.amount || "Non spécifié"} g</li>
                  <li>Graisse : {selectedRecipe.nutrition.nutrients.find(n => n.name === "Fat")?.amount || "Non spécifié"} g</li>
                  <li>Sucre : {selectedRecipe.nutrition.nutrients.find(n => n.name === "Sugar")?.amount || "Non spécifié"} g</li>
                  <li>Protéines : {selectedRecipe.nutrition.nutrients.find(n => n.name === "Protein")?.amount || "Non spécifié"} g</li>
                </ul>
              </>
            )}

            <h5>🥦 Ingrédients :</h5>
            <ul>
              {selectedRecipe.extendedIngredients.map((ing) => (
                <li key={ing.id}>{ing.original}</li>
              ))}
            </ul>

            <h5>📜 Instructions :</h5>
            <p dangerouslySetInnerHTML={{ __html: selectedRecipe.instructions }}></p>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="success" className="w-100" disabled={!recipeInput || loading} onClick={fetchRecipes}>
          {loading ? "Génération en cours..." : "Générer"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RecipeGenerator;