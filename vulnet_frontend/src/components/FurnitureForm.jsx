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
    <>
      <h3 style={Object.fromEntries(Object.entries(formStyles.title).map(([k, v]) => [k, typeof v === 'function' ? v(isDark) : v]))}>Añadir Mueble</h3>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        style={Object.fromEntries(Object.entries(formStyles.form).map(([k, v]) => [k, typeof v === 'function' ? v(isDark) : v]))}
      >
        <input
          type="text"
          name="tipo"
          placeholder="Tipo"
          onChange={handleChange}
          required
          style={Object.fromEntries(Object.entries(formStyles.input).map(([k, v]) => [k, typeof v === 'function' ? v(isDark) : v]))}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={Object.fromEntries(Object.entries(formStyles.input).map(([k, v]) => [k, typeof v === 'function' ? v(isDark) : v]))}
        />

        <div style={formStyles.addDeviceContainer}>
          <select
            style={{
              ...Object.fromEntries(Object.entries(formStyles.select).map(([k, v]) => [k, typeof v === 'function' ? v(isDark) : v])),
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
    </>
  );
};
const formStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "2rem",
    backgroundColor: isDark => isDark ? "#1e3a8a" : "#ffffff",
    borderRadius: "10px",
    boxShadow: isDark => isDark ? "0 0 0 1px rgba(255,255,255,0.05), 0 6px 12px rgba(255,255,255,0.1)" : "0 0 0 1px rgba(0,0,0,0.05), 0 6px 12px rgba(0,0,0,0.1)",
    maxWidth: "500px",
    margin: "2rem auto",
    fontFamily: "system-ui, sans-serif",
    color: isDark => isDark ? "#ffffff" : "#111827",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "1.5rem",
    textAlign: "center",
    color: isDark => isDark ? "#ffffff" : "#111827",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: "1px solid #d1d5db",
    fontSize: "1rem",
    backgroundColor: isDark => isDark ? "#4a5568" : "#f9fafb",
    color: isDark => isDark ? "#ffffff" : "#111827",
    outline: "none",
  },
  select: {
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: "1px solid #d1d5db",
    backgroundColor: isDark => isDark ? "#4a5568" : "#f9fafb",
    fontSize: "1rem",
    color: isDark => isDark ? "#ffffff" : "#111827",
  },
  addDeviceContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
    marginTop: "1rem",
  },
  primaryButton: {
    padding: "0.75rem 1.25rem",
    fontSize: "1rem",
    fontWeight: "500",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out",
  },
  secondaryButton: {
    padding: "0.75rem 1.25rem",
    fontSize: "1rem",
    fontWeight: "500",
    backgroundColor: "#e5e7eb",
    color: "#111827",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out",
  },
};


export default FurnitureForm;
