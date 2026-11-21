import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Button, Form, Badge } from 'react-bootstrap';
import { Trash, Trash2 } from 'react-bootstrap-icons';
import { Eye } from 'react-bootstrap-icons';
import './History.css';

function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [startDate, setStartDate] = useState(moment().subtract(7, 'days').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
    const [searchQuery, setSearchQuery] = useState('');
    const [conversations, setConversations] = useState([]);
    const API_KEY = "9b9ba307be4646eea2f3cb0c7b3977a9";

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("token"));
        if (!token) {
            setError("Missing authentication token.");
            setLoading(false);
            return;
        }
        axios.get(`http://localhost:8000/api/history?start=${startDate}&end=${endDate}&search=${searchQuery}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(response => {
                console.log("API Response:", response.data);
                setHistory(response.data);
                groupMessagesByConversation(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, [startDate, endDate, searchQuery]);

    const groupMessagesByConversation = (historyData) => {
        const grouped = [];
        let currentConversation = null;

        historyData.forEach(item => {
            if (item.type === 'chatbot_message' || item.type === 'recipe_added_to_favorites') {
                if (!currentConversation || moment(item.created_at).diff(moment(currentConversation.date), 'minutes') > 10) {
                    currentConversation = {
                        id: item.id,
                        date: item.created_at,
                        messages: [item],
                    };
                    grouped.push(currentConversation);
                } else {
                    currentConversation.messages.push(item);
                }
            } else if (item.type === 'recipe_details_viewed') {
                if (currentConversation) {
                    currentConversation.messages.push(item);
                } else {
                    currentConversation = {
                        id: item.id,
                        date: item.created_at,
                        messages: [item],
                    };
                    grouped.push(currentConversation);
                }
            }
        });

        setConversations(grouped.reverse());
    };

    const filteredConversations = useMemo(() => {
        return conversations.filter(conversation => {
            const conversationDate = moment(conversation.date);
            const startDateMoment = moment(startDate);
            const endDateMoment = moment(endDate);
            return conversationDate.isSameOrAfter(startDateMoment) && conversationDate.isSameOrBefore(endDateMoment);
        });
    }, [conversations, startDate, endDate]);

    const handleDeleteConversation = (conversationId) => {
        const token = JSON.parse(localStorage.getItem("token"));
        if (!token) {
            setError("Missing authentication token.");
            return;
        }

        const url = `http://localhost:8000/api/history/${conversationId}`;
        console.log("Delete URL:", url);

        axios.delete(url, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                setHistory(history.filter(item => item.id !== conversationId));
                groupMessagesByConversation(history.filter(item => item.id !== conversationId));
            })
            .catch(err => {
                setError(err);
                console.error("Error deleting conversation:", err);
            });
    };

    const handleClearHistory = () => {
        const confirmClear = window.confirm("Are you sure you want to clear all history?");
        if (!confirmClear) return;

        const token = JSON.parse(localStorage.getItem("token"));
        if (!token) {
            setError("Missing authentication token.");
            return;
        }

        axios.delete("http://localhost:8000/api/history/clear", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                setHistory([]);
                setConversations([]);
            })
            .catch(err => {
                setError(err);
                console.error("Error clearing history:", err);
            });
    };

    const handleShowDetails = async (conversation) => {
        const formattedMessages = await Promise.all(conversation.messages.map(async message => {
            let sender = 'AI ';
            let text = message.details;
            let recipeDetails = null;
            let generatedRecipes = [];
    
            if (message.type === 'chatbot_message') {
                sender = 'Me';
                if (message.details) {
                    text = message.details;
                }
                if (message.recipes) {
                    try {
                        const recipes = JSON.parse(message.recipes);
                        if (Array.isArray(recipes)) {
                            generatedRecipes = recipes.map(recipe => ({
                                title: recipe.title,
                                id: recipe.id,
                                image: recipe.image
                            }));
                            if (recipes.length > 0) {
                                text = "Suggested recipes:";
                            }
                        } else if (recipes && recipes.title) {
                            generatedRecipes = [{
                                title: recipes.title,
                                id: recipes.id,
                                image: recipes.image
                            }];
                            text = `Suggested recipe: ${recipes.title}`;
                        }
                    } catch (error) {
                        console.error("Error parsing recipes:", error);
                    }
                }
            } else if (message.type === 'recipe_details_viewed') {
                const recipeId = message.details.split(': ')[1];
                try {
                    const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=true&apiKey=${API_KEY}`);
                    if (response.data && response.data.image && response.data.title) {
                        recipeDetails = response.data;
                        text = ` ${response.data.title}`;
                    } else {
                        text = ` (ID: ${recipeId})`;
                    }
                } catch (error) {
                    console.error("Error fetching recipe details:", error);
                    text = `Recipe details (ID: ${recipeId})`;
                }
            } else if (message.type === 'recipe_added_to_favorites') {
                const recipeId = message.details.split(': ')[1];
                try {
                    const response = await axios.get(`http://localhost:8000/api/recipes/${recipeId}`);
                    if (response.data && response.data.title) {
                        text = `Recipe added to favorites: ${response.data.title}`;
                    } else {
                        text = `Recipe added to favorites (ID: ${recipeId})`;
                    }
                } catch (error) {
                    console.error("Error fetching recipe name:", error);
                    text = `Recipe added to favorites (ID: ${recipeId})`;
                }
            }
    
            return { sender, text, recipeDetails, generatedRecipes };
        }));
    
        setSelectedConversation({ ...conversation, formattedMessages });
        setShowModal(true);
    };

    return (
        <div className="history-page">
            <h1>My Search History</h1>
            <p>Find all your past searches here.</p>

            <div className="filters">
                <div className="date-filter">
                    <label>From:</label>
                    <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="date-filter">
                    <label>To:</label>
                    <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
            </div>

            <div className="conversation-list">
                {filteredConversations.map(conversation => (
                    <div className="conversation-card" key={conversation.id}>
                        <div className="conversation-header">
                            {moment(conversation.messages[0].created_at).format('DD/MM/YYYY HH:mm')}
                            {conversation.messages[0].type === 'chatbot_message' ? <Badge bg="info">AI</Badge> : <Badge bg="secondary">User</Badge>}
                        </div>
                        <div className="conversation-summary">
                            {conversation.messages.slice(0, 2).map(message => (
                                <p key={message.id}>
                                    {message.type === 'chatbot_message' ? <b>AI:</b> : <b>User:</b>} {message.details}
                                </p>
                            ))}
                        </div>
                        <div className="conversation-actions">
                            <Button variant="outline-primary" onClick={() => handleShowDetails(conversation)}>
                                <Eye />
                            </Button>
                            <Button variant="outline-danger" onClick={() => handleDeleteConversation(conversation.id)}>
                                <Trash />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && selectedConversation && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal">
                        <div className="custom-modal-header">
                            <h2>Conversation from {moment(selectedConversation.messages[0].created_at).format('DD/MM/YYYY HH:mm')}</h2>
                            <button onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        <div className="custom-modal-body">
                            {selectedConversation.formattedMessages && selectedConversation.formattedMessages.map((message, index) => (
                                <div key={index} className="message-detail">
                                    <strong>{message.sender}:</strong> {message.text}
                                    {message.generatedRecipes && message.generatedRecipes.length > 0 && (
                                        <div className="generated-recipes">
                                            <h4>Suggested recipes:</h4>
                                            <ul>
                                                {message.generatedRecipes.map(recipe => (
                                                    <li key={recipe.id}>
                                                        <img src={recipe.image} alt={recipe.title} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                                                        {recipe.title}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {message.recipeDetails && message.recipeDetails.image && message.recipeDetails.title && (
                                        <div className="recipe-details">
                                            <h4>you viewed : </h4>
                                            <h3>{message.recipeDetails.title}</h3>
                                            <img 
                                                src={message.recipeDetails.image} 
                                                alt={message.recipeDetails.title} 
                                                onError={(e) => { e.target.onerror = null; e.target.src = "chemin/vers/image/de/remplacement.jpg" }}
                                            />
                                            <div dangerouslySetInnerHTML={{ __html: message.recipeDetails.summary }} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="custom-modal-footer">
                            <button onClick={() => setShowModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="clear-history">
                <Button variant="danger" onClick={handleClearHistory}>
                    <Trash2 /> Clear History
                </Button>
            </div>

            {error && <p className="text-danger">{error}</p>}
            {loading && <p>Loading...</p>}
        </div>
    );
}

export default History;