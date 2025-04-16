import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Estancia = () => {
    const { nombre } = useParams();
    const [estancia, setEstancia] = useState(null);
    const [dispositivosEstancia, setDispositivosEstancia] = useState([]);
    const [dispositivosDisponibles, setDispositivosDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://127.0.0.1:8000/vulnet/api/v1/Estancia/")
            .then(response => response.json())
            .then(data => {
                const estanciaFiltrada = data.find(e => e.nombreEstancia.toLowerCase() === nombre.toLowerCase());
                if (estanciaFiltrada) {
                    setEstancia(estanciaFiltrada);

                    // Cargar dispositivos de esta estancia
                    fetch(`http://127.0.0.1:8000/vulnet/api/v1/devices/?estancia=${estanciaFiltrada.id}`)
                        .then(res => res.json())
                        .then(data => setDispositivosEstancia(data))
                        .catch(err => console.error("Error al cargar dispositivos:", err));
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

        fetch("http://127.0.0.1:8000/vulnet/api/v1/devices/")
            .then(response => response.json())
            .then(data => {
                setDispositivosDisponibles(data);
            })
            .catch(error => console.error("Error al obtener los dispositivos:", error));
    }, [nombre]);

    const handleDeleteDevice = (deviceIdToRemove) => {
        const updatedDevices = estancia.dispositivos.filter(id => id !== deviceIdToRemove);
        setEstancia({ ...estancia, dispositivos: updatedDevices });
    };
    


    const handleAddDevice = (event) => {
        const selectedDeviceId = parseInt(event.target.value);
        if (selectedDeviceId && !estancia.dispositivos.includes(selectedDeviceId)) {
            setEstancia(prev => ({
                ...prev,
                dispositivos: [...prev.dispositivos, selectedDeviceId]
            }));
        }
    };
    

    const updateEstancia = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/vulnet/api/v1/Estancia/${estancia.id}/`, {
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
                alert("Los cambios han sido guardados correctamente.");
                navigate("/Estancia");
            } else {
                alert("Hubo un error al guardar los cambios.");
            }
        } catch (error) {
            alert("Error de conexión con el servidor.");
            console.error(error);
        }
    };
    

    const AñadirDispositivoEstancia = () => {
        navigate(`/estancias/${estancia.id}/dispositivos/nuevo`);
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
        <div style={styles.pageContainer}>
            <div style={styles.card}>
                <h2 style={styles.nombre}>{estancia.nombreEstancia}</h2>

                <p style={styles.subtitulo}> Dispositivos:</p>
                <ul style={styles.list}>
                    {estancia.dispositivos.length > 0 ? (
                        estancia.dispositivos.map((deviceId) => {
                            const device = dispositivosDisponibles.find(d => d.id === deviceId);
                            return (
                                <li key={deviceId} style={styles.listItem}>
                                    {device ? device.model : `ID ${deviceId}`}
                                    <button
                                        style={styles.deleteButton}
                                        onClick={() => handleDeleteDevice(deviceId)}
                                    >
                                        X
                                    </button>
                                </li>
                            );
                        })
                    ) : (
                        <p style={{ color: "white", fontStyle: "italic" }}>
                            No hay dispositivos en esta estancia.
                        </p>
                    )}
                </ul>

                {/* 🔹 Select para añadir dispositivos */}
                <div style={styles.addDeviceContainer}>
                    <select style={styles.input} onChange={handleAddDevice} defaultValue="">
                        <option value="" disabled>Selecciona un dispositivo</option>
                        {dispositivosDisponibles.map((device) => (
                            <option key={device.id} value={device.id}>{device.model}</option>
                        ))}
                    </select>
                </div>


                <button style={styles.saveButton} onClick={updateEstancia}>Guardar</button>
                <button
                    onClick={AñadirDispositivoEstancia}
                    style={{
                        position: "absolute",
                        top: 20,
                        right: 20,
                        padding: "10px 20px",
                        borderRadius: "8px",
                        background: "#007bff",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        zIndex: 10
                    }}
                >
                    Añadir dispositivo
                </button>
            </div>
        </div>
    );
};

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
