import React, { useState, useRef, useEffect } from "react";
import { Button, Form, Spinner, Alert } from "react-bootstrap";
import { SendFill, HeartFill, Heart } from "react-bootstrap-icons";
import Preferences from "./Preferences";
import './RecipeGenerator.css';
import axios from 'axios';
import ImageUploader from './ImageUploader';
import MessageDisplay from './MessageDisplay';
import AddToMealPlanner from './AddToMealPlanner';

const CLARIFAI_API_KEY = "YOUR_CLARIFAI_API_KEY"; // Replace with your Clarifai API key
const CLARIFAI_MODEL_ID = "food-item-recognition"; // Corrected Model ID - Check this is the right one.

function RecipeGenerator() {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [showMealPlannerModal, setShowMealPlannerModal] = useState(false);
  const [selectedRecipeDetails, setSelectedRecipeDetails] = useState(null);

  const handleShowMealPlannerModal = (recipeDetails) => {
    setSelectedRecipeDetails(recipeDetails);
    setShowMealPlannerModal(true);
  };

  const [messages, setMessages] = useState([]);
  const [recipeInput, setRecipeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_KEY = "9b9ba307be4646eea2f3cb0c7b3977a9";
  const messagesEndRef = useRef(null);
  const [favorites, setFavorites] = useState([]);
  const [preferences, setPreferences] = useState({
    intolerances: localStorage.getItem("intolerances") || "",
    diet: localStorage.getItem("diet") || "",
  });
  const [showPreferences, setShowPreferences] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setMessages([{
      text: "Welcome to the Recipe Generator! Enter your ingredients or upload an image to start.",
      sender: "bot",
      isWelcomeMessage: true
    }]);
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => {
    setRecipeInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!recipeInput.trim()) return;
  
    setMessages(prevMessages => [...prevMessages, { text: recipeInput, sender: "user" }]);
    setRecipeInput("");
    setLoading(true);
    setError(null);
  
    try {
      const intolerancesParam = preferences.intolerances ? `&intolerances=${encodeURIComponent(preferences.intolerances)}` : '';
      const dietParam = preferences.diet ? `&diet=${encodeURIComponent(preferences.diet)}` : '';
      const query = encodeURIComponent(recipeInput);
      const API_KEY = "9b9ba307be4646eea2f3cb0c7b3977a9";
  
      const url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}${dietParam}&number=10&apiKey=${API_KEY}${intolerancesParam}`;
  
      console.log("API URL:", url);
  
      const response = await fetch(url);
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error fetching recipes: ${response.status} - ${errorData.message || response.statusText}`);
      }
  
      const data = await response.json();
  
      if (data?.results?.length === 0) {
        setMessages(prev => [...prev, {
          text: "No recipes found matching your ingredients and preferences. Please try again.",
          sender: "bot"
        }]);
      } else {
        setMessages(prev => [...prev, { text: "Here are some recipes found:", sender: "bot" }]);
        data.results.forEach(recipe => {
          setMessages(prev => [...prev, {
            text: recipe.title,
            sender: "bot",
            recipeId: recipe.id,
            recipeImage: recipe.image
          }]);
        });
      }
  
    } catch (err) {
      setError(err.message);
      setMessages(prevMessages => [...prevMessages, {
        text: `An error occurred: ${err.message}`,
        sender: "bot"
      }]);
    } finally {
      setLoading(false);
    }
  
    await logUserAction("Message sent to chatbot", `Message: ${recipeInput}`, "chatbot_message");
  };
  
  const handleRecipeClick = async (recipeId) => {
    setLoading(true);
    try {
      const url = `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=true&apiKey=${API_KEY}`;
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error("Error fetching recipe details.");
      }
  
      const data = await response.json();
  
      const hasGluten = data.extendedIngredients.some(ing =>
        ing.name.toLowerCase().includes("wheat") ||
        ing.name.toLowerCase().includes("gluten")
      );
  
      if (preferences.diet === "gluten free" && hasGluten) {
        setMessages(prevMessages => [...prevMessages, {
          sender: "bot",
          text: "Attention : Cette recette pourrait contenir du gluten, malgré votre préférence 'sans gluten'."
        }]);
      }
  
      setMessages(prevMessages => [...prevMessages, { sender: "bot", recipeDetails: data }]);
  
    } catch (err) {
      setError(err.message);
      setMessages(prevMessages => [...prevMessages, { text: "An error occurred. Please try again.", sender: "bot" }]);
    } finally {
      setLoading(false);
    }
    await logUserAction("Recipe details displayed", `Recipe ID: ${recipeId}`, "recipe_details_viewed");
  };
  
  const handlePreferencesUpdate = (updatedPreferences) => {
    setPreferences(updatedPreferences);
    localStorage.setItem("intolerances", updatedPreferences.intolerances);
    localStorage.setItem("diet", updatedPreferences.diet);
    setShowPreferences(false);
  };

  const handleAddToFavorites = async (recipeDetails) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      console.log("Retrieved token:", token);

      if (!token) {
        console.error("Missing token.");
        return;
      }

      let instructions = [];

      if (recipeDetails.analyzedInstructions && recipeDetails.analyzedInstructions.length > 0) {
        recipeDetails.analyzedInstructions.forEach(instruction => {
          instruction.steps.forEach(step => {
            instructions.push(step.step);
          });
        });
      } else if (recipeDetails.instructions) {
        instructions = recipeDetails.instructions.split('\n');
      } else {
        instructions = ["Instructions not available."];
      }

      if (!instructions || instructions.length === 0) {
        instructions = ["Instructions not available."];
      }

      const recipeResponse = await axios.post(
        "http://localhost:8000/api/recipes",
        {
          title: recipeDetails.title,
          image: recipeDetails.image,
          ready_in_minutes: recipeDetails.readyInMinutes,
          servings: recipeDetails.servings,
          instructions: instructions.join('\n'),
          ingredients: recipeDetails.extendedIngredients.map((ing) => ing.original).join(", "),
          difficulty: recipeDetails.veryPopular ? "Popular" : recipeDetails.cheap ? "Economical" : "Standard",
          cuisine_type: recipeDetails.cuisines && recipeDetails.cuisines.length > 0 ? recipeDetails.cuisines.join(", ") : null,
          diet: recipeDetails.diets && recipeDetails.diets.length > 0 ? recipeDetails.diets.join(", ") : null,
          calories: recipeDetails.nutrition.nutrients.find(n => n.name === "Calories")?.amount || null,
          carbohydrates: recipeDetails.nutrition.nutrients.find(n => n.name === "Carbohydrates")?.amount || null,
          fat: recipeDetails.nutrition.nutrients.find(n => n.name === "Fat")?.amount || null,
          sugar: recipeDetails.nutrition.nutrients.find(n => n.name === "Sugar")?.amount || null,
          protein: recipeDetails.nutrition.nutrients.find(n => n.name === "Protein")?.amount || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Recipe response:", recipeResponse.data);

      const favoriteResponse = await axios.post(
        "http://localhost:8000/api/favoris",
        { recipe_id: recipeResponse.data.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Favorites response:", favoriteResponse.data);

      setSuccessMessage("Recipe added to favorites successfully!");
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      if (error.response) {
        console.error("Error:", error.response.data);
      } else {
        console.error("Error:", error.message);
      }
      setErrorMessage("Error adding to favorites.");
      setTimeout(() => setErrorMessage(null), 5000);
    }
    await logUserAction(
      "Recipe added to favorites",
      `Recipe title: ${recipeDetails.title}`,
      "recipe_added_to_favorites",
      recipeDetails.extendedIngredients.map((ing) => ing.original),
      recipeDetails
    );
  };

  const toggleFavorite = async (recipeId) => {
    const isCurrentlyFavorite = messages.some(
      (message) => message.recipeId === recipeId && message.isFavorite
    );
  
    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.recipeId === recipeId ? { ...message, isFavorite: !message.isFavorite } : message
      )
    );
  
    try {
      const url = `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=true&apiKey=${API_KEY}`;
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error("Error fetching recipe details.");
      }
  
      const recipeDetails = await response.json();
  
      if (!isCurrentlyFavorite) {
        await handleAddToFavorites(recipeDetails);
      } else {
        await handleRemoveFromFavorites(recipeDetails.id);
        setSuccessMessage("Recipe removed from favorites.");
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    } catch (err) {
      setError(err.message);
      setMessages(prevMessages => [...prevMessages, { text: "An error occurred. Please try again.", sender: "bot" }]);
    }
  };
  

  const handleRemoveFromFavorites = async (recipeIdToRemove) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      if (!token) {
        console.error("Missing token.");
        return;
      }

      await axios.delete(`http://localhost:8000/api/favoris/${recipeIdToRemove}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(`Recipe ${recipeIdToRemove} removed from favorites.`);
    } catch (error) {
      console.error("Error removing from favorites:", error);
      setErrorMessage("Error removing from favorites.");
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const handleImageUpload = async (imageFile) => {
    setImageLoading(true);
    setError(null);
  
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
  
      // Appel à l'API Laravel pour analyser l'image
      try {
        const clarifaiResponse = await axios.post(
          "http://localhost:8000/api/clarifai/analyze",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
  
        const outputs = clarifaiResponse.data?.outputs;
  
        if (outputs && outputs.length > 0) {
          const concepts = outputs[0].data.concepts;
  
          const detectedIngredients = concepts
            .filter(concept => concept.value > 0.8)
            .map(concept => concept.name);
  
          if (detectedIngredients.length > 0) {
            setMessages(prevMessages => [
              ...prevMessages,
              {
                text: `🧠 Ingrédients détectés : ${detectedIngredients.join(', ')}`,
                sender: "bot"
              }
            ]);
            setRecipeInput(detectedIngredients.join(', '));
          } else {
            setMessages(prevMessages => [
              ...prevMessages,
              {
                text: "❗ Aucun ingrédient fiable détecté dans l'image. Essaie une autre image ou entre les ingrédients manuellement.",
                sender: "bot"
              }
            ]);
          }
        } else {
          console.error("Clarifai API response malformed:", clarifaiResponse.data);
          setMessages(prevMessages => [
            ...prevMessages,
            {
              text: "⚠ La réponse de l'API Clarifai est invalide ou ne contient pas les informations attendues.",
              sender: "bot"
            }
          ]);
          setError("Erreur lors de l'analyse de l'image : Réponse Clarifai invalide.");
        }
      } catch (clarifaiError) {
        console.error("Clarifai API Error:", clarifaiError);
        let errorMessage = "❌ Une erreur est survenue lors de l’analyse de l’image.";
        if (clarifaiError.response) {
          errorMessage += ` ${clarifaiError.response.status} - ${clarifaiError.response.data?.message || 'No details available'}`;
        } else {
          errorMessage += ` ${clarifaiError.message}`;
        }
        setMessages(prevMessages => [
          ...prevMessages,
          {
            text: errorMessage,
            sender: "bot"
          }
        ]);
        setError(errorMessage);
      } finally {
        setImageLoading(false);
      }
    } catch (err) {
      console.error("Erreur d'upload d'image :", err);
      setError("Erreur lors du chargement de l’image.");
      setImageLoading(false);
    }
  
    await logUserAction(`Image uploaded for analysis, File name: ${imageFile.name}`, "image_uploaded");
  };
  
  const logUserAction = async (action, details, type, ingredients = null, recipes = null) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      if (!token) {
        console.error("Missing token.");
        return;
      }

      await axios.post(
        "http://localhost:8000/api/history",
        {
          action,
          details,
          type,
          ingredients,
          recipes: recipes ? JSON.stringify(recipes) : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("User action logged.");
    } catch (error) {
      console.error("Error logging user action:", error);
    }
  };

  const handleAddToMealPlannerSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="recipe-generator chatbot-ui">
      <div className="preferences">
        <p>
          Dietary preferences: {preferences.diet ? `( diet : ${preferences.diet})` : '(No diet set)'}
          {preferences.intolerances ? ` (Intolerances: ${preferences.intolerances})` : ' (No intolerances set)'}
        </p>
        <Button variant="link" onClick={() => setShowPreferences(true)}>
          Modify preferences
        </Button>
      </div>

      {showPreferences && <Preferences preferences={preferences} onClose={handlePreferencesUpdate} />}

      {!showPreferences && (
        <>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender} ${message.isWelcomeMessage ? 'welcome-message' : ''}`}>
                {message.sender === "bot" && message.recipeId ? (
                  <div className="recipe-item">
                    <img src={message.recipeImage} alt={message.text} className="recipe-image" />
                    <div className="recipe-text-container">
                      <Button variant="link" onClick={() => handleRecipeClick(message.recipeId)}>
                        {message.text}
                      </Button>
                      <Button variant="link" onClick={() => toggleFavorite(message.recipeId)} className="favorite-button">
                        {message.isFavorite ? <HeartFill color="red" /> : <Heart />}
                      </Button>
                    </div>
                  </div>
                ) : message.sender === "bot" && message.recipeDetails ? (
                  <div className="recipe-details">
                    <h4>{message.recipeDetails.title}</h4>
                    <img src={message.recipeDetails.image} alt={message.recipeDetails.title} className="img-fluid rounded" />
                    <h5>⏱ Total time:</h5>
                    <p>{message.recipeDetails.readyInMinutes ? `${message.recipeDetails.readyInMinutes} min` : "Not specified"}</p>

                    <h5>🍽 Servings:</h5>
                    <p>{message.recipeDetails.servings ? `${message.recipeDetails.servings} servings` : "Not specified"}</p>

                    <h5>📝 Instructions:</h5>
                    <p dangerouslySetInnerHTML={{ __html: message.recipeDetails.instructions }}></p>

                    <h5>🛒 Ingredients:</h5>
                    <ul>
                      {message.recipeDetails.extendedIngredients.map((ing) => (
                        <li key={ing.id}>
                          {ing.amount} {ing.unit} {ing.originalName}
                        </li>
                      ))}
                    </ul>

                    <h5>👨‍🍳 Difficulty:</h5>
                    <p>{message.recipeDetails.veryPopular ? "Popular" : message.recipeDetails.cheap ? "Economical" : "Standard"}</p>

                    <h5>🌍 Cuisine type:</h5>
                    <p>{message.recipeDetails.cuisines && message.recipeDetails.cuisines.length > 0 ? message.recipeDetails.cuisines.join(", ") : "Not specified"}</p>

                    <h5>🥗 Diet:</h5>
                    <p>{message.recipeDetails.diets && message.recipeDetails.diets.length > 0 ? message.recipeDetails.diets.join(", ") : "Not specified"}</p>

                    <h5>⚡ Nutritional values:</h5>
                    <ul>
                      <li>Calories: {message.recipeDetails.nutrition.nutrients.find(n => n.name === "Calories")?.amount || "Not specified"} kcal</li>
                      <li>Carbohydrates: {message.recipeDetails.nutrition.nutrients.find(n => n.name === "Carbohydrates")?.amount || "Not specified"} g</li>
                      <li>Fat: {message.recipeDetails.nutrition.nutrients.find(n => n.name === "Fat")?.amount || "Not specified"} g</li>
                      <li>Sugar: {message.recipeDetails.nutrition.nutrients.find(n => n.name === "Sugar")?.amount || "Not specified"} g</li>
                      <li>Protein: {message.recipeDetails.nutrition.nutrients.find(n => n.name === "Protein")?.amount || "Not specified"} g</li>
                    </ul>

                    <Button variant="success" onClick={() => handleAddToFavorites(message.recipeDetails)}>
                      Add to favorites
                    </Button>
                    <Button variant="info" onClick={() => handleShowMealPlannerModal(message.recipeDetails)}>
                      Add to meal planner
                    </Button>
                  </div>
                ) : (
                  message.text
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <MessageDisplay message={successMessage} variant="success" />
          <MessageDisplay message={errorMessage} variant="danger" />

          <AddToMealPlanner
            recipeDetails={selectedRecipeDetails}
            show={showMealPlannerModal}
            onHide={() => setShowMealPlannerModal(false)}
            onSuccess={handleAddToMealPlannerSuccess}
          />

          <div className="chat-input">
            <ImageUploader onImageUpload={handleImageUpload} loading={imageLoading} />
            <Form.Control
              type="text"
              placeholder="Enter a recipe idea or ingredients..."
              value={recipeInput}
              onChange={handleInputChange}
            />
            <Button variant="primary" onClick={handleSendMessage} disabled={loading || imageLoading}>
              {loading || imageLoading ? <Spinner size="sm" animation="border" /> : <SendFill />}
            </Button>
          </div>

          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </>
      )}
    </div>
  );
}

export default RecipeGenerator;
