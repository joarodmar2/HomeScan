import { useState, useEffect } from "react";

const EstanciaForm = ({ onClose, onEstanciaCreated }) => {
    const [formData, setFormData] = useState({ nombreEstancia: "", dispositivos: [] });
    const [dispositivosDisponibles, setDispositivosDisponibles] = useState([]); // Lista de dispositivos

    useEffect(() => {
        fetch("http://127.0.0.1:8000/vulnet/api/v1/devices/")
            .then(response => response.json())
            .then(data => {
                setDispositivosDisponibles(data); // Guarda los dispositivos en el estado
            })
            .catch(error => console.error("Error al obtener los dispositivos:", error));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddDevice = (event) => {
        const selectedDeviceId = parseInt(event.target.value);
        if (selectedDeviceId && !formData.dispositivos.includes(selectedDeviceId)) {
            setFormData(prevForm => ({
                ...prevForm,
                dispositivos: [...prevForm.dispositivos, selectedDeviceId]
            }));
        }
    };

    const handleRemoveDevice = (index) => {
        setFormData(prevForm => ({
            ...prevForm,
            dispositivos: prevForm.dispositivos.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:8000/vulnet/api/v1/Estancia/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("Estancia creada correctamente.");
                if (onEstanciaCreated) onEstanciaCreated();
                if (onClose) onClose();
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
                        <label>Añadir Dispositivo:</label>
                        <select style={styles.input} onChange={handleAddDevice} defaultValue="">
                            <option value="" disabled>Selecciona un dispositivo</option>
                            {dispositivosDisponibles.map((device, index) => (
                                <option key={index} value={device.id}>{device.model}</option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label>Dispositivos en la Estancia:</label>
                        <ul style={styles.list}>
                            {formData.dispositivos.length > 0 ? (
                                formData.dispositivos.map((id, index) => {
                                    const dispositivo = dispositivosDisponibles.find(d => d.id === id);
                                    return (
                                        <li key={index} style={styles.listItem}>
                                            {dispositivo ? dispositivo.model : `ID ${id}`}
                                            <button
                                                style={styles.deleteButton}
                                                type="button"
                                                onClick={() => handleRemoveDevice(index)}
                                            >
                                                X
                                            </button>
                                        </li>
                                    );
                                })
                            ) : (
                                <p style={{ color: "white", fontStyle: "italic" }}>
                                    No hay dispositivos seleccionados.
                                </p>
                            )}
                        </ul>

                    </div>

                    <button type="submit" style={styles.saveButton}>Crear</button>
                </form>
            </div>
        </div>
    );
};

// ✅ **Estilos Mejorados**
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
    list: {
        listStyleType: "none",
        padding: "0",
        marginTop: "10px"
    },
    listItem: {
        background: "#303030",
        padding: "12px",
        margin: "8px 0",
        borderRadius: "8px",
        textAlign: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    deleteButton: {
        background: "red",
        color: "white",
        border: "none",
        padding: "5px 10px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px"
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
