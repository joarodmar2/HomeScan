import { useState } from "react";

const EstanciaForm = ({ onClose, onEstanciaCreated }) => {
    const [formData, setFormData] = useState({ nombreEstancia: "", dispositivos: [""] });
    const [sugerencias, setSugerencias] = useState([]); // ✅ Estado para almacenar las sugerencias

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddDevice = () => {
        setFormData(prevForm => ({
            ...prevForm,
            dispositivos: [...prevForm.dispositivos, ""]
        }));
    };

    const handleRemoveDevice = () => {
        if (formData.dispositivos.length > 1) {
            setFormData(prevForm => ({
                ...prevForm,
                dispositivos: prevForm.dispositivos.slice(0, -1)
            }));
        }
    };

    // ✅ Función para buscar dispositivos en la API mientras el usuario escribe
    const buscarDispositivos = (query) => {
        if (query.length > 1) {
            fetch(`http://127.0.0.1:8000/vulnet/api/v1/devicemodels/?q=${query}`)
                .then(response => response.json())
                .then(data => {
                    if (data.models && Array.isArray(data.models)) {
                        setSugerencias(data.models);
                    }
                })
                .catch(error => console.error('Error en la búsqueda de dispositivos:', error));
        } else {
            setSugerencias([]); // ✅ Si el campo está vacío, limpia las sugerencias
        }
    };

    const handleDispositivoChange = (index, value) => {
        const newDispositivos = [...formData.dispositivos];
        newDispositivos[index] = value;
        setFormData({ ...formData, dispositivos: newDispositivos });
        buscarDispositivos(value); // ✅ Llamamos a la función de búsqueda
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:8000/vulnet/api/Estancia/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                onEstanciaCreated(); // ✅ Llamamos a la función para actualizar la lista en `EstanciaPage`
                onClose(); // ✅ Cerrar el modal
            } else {
                console.error("Error al enviar el formulario");
            }
        } catch (error) {
            console.error("Error en la conexión con el servidor:", error);
        }
    };

    return (
        <div style={styles.modal}>
            <div style={styles.modalContent}>
                <span style={styles.closeButton} onClick={onClose}>&times;</span>
                <h2>Crear Estancia</h2>
                <form onSubmit={handleSubmit} style={styles.formulario}>
                    <div style={styles.formGroup}>
                        <label>Nombre de la Estancia:</label>
                        <input 
                            type="text" 
                            name="nombreEstancia" 
                            style={styles.nombreEstanciaInput} 
                            value={formData.nombreEstancia} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label>Número de Dispositivos:</label>
                        <div style={styles.deviceControl}>
                            <button type="button" onClick={handleRemoveDevice} style={styles.deviceButton}> ➖ </button>
                            <span>{formData.dispositivos.length}</span>
                            <button type="button" onClick={handleAddDevice} style={styles.deviceButton}> ➕ </button>
                        </div>
                    </div>
                    {formData.dispositivos.map((_, index) => (
                        <div key={index} style={{ position: 'relative' }}>
                            <label>Dispositivo {index + 1}: </label>
                            <input
                                style={styles.input}
                                type="text"
                                value={formData.dispositivos[index]}
                                onChange={(e) => handleDispositivoChange(index, e.target.value)}
                                required
                                list={`sugerencias-dispositivos-${index}`} // ✅ Conecta con `datalist`
                            />
                            <datalist id={`sugerencias-dispositivos-${index}`}>
                                {sugerencias.map((nombre, i) => (
                                    <option key={i} value={nombre} />
                                ))}
                            </datalist>
                        </div>
                    ))}
                    <button type="submit" style={styles.saveButton}>Crear</button>
                </form>
            </div>
        </div>
    );
};

// ✅ **Estilos en JS (CSS-in-JS)**
const styles = {
    modal: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    modalContent: {
        background: "#000",
        padding: "30px",
        borderRadius: "10px",
        width: "400px",
        textAlign: "center",
        boxShadow: "0 4px 10px rgba(255, 255, 255, 0.2)",
        position: "relative"
    },
    closeButton: {
        color: "red",
        fontSize: "24px",
        cursor: "pointer",
        position: "absolute",
        top: "10px",
        right: "10px"
    },
    formGroup: {
        marginBottom: "15px",
        color: "White",
        textAlign: "center"
    },
    nombreEstanciaInput: {
        width: "100%",
        padding: "10px",
        border: "1px solid #555",
        borderRadius: "5px",
        fontSize: "16px",
        backgroundColor: "#fff",
        color: "#000",
        textAlign: "left"
    },
    input: {
        width: "100%",
        padding: "10px",
        border: "1px solid #444",
        borderRadius: "5px",
        fontSize: "16px",
        backgroundColor: "#fff",
        color: "black",
        textAlign: "center",
        transition: "border 0.3s ease-in-out"
    },
    saveButton: {
        width: "100%",
        padding: "10px",
        background: "#6c63ff",
        border: "none",
        color: "white",
        fontSize: "16px",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background 0.3s ease-in-out",
        marginTop: "10px"
    }
};

export default EstanciaForm;
