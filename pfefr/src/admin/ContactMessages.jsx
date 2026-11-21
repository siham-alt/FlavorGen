import { useEffect, useState } from "react";
import axios from "axios";
import "./ContactMessages.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpenText, faTrashAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

const ContactMessages = () => {
    const [messages, setMessages] = useState([]);
    const [token] = useState(JSON.parse(localStorage.getItem("token")));
    const [selectedStatus, setSelectedStatus] = useState('Tous');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/contact/messages", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(res.data);
        } catch (err) {
            console.error("Erreur de récupération des messages", err);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/contact/messages/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(messages.map(msg =>
                msg.id === id ? { ...msg, is_read: true } : msg
            ));
            if (selectedMessage && selectedMessage.id === id) {
                setSelectedMessage({ ...selectedMessage, is_read: true }); // Update modal content
            }
        } catch (error) {
            console.error("Erreur lors du marquage comme lu", error);
        }
    };

    const handleDeleteMessage = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/contact/messages/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMessages(messages.filter(msg => msg.id !== id));
                setModalVisible(false); // Close modal after deletion
                setSelectedMessage(null);
            } catch (error) {
                console.error("Erreur lors de la suppression du message", error);
            }
        }
    };

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };
    const openMessageModal = (message) => {
      setSelectedMessage(message);
      setModalVisible(true);
  };

  const closeMessageModal = () => {
      setModalVisible(false);
      setSelectedMessage(null);
  };


    const filteredMessages = messages.filter(msg => {
        if (selectedStatus === 'Tous') {
            return true;
        }
        if (selectedStatus === 'Lu') {
            return msg.is_read;
        }
        if (selectedStatus === 'Non Lu') {
            return !msg.is_read;
        }
        return false;
    });

    return (
        <div className="contact-messages-table-container">
            <h2 className="contact-messages-table-title">Messages des utilisateurs</h2>

            <div className="search-filter-container">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <label htmlFor="statusFilter">Filtrer par statut :</label>
                <div className="select-wrapper">
                    <select id="statusFilter" value={selectedStatus} onChange={handleStatusChange}>
                        <option value="Tous">Tous</option>
                        <option value="Non Lu">Non Lu</option>
                        <option value="Lu">Lu</option>
                    </select>
                </div>
            </div>

            {filteredMessages.length === 0 ? (
                <p className="contact-messages-table-empty">Aucun message reçu.</p>
            ) : (
                <table className="contact-messages-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Date</th>
                            <th>Message</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMessages.map((msg) => (
                            <tr key={msg.id}>
                                <td>{msg.name}</td>
                                <td>{msg.email}</td>
                                <td>{moment(msg.created_at).format('YYYY-MM-DD HH:mm')}</td>
                                <td
                                    className="message-content-cell"
                                    onClick={() => openMessageModal(msg)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {msg.message}
                                </td>
                                <td>
                                    {msg.is_read ? (
                                        <span className="badge badge-success">Lu</span>
                                    ) : (
                                        <span className="badge badge-warning">Non Lu</span>
                                    )}
                                </td>
                                <td className="actions-cell">
                                    {!msg.is_read && (
                                        <button className="btn btn-warning btn-sm" onClick={() => handleMarkAsRead(msg.id)} title="Marquer comme Lu">
                                            <FontAwesomeIcon icon={faEnvelopeOpenText} />
                                        </button>
                                    )}
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteMessage(msg.id)} title="Supprimer">
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {selectedMessage && (
                <div className={`modall-overlay ${modalVisible ? 'active' : ''}`}> {/* Add the 'active' class conditionally */}
                    <div className="modall-content">
                        <h2>Détails du message</h2>
                        <div className="modal-info">
                            <p><strong>Nom:</strong> {selectedMessage.name}</p>
                            <p><strong>Email:</strong> {selectedMessage.email}</p>
                            <p><strong>Date:</strong> {moment(selectedMessage.created_at).format('YYYY-MM-DD HH:mm:ss')}</p>
                            <p><strong>Message:</strong></p>
                            <div className="modall-message-body">
                                <p>{selectedMessage.message}</p>
                            </div>
                        </div>
                        <div className="modall-actions">
                            {!selectedMessage.is_read && (
                                <button className="btn btn-warning" onClick={() => handleMarkAsRead(selectedMessage.id)}>
                                    <FontAwesomeIcon icon={faEnvelopeOpenText} /> Marquer comme Lu
                                </button>
                            )}
                            <button className="btn btn-danger" onClick={() => handleDeleteMessage(selectedMessage.id)}>
                                <FontAwesomeIcon icon={faTrashAlt} /> Supprimer
                            </button>
                            <button className="btn btn-secondary" onClick={closeMessageModal}>
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactMessages;