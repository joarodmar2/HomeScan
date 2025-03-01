import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const Estancia = () => {
    const { nombre } = useParams();
    const [estancia, setEstancia] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nuevoDispositivo, setNuevoDispositivo] = useState(""); // Estado para el nuevo dispositivo
    const [sugerencias, setSugerencias] = useState([]); // Estado para sugerencias de dispositivos

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/vulnet/api/Estancia/?nombre=${encodeURIComponent(nombre)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al obtener los datos");
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setEstancia(data[0]);
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
    }, [nombre]);

    // ✅ Función para buscar dispositivos en la API mientras se escribe
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
            setSugerencias([]); // Limpiar sugerencias si el input está vacío
        }
    };

    // ✅ Función para eliminar un dispositivo existente
    const handleDeleteDevice = (index) => {
        const updatedDevices = estancia.dispositivos.filter((_, i) => i !== index);
        setEstancia({ ...estancia, dispositivos: updatedDevices });
    };

    // ✅ Función para añadir un dispositivo a la lista
    const handleAddDevice = () => {
        if (nuevoDispositivo.trim() !== "") {
            setEstancia(prevState => ({
                ...prevState,
                dispositivos: [...prevState.dispositivos, nuevoDispositivo]
            }));
            setNuevoDispositivo(""); // Limpiar el input después de agregarlo
            setSugerencias([]); // Limpiar las sugerencias
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
        <div style={styles.pageContainer}>
            <div style={styles.card}>
                <h2 style={styles.nombre}>{estancia.nombreEstancia}</h2>

                <p style={styles.subtitulo}> Dispositivos:</p>
                <ul style={styles.list}>
                    {estancia.dispositivos && estancia.dispositivos.length > 0 ? (
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

                {/* ✅ Input y botón para agregar nuevos dispositivos con búsqueda */}
                <div style={styles.addDeviceContainer}>
                    <input
                        type="text"
                        value={nuevoDispositivo}
                        onChange={(e) => {
                            setNuevoDispositivo(e.target.value);
                            buscarDispositivos(e.target.value);
                        }}
                        placeholder="Añadir nuevo dispositivo..."
                        style={styles.input}
                        list="sugerencias-dispositivos"
                    />
                    <datalist id="sugerencias-dispositivos">
                        {sugerencias.map((nombre, i) => (
                            <option key={i} value={nombre} />
                        ))}
                    </datalist>
                    <button style={styles.addButton} onClick={handleAddDevice}>Añadir</button>
                </div>
            </div>
        </div>
    );
};

// ✅ **Estilos Mejorados**
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
    title: {
        fontSize: "22px",
        fontWeight: "bold",
        marginBottom: "15px",
        textTransform: "uppercase"
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
        fontSize: "14px",
        transition: "background 0.3s ease-in-out"
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
        width: "70%"
    },
    addButton: {
        background: "#6366f1",
        color: "white",
        border: "none",
        padding: "10px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "bold",
        transition: "background 0.3s ease-in-out"
    }
};

export default Estancia;
