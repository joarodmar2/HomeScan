import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EstanciaForm from "../components/EstanciaForm";

const EstanciaPage = () => {
    const navigate = useNavigate();
    const [Estancias, setEstancias] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [conexiones, setConexiones] = useState([]); // Nuevo estado para almacenar las conexiones
    const iconosConexion = {
        "WI-FI": "/connections/wifi.png",
        "Bluetooth": "/connections/bluetooth.png",
        "Ethernet": "/connections/ethernet.png",
        "ZigBee": "/connections/zigbee.png",
    };


    useEffect(() => {
        fetchEstancias();
    }, []);

    useEffect(() => {
        fetch("http://localhost:8000/vulnet/api/v1/connectiongraph/")
            .then((response) => response.json())
            .then((data) => {
                const conexionesMap = {};

                data.first_devices.forEach((device, index) => {
                    const protocol = data.protocols[index];
                    const secondDevice = data.second_devices[index];

                    // Agregar conexión para el primer dispositivo
                    if (!conexionesMap[device]) {
                        conexionesMap[device] = [];
                    }
                    if (!conexionesMap[device].includes(protocol)) {
                        conexionesMap[device].push(protocol);
                    }

                    // Agregar conexión para el segundo dispositivo
                    if (!conexionesMap[secondDevice]) {
                        conexionesMap[secondDevice] = [];
                    }
                    if (!conexionesMap[secondDevice].includes(protocol)) {
                        conexionesMap[secondDevice].push(protocol);
                    }
                });

                setConexiones(conexionesMap);
            })
            .catch((error) => console.error("Error obteniendo conexiones:", error));
    }, []);

    const fetchEstancias = () => {
        fetch("http://127.0.0.1:8000/vulnet/api/Estancia/")
            .then(response => response.json())
            .then(data => setEstancias(Array.isArray(data) ? data : []))
            .catch(error => console.error("Error al obtener estancias:", error));
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/vulnet/api/Estancia/${id}/`, {
                method: "DELETE",
            });

            if (response.ok) {
                setEstancias(prevEstancias => prevEstancias.filter(estancia => estancia.id !== id));
            } else {
                console.error("Error al eliminar la estancia");
            }
        } catch (error) {
            console.error("Error en la conexión con el servidor:", error);
        }
    };

    return (
        <div style={styles.EstanciaGrid}>
            {Estancias.length > 0 ? (
                Estancias.map((Estancia) => (
                    <div key={Estancia.id} style={styles.EstanciaCard}>
                        <h3
                            style={styles.nombreEstancia}
                            onClick={() => navigate(`/estancia/${encodeURIComponent(Estancia.nombreEstancia)}/objetos`)}
                        >
                            {Estancia.nombreEstancia}
                        </h3>

                        <p style={styles.subtitulo}>
                            Hay {Estancia.dispositivos?.length || 0} dispositivos:
                        </p>

                        {Estancia.dispositivos && Estancia.dispositivos.length > 0 ? (
                            <ul style={styles.list}>
                                {Estancia.dispositivos.map((dispositivo, index) => {
                                    const conexionesDispositivo = conexiones[dispositivo] || [];

                                    return (
                                        <li key={index} style={{  display: "flex", alignItems: "center", gap: "8px" }}>

                                            <span>{dispositivo}</span>
                                            {conexionesDispositivo.length > 0 ? (
                                                conexionesDispositivo.map((tipo, i) => (
                                                    <img
                                                        key={i}
                                                        src={iconosConexion[tipo] || "/connections/default.png"}
                                                        alt={tipo}
                                                        style={{ width: "20px", height: "25px" }}
                                                    />
                                                ))
                                            ) : (
                                                <span style={{ fontStyle: "italic", color: "gray" }}>Sin conexión</span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>

                        ) : (
                            <p style={{ color: "white", fontStyle: "italic" }}>No hay dispositivos</p>
                        )}

                        <div style={styles.buttonsContainer}>
                            <button
                                style={styles.editButton}
                                onClick={() => navigate(`/estancia/${encodeURIComponent(Estancia.nombreEstancia)}`)}
                            >
                                Editar
                            </button>
                            <button style={styles.deleteButton} onClick={() => handleDelete(Estancia.id)}>
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p style={{ color: "white" }}>No hay estancias disponibles</p>
            )}
        </div>


    );
};

// ✅ **Estilos Mejorados**
const styles = {
    pageContainer: {
        backgroundColor: "#121212",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        color: "white"
    },
    createButton: {
        padding: "15px 30px",
        background: "rgb(99, 102, 241)",
        border: "2px solid rgb(99, 102, 241)",
        color: "White",
        fontSize: "18px",
        fontWeight: "bold",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "background 0.3s ease-in-out",
        marginBottom: "20px"
    },
    EstanciaGrid: {     // Es el div general que contiene todas las estancias
        marginTop: "20px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px",
        width: "80%",
        maxWidth: "900px",
        justifyContent: "center"
    },
    EstanciaCard: {
        background: "#1e1e1e",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 4px 10px rgba(255, 255, 255, 0.2)",
        textAlign: "center",
        minWidth: "300px",
        maxWidth: "350px"
    },
    nombreEstancia: {
        fontSize: "22px",
        fontWeight: "bold",
        marginBottom: "15px",
        color: "#6366f1"
    },
    subtitulo: {
        fontSize: "16px",
        fontWeight: "bold",
        marginBottom: "10px"
    },
    list: {
        listStyleType: "none",
        padding: "0",
        marginTop: "10px"
    },
    listItem: {
        background: "#303030",
        padding: "10px",
        margin: "8px 0",
        borderRadius: "8px",
        textAlign: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: "14px",
        cursor: "pointer",
        transition: "background 0.3s"
    },
    buttonsContainer: {
        display: "flex",
        justifyContent: "space-around",
        marginTop: "15px"
    },
    editButton: {
        background: "#6366f1",
        color: "white",
        border: "none",
        padding: "8px 15px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "bold",
        transition: "background 0.3s ease-in-out"
    },
    deleteButton: {
        background: "red",
        color: "white",
        border: "none",
        padding: "8px 15px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "bold",
        transition: "background 0.3s ease-in-out"
    }
};

// ✅ Aplicamos hover en React
styles.listItem[":hover"] = { background: "#6366f1" };

export default EstanciaPage;
