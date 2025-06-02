import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useColorMode } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";

const FurnitureForm = ({ onClose, estanciaId }) => {
  const [formData, setFormData] = useState({
    tipo: '',
    x: 100,
    y: 100,
    width: 100,
    height: 100,
    rotation: 0,
    estancia: estanciaId,
    dispositivos: [],
    imagen_dispositivo: ""
  });

  const [estancia, setEstancia] = useState(null);
  const [dispositivosDisponibles, setDispositivosDisponibles] = useState([]);
  const [image, setImage] = useState(null);
  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  const COLORS = {
    lightBg: "#f4f4f4",
    lightCard: "#ffffff",
    darkBg: "#1a202c",
    darkCard: "#2d3748",
    darkText: "#ffffff",
    lightText: "#1a1a1a",
  };

  const isDark = colorMode === "dark";

  const updateEstancia = async () => {
    try {
      const responseGet = await fetch(`http://127.0.0.1:8000/vulnet/api/v1/Estancia/${estanciaId}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!responseGet.ok) {
        throw new Error(`Error al obtener estancia: ${responseGet.status}`);
      }

      const estanciaData = await responseGet.json();
      console.log("nombreEstanciaFurn", estanciaData.nombreEstancia);

      const dispositivosExistentes = estanciaData.dispositivos || [];
      const dispositivosActualizados = [...dispositivosExistentes, ...formData.dispositivos];

      const response = await fetch(`http://127.0.0.1:8000/vulnet/api/v1/Estancia/${estanciaId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombreEstancia: formData.nombreEstancia,
          dispositivos: dispositivosActualizados,
        }),
      });

      if (response.ok) {
        alert("Los cambios han sido guardados correctamente.");
        window.location.reload();
      } else {
        alert("Hubo un error al guardar los cambios.");
      }
    } catch (error) {
      alert("Error de conexión con el servidor.");
      console.error(error);
    }
  };

  const handleAddDevice = async (event) => {
    const selectedDeviceId = parseInt(event.target.value);
    const dispositivoSeleccionado = dispositivosDisponibles.find(d => d.id === selectedDeviceId);

    if (selectedDeviceId && !formData.dispositivos.includes(selectedDeviceId)) {
      setFormData(prev => ({
        ...prev,
        dispositivos: [...prev.dispositivos, selectedDeviceId]
      }));
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {

    console.log("formData antes de enviar:", formData);
    e.preventDefault();

    const dataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "estancia") {
        dataToSend.append("estancia", parseInt(value));
      } else if (key === "dispositivos") {
        // Suponiendo que el mueble tiene una FK a dispositivo, envía solo el primero:
        if (value.length > 0) dataToSend.append("dispositivo", value[0]);
      } else {
        dataToSend.append(key, value);
      }
    });

    if (image) {
      dataToSend.append("imagen", image);
    }

    console.log("🔍 Enviando al backend:");
    for (let [clave, valor] of dataToSend.entries()) {
      if (valor instanceof File) {
        console.log(`${clave}: [File] ${valor.name} (${valor.type}, ${valor.size} bytes)`);
      } else {
        console.log(`${clave}:`, valor);
      }
    }

    axios.post(`http://localhost:8000/vulnet/api/v1/muebles/`, dataToSend)
      .then(response => {
        console.log("response", response.data);
        alert("✅ Furniture created!");
        window.location.reload();
      })
      .catch(error => {
        alert("❌ Error creating furniture.");
        console.error("❌ Detalles:", error.response?.data || error);
      });
  };

  useEffect(() => {
    const fetchDispositivos = async () => {
      try {
        const respuesta = await axios.get("http://127.0.0.1:8000/vulnet/api/v1/devices/");
        console.log('Dispositivos cargados:', respuesta.data);
        setDispositivosDisponibles(respuesta.data);
      } catch (error) {
        console.error('Error al cargar dispositivos:', error);
      }
    };

    fetchDispositivos();
  }, []);

  return (
    <div style={formStyles.container}>
      <h3 style={formStyles.title}>Añadir Mueble</h3>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        style={formStyles.form}
      >
        <input
          type="text"
          name="tipo"
          placeholder="Tipo"
          onChange={handleChange}
          required
          style={formStyles.input}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={formStyles.input}
        />

        <div style={formStyles.addDeviceContainer}>
          <select
            style={{
              ...formStyles.select,
              backgroundColor: isDark ? COLORS.darkCard : COLORS.lightCard,
              color: isDark ? COLORS.darkText : COLORS.lightText,
            }}
            onChange={handleAddDevice}
            defaultValue=""
          >
            <option value="" disabled>
              Selecciona un dispositivo
            </option>
            {dispositivosDisponibles.map((device) => (
              <option key={device.id} value={device.id}>
                {device.model}
              </option>
            ))}
          </select>
        </div>

        <div style={formStyles.buttonGroup}>
          <button type="submit" style={formStyles.primaryButton} onClick={updateEstancia}>
            Crear
          </button>
          <button type="button" onClick={onClose} style={formStyles.secondaryButton}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
const formStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "25px",
    backgroundColor: "#1e293b",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
    maxWidth: "400px",
    margin: "0 auto",
    fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
  },
  title: {
    fontSize: "26px",
    fontWeight: "600",
    marginBottom: "20px",
    background: "linear-gradient(45deg, #6a93cb, #a4bfef)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0px 2px 4px rgba(0,0,0,0.3)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "100%",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    backgroundColor: "#2a3a5a",
    color: "white",
    border: "1px solid #3a4a6a",
    outline: "none",
    fontSize: "14px",
  },
  select: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #3a4a6a",
    outline: "none",
    fontSize: "14px",
    cursor: "pointer",
  },
  addDeviceContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    gap: "10px",
  },
  primaryButton: {
    padding: "10px 15px",
    fontSize: "14px",
    fontWeight: "500",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    transition: "all 0.2s ease",
  },
  secondaryButton: {
    padding: "10px 15px",
    fontSize: "14px",
    fontWeight: "500",
    backgroundColor: "#3a4a6a",
    color: "#a0aec0",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
};

// Inject CSS styles dynamically
/*
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
document.head.appendChild(styles);*/

export default FurnitureForm;
