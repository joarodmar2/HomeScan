import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EstanciaForm from "../components/EstanciaForm";

const EstanciaPage = () => {
    const navigate = useNavigate();
    const [Estancias, setEstancias] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [dispositivos, setDispositivos] = useState([]);
    const [conexiones, setConexiones] = useState([]);

    useEffect(() => {
        fetchEstancias();

        fetch("http://localhost:8000/vulnet/api/v1/devices/")
            .then((res) => res.json())
            .then(setDispositivos)
            .catch((err) => console.error("Error al cargar dispositivos:", err));

        fetch("http://localhost:8000/vulnet/api/v1/connections/")
            .then((res) => res.json())
            .then((data) => {
                console.log("📡 Conexiones desde API:", data);  // <--- Aquí
                setConexiones(data);
            });


    }, []);


    const fetchEstancias = () => {
        fetch("http://localhost:8000/vulnet/api/v1/Estancia/")
            .then(response => response.json())
            .then(data => setEstancias(Array.isArray(data) ? data : []))
            .catch(error => console.error("Error al obtener estancias:", error));
    };

    const handleNuevaEstancia = () => {
        fetchEstancias(); // 🔁 Vuelve a traer TODAS las estancias del backend
        setMostrarFormulario(false);
    };
    //Conexiones por estancia
    const obtenerConexiones = (deviceId) => {
        const conexionesDispositivo = conexiones.filter(
            (conn) => conn.first_device === deviceId || conn.second_device === deviceId
        );
        const tipos = [...new Set(conexionesDispositivo.map((conn) => conn.type))];
        return tipos;
    };



    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/vulnet/api/v1/Estancia/${id}/`, {
                method: "DELETE",
            });

            if (response.ok) {
                setEstancias(prev => prev.filter(estancia => estancia.id !== id));
            } else {
                console.error("Error al eliminar la estancia");
            }
        } catch (error) {
            console.error("Error en la conexión:", error);
        }
    };

    return (
        <div style={styles.pageContainer}>
            <h2 style={styles.title}>Número de estancias: {Estancias.length}</h2>

            <button style={styles.createButton} onClick={() => setMostrarFormulario(true)}>
                Crear Nueva Estancia
            </button>

            {mostrarFormulario && (
                <EstanciaForm
                    onClose={() => setMostrarFormulario(false)}
                    onEstanciaCreated={handleNuevaEstancia}
                />
            )}

            <div style={styles.grid}>
                {Estancias
                    .filter(estancia => estancia && estancia.nombreEstancia)
                    .map((estancia) => (
                        <div key={estancia.id} style={styles.card}>
                            <h3
                                style={styles.nombreEstancia}
                                onClick={() => navigate(`/estancia/${encodeURIComponent(estancia.nombreEstancia)}/modelado`)}
                            >
                                {estancia.nombreEstancia}
                            </h3>
                            <ul style={{ padding: 0, listStyleType: "none" }}>
                                {estancia.dispositivos?.length > 0 ? (
                                    estancia.dispositivos.map((deviceId, idx) => {
                                        // Buscar el dispositivo completo por ID
                                        const dispositivo = dispositivos.find((d) => d.id === deviceId);
                                        if (!dispositivo) return null;

                                        // Buscar conexiones donde el dispositivo participa
                                        const conexionesDelDispositivo = conexiones.filter(
                                            (conn) =>
                                                conn.first_device?.id === deviceId ||
                                                conn.second_device?.id === deviceId
                                        );

                                        // Obtener tipos de conexión únicos
                                        const tipos = [...new Set(conexionesDelDispositivo.map(conn => conn.type))];

                                        return (
                                            <li
                                                key={idx}
                                                style={{
                                                    marginBottom: "6px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                    fontSize: "14px",
                                                    color: "white"
                                                }}
                                            >
                                                {dispositivo.model}
                                                {tipos.length > 0 && (
                                                    <div style={{ display: "flex", gap: "6px" }}>
                                                        {tipos.map((tipo, i) => (
                                                            <img
                                                                key={i}
                                                                src={`http://localhost:8000/media/connections/${tipo.toLowerCase().replace(/[\s\-]/g, "")}.png`}
                                                                alt={tipo}
                                                                title={tipo}
                                                                style={{ width: "18px", height: "18px" }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}

                                            </li>
                                        );
                                    })
                                ) : (
                                    <li style={{ fontStyle: "italic", color: "white", fontSize: "14px" }}>
                                        No hay dispositivos
                                    </li>
                                )}
                            </ul>






                            <div style={styles.buttonsContainer}>
                                <button
                                    style={styles.editButton}
                                    onClick={() => navigate(`/estancia/${encodeURIComponent(estancia.nombreEstancia)}`)}
                                >
                                    Editar
                                </button>
                                <button
                                    style={styles.deleteButton}
                                    onClick={() => handleDelete(estancia.id)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

const styles = {
    pageContainer: {
        backgroundColor: "#121212",
        minHeight: "100vh",
        padding: "40px",
        color: "white",
        textAlign: "center",
    },
    title: {
        fontSize: "24px",
        marginBottom: "20px"
    },
    createButton: {
        padding: "12px 24px",
        backgroundColor: "#6366f1",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
        marginBottom: "30px"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "20px",
        justifyContent: "center"
    },
    card: {
        backgroundColor: "#1e1e1e",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
    },
    nombreEstancia: {
        fontSize: "20px",
        color: "#4f46e5",
        cursor: "pointer",
        marginBottom: "10px"
    },
    subtitulo: {
        fontSize: "14px",
        fontStyle: "italic",
        marginBottom: "15px"
    },
    buttonsContainer: {
        display: "flex",
        justifyContent: "space-between",
        gap: "10px"
    },
    editButton: {
        backgroundColor: "#3b82f6",
        color: "white",
        border: "none",
        borderRadius: "6px",
        padding: "6px 12px",
        cursor: "pointer"
    },
    deleteButton: {
        backgroundColor: "#ef4444",
        color: "white",
        border: "none",
        borderRadius: "6px",
        padding: "6px 12px",
        cursor: "pointer"
    }
};

export default EstanciaPage;
