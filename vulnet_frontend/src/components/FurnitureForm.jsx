import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FurnitureForm = ({ onClose, estanciaId }) => {
  const [formData, setFormData] = useState({
    tipo: '',
    x: 100,
    y: 100,
    width: 100,
    height: 100,
    rotation: 0,
    estancia: estanciaId, // ✅ El ID correcto
});
    const [image, setImage] = useState(null);



    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
  
      const dataToSend = new FormData();
  
      Object.entries(formData).forEach(([key, value]) => {
          if (key === "estancia") {
              dataToSend.append("estancia", parseInt(value)); // ✅ Convertimos estancia a número
          } else {
              dataToSend.append(key, value);
          }
      });
  
      if (image) {
          dataToSend.append("imagen", image); // 👈 Esto ya lo hacías bien
      }
  
      // Log de prueba
      for (let pair of dataToSend.entries()) {
          console.log(pair[0] + ':', pair[1]);
      }
  
      axios.post("http://localhost:8000/vulnet/api/v1/muebles/", dataToSend)
          .then(response => {
              alert("✅ Furniture created!");
              onClose();
          })
          .catch(error => {
              alert("❌ Error creating furniture.");
              console.error("❌ Detalles:", error.response?.data || error);
          });
  };
  



    return (
        <div className="form-container">
            <h3 className="form-title">Add Furniture</h3>
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="form-content">
                <input type="text" name="tipo" placeholder="tipo" onChange={handleChange} required className="form-input" />
                <input type="file" accept="image/*" onChange={handleFileChange} className="form-input" />
                <div className="form-buttons">
                    <button type="submit" className="form-button primary">Create</button>
                    <button type="button" onClick={onClose} className="form-button secondary">Cancel</button>
                </div>
            </form>
        </div>
    );
};


// Inject CSS styles dynamically
const styles = document.createElement('style');
styles.innerHTML = `
  .form-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #1e1e1e;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  z-index: 100;
  width: 320px;
  font-family: 'Segoe UI', sans-serif;
}


  .form-title {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 20px;
    color: #ffffff;
    text-align: center;
  }

  .form-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .form-input {
    padding: 12px;
    font-size: 14px;
    border: 1px solid #444;
    border-radius: 8px;
    background-color: #2d2d2d;
    color: #f1f1f1;
    width: 100%;
    box-sizing: border-box;
  }

  .form-input::placeholder {
    color: #aaa;
  }

  .form-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }

  .form-button {
    padding: 10px 18px;
    font-size: 14px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: opacity 0.2s ease;
  }

  .form-button.primary {
    background-color: #6c63ff;
    color: white;
  }

  .form-button.secondary {
    background-color: #3a3a3a;
    color: #ddd;
  }

  .form-button:hover {
    opacity: 0.85;
  }
`;
document.head.appendChild(styles);

export default FurnitureForm;
