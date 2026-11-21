import React, { useState, useRef } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { Camera } from 'react-bootstrap-icons'; // Importez l'icône de caméra

function ImageCapture({ onImageSelected, loading }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            onImageSelected(file);
            setShowCamera(false);
        }
    };

    const handleOpenCamera = () => {
        setShowCamera(true);
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch(error => {
                console.error('Impossible d\'accéder à la caméra.', error);
                setShowCamera(false);
            });
    };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(blob => {
                if (blob) {
                    const file = new File([blob], 'captured.jpg', { type: 'image/jpeg' });
                    setSelectedImage(file);
                    onImageSelected(file);
                }
            }, 'image/jpeg');
        }
    };

    return (
        <div>
            <Button variant="outline-secondary" onClick={handleOpenCamera}>
                <Camera /> {/* Utilisez l'icône de caméra */}
            </Button>
            <Form.Control type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            {/* Le champ de fichier est caché */}

            {showCamera && (
                <div className="camera-preview">
                    <video ref={videoRef} autoPlay playsInline />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <Button variant="primary" onClick={handleCapture}>Capturer</Button>
                    <Button variant="secondary" onClick={() => setShowCamera(false)}>Fermer la caméra</Button>
                </div>
            )}

            {selectedImage && !showCamera && ( // Afficher le bouton "Utiliser cette image" seulement si une image est sélectionnée et la caméra n'est pas active
                <Button variant="secondary" onClick={() => onImageSelected(selectedImage)} disabled={loading}>
                    {loading ? <Spinner size="sm" animation="border" /> : 'Utiliser cette image'}
                </Button>
            )}
        </div>
    );
}

export default ImageCapture;