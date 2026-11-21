import React from 'react';
import { Alert } from 'react-bootstrap';
import { CheckCircleFill } from 'react-bootstrap-icons'; // Importez l'icône de succès

function MessageDisplay({ message, variant }) {
    if (!message) return null;

    return (
        <Alert variant={variant} className={`mt-3 ${variant === 'success' ? 'success-message' : ''}`}>
            {variant === 'success' && <CheckCircleFill color="#28a745" size={20} />} {/* Icône de succès */}
            {message}
        </Alert>
    );
}

export default MessageDisplay;