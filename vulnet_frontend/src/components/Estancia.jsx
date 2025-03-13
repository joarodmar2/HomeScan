import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Estancia = () => {
    const { nombre } = useParams(); // Usamos el hook useParams para obtener el parámetro de la URL. En este caso, el nombre de la estancia.
    const [estancia, setEstancia] = useState(null);
    const [dispositivosDisponibles, setDispositivosDisponibles] = useState([]); // Lista de dispositivos
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();  

    useEffect(() => {
        // 🔹 Obtiene TODAS las estancias
        fetch(`http://127.0.0.1:8000/vulnet/api/Estancia/`)
            .then(response => response.json())
            .then(data => {
                console.log("Datos completos recibidos desde API:", data);
                const estanciaFiltrada = data.find(e => e.nombreEstancia.toLowerCase() === nombre.toLowerCase());
                if (estanciaFiltrada) {
                    setEstancia(estanciaFiltrada);
                } else {
                    setEstancia(null);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener la estancia:", error);
                setError(error.message);
                setLoading(false);
            });

        // 🔹 Obtiene TODOS los dispositivos disponibles en la base de datos
        fetch(`http://127.0.0.1:8000/vulnet/api/v1/devices/`)
            .then(response => response.json())
            .then(data => {
                setDispositivosDisponibles(data); // Guarda los dispositivos en el estado
            })
            .catch(error => console.error("Error al obtener los dispositivos:", error));
    }, [nombre]); // Importante--> Este useEffect solo se ejecuta cuando nombre cambia.

    // ✅ Función para eliminar un dispositivo de la estancia
    const handleDeleteDevice = (index) => {
        const updatedDevices = estancia.dispositivos.filter((_, i) => i !== index);
        setEstancia({ ...estancia, dispositivos: updatedDevices });
    };

    // ✅ Función para añadir un dispositivo desde el select
    const handleAddDevice = (event) => {
        const selectedDevice = event.target.value;
        if (selectedDevice) {
            setEstancia(prevState => ({
                ...prevState,
                dispositivos: [...prevState.dispositivos, selectedDevice]
            }));
        }
    };

    // ✅ Función para actualizar la estancia en la API
    const updateEstancia = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/vulnet/api/Estancia/${estancia.id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombreEstancia: estancia.nombreEstancia,
                    dispositivos: estancia.dispositivos
                }),
            });

            if (response.ok) {
                console.log("Estancia actualizada con éxito");
                alert("Los cambios han sido guardados correctamente.");
                navigate("/Estancia");
            } else {
                console.error("Error al actualizar la estancia");
                alert("Hubo un error al guardar los cambios.");
            }
        } catch (error) {
            console.error("Error en la conexión con el servidor:", error);
            alert("Error de conexión con el servidor.");
        }
    };

    if (loading) {
        return <p style={{ color: "white", textAlign: "center" }}>Cargando datos de la estancia...</p>;
    }

    if (error) {
        return <p style={{ color: "red", textAlign: "center" }}>Error: {error}</p>;
    }

    if (!estancia) {
        return <p style={{ color: "white", textAlign: "center" }}>No se encontró la estancia.</p>;
    }

    return (
        //Editar la estancia
        <div style={styles.pageContainer}>      
            <div style={styles.card}>
                <h2 style={styles.nombre}>{estancia.nombreEstancia}</h2>

                <p style={styles.subtitulo}> Dispositivos:</p>
                <ul style={styles.list}>
                    {estancia.dispositivos.length > 0 ? (
                        estancia.dispositivos.map((dispositivo, index) => (
                            <li key={index} style={styles.listItem}>
                                {dispositivo}
                                <button style={styles.deleteButton} onClick={() => handleDeleteDevice(index)}>X</button>
                            </li>
                        ))
                    ) : (
                        <p style={{ color: "white", fontStyle: "italic" }}>No hay dispositivos en esta estancia.</p>
                    )}
                </ul>

                {/* 🔹 Select para añadir dispositivos desde la base de datos */}
                <div style={styles.addDeviceContainer}> 
                    <select style={styles.input} onChange={handleAddDevice} defaultValue="">
                        <option value="" disabled>Selecciona un dispositivo</option>
                        {dispositivosDisponibles.map((device, index) => (
                            <option key={index} value={device.model}>{device.model} </option>
                        ))}
                    </select>
                </div>

                <button style={styles.saveButton} onClick={updateEstancia}>Guardar</button>
            </div>
        </div>
    );
};

// ✅ **Estilos**
const styles = {
    pageContainer: {
        backgroundColor: "#121212",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        color: "white"
    },
    card: {
        background: "#1e1e1e",
        padding: "30px",
        borderRadius: "15px",
        boxShadow: "0 4px 10px rgba(255, 255, 255, 0.2)",
        textAlign: "center",
        maxWidth: "400px",
        width: "100%"
    },
    nombre: {
        fontSize: "28px",
        fontWeight: "bold",
        margin: "10px 0",
        color: "#6366f1"
    },
    subtitulo: {
        fontSize: "18px",
        fontWeight: "bold",
        marginTop: "15px"
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
    addDeviceContainer: {
        marginTop: "20px",
        display: "flex",
        justifyContent: "center",
        gap: "10px"
    },
    input: {
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #6366f1",
        backgroundColor: "#303030",
        color: "white",
        fontSize: "14px",
        width: "100%"
    },
    saveButton: {
        background: "green",
        marginTop: "15px",
        color: "white",
        border: "none",
        padding: "10px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "bold"
    }
};

export default Estancia;
