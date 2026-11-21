import React, { useState, useRef, useEffect } from "react";
import { Button, Spinner, Form, Card, Row, Col } from "react-bootstrap";
import { Camera, Upload } from "react-bootstrap-icons";

function ImageUploader({ onImageUpload, loading }) {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleOpenCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing the camera:", err);
      setError("Accès à la caméra refusé ou indisponible.");
      fileInputRef.current?.click();
    }
  };

  const handleCapture = () => {
    if (videoRef.current && stream && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "captured_image.jpg", { type: 'image/jpeg' });
          onImageUpload(file);
          stopCamera();
          setIsCameraActive(false);
        }
      }, 'image/jpeg');
    }
  };

  const handleStopCamera = () => {
    stopCamera();
    setIsCameraActive(false);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const handleOpenFileExplorer = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="d-flex flex-column align-items-center gap-3 mt-3">
      <div className="d-flex gap-2">
        <Button variant="outline-primary" onClick={handleOpenCamera} disabled={loading || isCameraActive}>
          <Camera className="me-1" /> 
        </Button>
        <Button variant="outline-success" onClick={handleOpenFileExplorer} disabled={loading}>
          <Upload className="me-1" /> 
        </Button>
        {loading && <Spinner animation="border" size="sm" />}
      </div>

      <Form.Control
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />

      {isCameraActive && (
        <Card className="shadow-sm bg-dark text-white" style={{ maxWidth: '340px' }}>
          <Card.Body className="p-2 position-relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-100 rounded"
              style={{ backgroundColor: 'black' }}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
            <div className="d-flex gap-2 mt-2">
              <Button variant="danger" onClick={handleStopCamera} className="w-50">
                Annuler
              </Button>
              <Button variant="success" onClick={handleCapture} className="w-50">
                Capturer
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {error && <div className="text-danger text-center">{error}</div>}
    </div>
  );
}

export default ImageUploader;
