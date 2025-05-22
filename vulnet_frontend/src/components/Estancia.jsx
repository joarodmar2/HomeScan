// "use client"

import { useEffect, useState } from "react"
import { Wifi, Bluetooth, Network, Radio, Plug, Cable, ChevronUp, Trash2, Info } from "lucide-react"
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom"

export default function Estancia({ estancia, onDelete, modoOscuro }) {
    const [detallesDispositivos, setDetallesDispositivos] = useState([])
    const [conexionesPorDispositivo, setConexionesPorDispositivo] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [showDetails, setShowDetails] = useState(false)
    const navigate = useNavigate()

    // Colores del tema
    const theme = {
        bg: modoOscuro ? "#1e1e1e" : "#ffffff",
        cardBg: modoOscuro ? "#252525" : "#ffffff",
        text: modoOscuro ? "#e0e0e0" : "#333333",
        textSecondary: modoOscuro ? "#a0a0a0" : "#6c757d",
        border: modoOscuro ? "#333333" : "#e0e0e0",
        itemBg: modoOscuro ? "#2a2a2a" : "#f5f5f5",
        accent: modoOscuro ? "#3a86ff" : "#0070f3",
        danger: "#d32f2f",
        success: "#4caf50",
        info: "#2196f3",
        warning: "#ff9800",
    }

    useEffect(() => {
        const fetchInfo = async () => {
            if (!estancia.dispositivos || estancia.dispositivos.length === 0) {
                setIsLoading(false)
                return
            }

            setIsLoading(true)
            const detallesTemp = []
            const conexionesTemp = {}

            try {
                // Usar Promise.all para cargar todos los dispositivos en paralelo
                await Promise.all(
                    estancia.dispositivos.map(async (id) => {
                        try {
                            // 1️⃣ Obtener detalles del dispositivo
                            const res = await fetch(`http://127.0.0.1:8000/vulnet/api/v1/devices/${id}/`)
                            const data = await res.json()
                            detallesTemp.push(data)

                            // 2️⃣ Obtener conexiones del dispositivo
                            const resConn = await fetch(`http://127.0.0.1:8000/vulnet/api/v1/device/${id}/conexiones/`)
                            const connData = await resConn.json()
                            conexionesTemp[id] = connData.conexiones
                        } catch (error) {
                            console.error(`Error al cargar info del dispositivo ${id}:`, error)
                        }
                    }),
                )
            } catch (error) {
                console.error("Error al cargar dispositivos:", error)
            } finally {
                setDetallesDispositivos(detallesTemp)
                setConexionesPorDispositivo(conexionesTemp)
                setIsLoading(false)
            }
        }

        fetchInfo()
    }, [estancia.id, estancia.dispositivos])
    const iconoConexion = (tipo) => {
        const clean = tipo.toLowerCase().replace(/[^a-z0-9]/g, "")
        const iconProps = {
            size: 18,
            strokeWidth: 1.5,
            style: {
                verticalAlign: "middle",
                marginRight: "4px",
                color: getConnectionColor(tipo),
            },
        }

        if (clean.includes("wifi")) return <Wifi {...iconProps} />
        if (clean.includes("bluetooth")) return <Bluetooth {...iconProps} />
        if (clean.includes("ethernet")) return <Cable {...iconProps} />
        if (clean.includes("zigbee")) return <Radio {...iconProps} />
        return <Plug {...iconProps} />
    }

    // Función para obtener un color basado en el tipo de conexión
    const getConnectionColor = (type) => {
        if (!type) return theme.textSecondary

        const clean = type.toLowerCase().replace(/[^a-z0-9]/g, "")
        const colors = {
            wifi: "#4caf50",
            bluetooth: "#2196f3",
            ethernet: "#ff9800",
            usb: "#9c27b0",
            zigbee: "#00bcd4",
            zwave: "#673ab7",
        }

        for (const [key, value] of Object.entries(colors)) {
            if (clean.includes(key)) return value
        }

        return theme.textSecondary
    }

    // Estilos mejorados
    const styles = {
        card: {
            border: `1px solid ${theme.border}`,
            borderRadius: "12px",
            padding: "20px",
            backgroundColor: modoOscuro ? "#171923" : theme.cardBg,
            color: theme.text,
            transition: "all 0.3s ease",
            boxShadow: modoOscuro ? "0 4px 12px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.08)",
            position: "relative",
            overflow: "hidden",
        },
        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "16px",
            borderBottom: `1px solid ${theme.border}`,
            paddingBottom: "12px",
        },
        title: {
            fontSize: "24px",
            fontWeight: "700",
            margin: "0 0 4px 0",
            color: theme.text,
            fontFamily: "'Segoe UI', system-ui, -apple-system, Roboto, sans-serif",
            letterSpacing: "-0.5px",
        },
        deviceCount: {
            display: "inline-block",
            padding: "4px 10px",
            backgroundColor: theme.accent + "20",
            color: theme.accent,
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "500",
            marginTop: "8px",
        },
        deviceSection: {
            marginTop: "16px",
        },
        deviceSectionTitle: {
            fontSize: "16px",
            fontWeight: "600",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            color: theme.text,
            textTransform: "none",
            letterSpacing: "0.25px",
            fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
        },
        deviceList: {
            margin: "0",
            padding: "0",
            listStyle: "none",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "12px",
        },
        deviceItem: {
            padding: "12px 16px",
            borderRadius: "10px",
            backgroundColor: modoOscuro ? "#202a44" : theme.itemBg,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            border: `1px solid ${theme.border}`,
            ":hover": {
                transform: "translateY(-2px)",
                boxShadow: modoOscuro ? "0 6px 12px rgba(0,0,0,0.2)" : "0 6px 12px rgba(0,0,0,0.1)",
            },
        },
        deviceModel: {
            fontWeight: "500",
            fontSize: "15px",
            color: theme.text,
        },
        connectionTags: {
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
        },
        connectionTag: (type) => ({
            display: "inline-flex",
            alignItems: "center",
            padding: "4px 10px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "500",
            backgroundColor: getConnectionColor(type) + (modoOscuro ? "20" : "15"),
            color: getConnectionColor(type),
            border: `1px solid ${getConnectionColor(type) + "40"}`,
        }),
        buttonContainer: {
            display: "flex",
            justifyContent: "space-between",
            marginTop: "24px",
            gap: "12px",
        },
        button: {
            padding: "10px 16px",
            borderRadius: "8px",
            fontWeight: "500",
            cursor: "pointer",
            border: "none",
            transition: "all 0.2s ease",
            flex: "1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
        },
        showButton: {
            backgroundColor: theme.accent + "15",
            color: theme.accent,
            border: `1px solid ${theme.accent}30`,
            ":hover": {
                backgroundColor: theme.accent + "25",
            },
        },
        deleteButton: {
            backgroundColor: theme.danger + "15",
            color: theme.danger,
            border: `1px solid ${theme.danger}30`,
            ":hover": {
                backgroundColor: theme.danger + "25",
            },
        },
        loadingContainer: {
            padding: "30px 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "12px",
            backgroundColor: theme.itemBg,
            borderRadius: "10px",
        },
        loadingText: {
            fontSize: "14px",
            color: theme.textSecondary,
        },
        loadingDots: {
            display: "flex",
            gap: "6px",
        },
        loadingDot: {
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: theme.accent,
            opacity: 0.6,
            animation: "pulse 1.5s infinite ease-in-out",
        },
        subtitle: {
            fontSize: "14px",
            color: theme.textSecondary,
            margin: "0 0 8px 0",
            fontWeight: "400",
            fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        },
        noDevices: {
            padding: "20px",
            textAlign: "center",
            color: theme.textSecondary,
            backgroundColor: theme.itemBg,
            borderRadius: "10px",
            fontSize: "14px",
            border: `1px dashed ${theme.border}`,
        },
        detailsContainer: {
            marginTop: "20px",
            padding: "16px",
            backgroundColor: theme.itemBg,
            borderRadius: "10px",
            fontSize: "14px",
            display: showDetails ? "block" : "none",
            animation: "fadeIn 0.3s ease",
            border: `1px solid ${theme.border}`,
        },
        detailRow: {
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 0",
            borderBottom: `1px solid ${theme.border}`,
        },
        detailLabel: {
            fontWeight: "500",
            color: theme.textSecondary,
        },
        detailValue: {
            fontWeight: "500",
            color: theme.text,
        },
        iconContainer: {
            display: "flex",
            alignItems: "center",
            gap: "4px",
        },
    }

    // Crear un estilo para la animación de carga
    useEffect(() => {
        const loadingStyle = document.createElement("style")
        loadingStyle.innerHTML = `
            @keyframes pulse {
                0%, 100% { opacity: 0.4; transform: scale(0.8); }
                50% { opacity: 1; transform: scale(1); }
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .loading-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: ${theme.accent};
                margin: 0 3px;
                display: inline-block;
                animation: pulse 1.5s infinite ease-in-out;
            }
            .loading-dot:nth-child(2) {
                animation-delay: 0.2s;
            }
            .loading-dot:nth-child(3) {
                animation-delay: 0.4s;
            }
            .device-item {
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            .device-item:hover {
                transform: translateY(-2px);
                box-shadow: ${modoOscuro ? "0 6px 12px rgba(0,0,0,0.2)" : "0 6px 12px rgba(0,0,0,0.1)"};
            }
        `
        document.head.appendChild(loadingStyle)

        return () => {
            document.head.removeChild(loadingStyle)
        }
    }, [modoOscuro, theme.accent])

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <div>
                    <h3 style={styles.title}>{estancia.nombreEstancia || estancia.nombre}</h3>
                    {estancia.ubicacion && (
                        <p style={styles.subtitle}>
                            <Network size={14} style={{ verticalAlign: "middle", marginRight: "4px" }} />
                            {estancia.ubicacion}
                        </p>
                    )}
                    <span style={styles.deviceCount}>{estancia.dispositivos?.length || 0} dispositivos</span>
                </div>
            </div>

            <div style={styles.deviceSection}>
                <div style={styles.deviceSectionTitle}>
                    <span>Dispositivos conectados</span>
                </div>

                {isLoading ? (
                    <div style={styles.loadingContainer}>
                        <div style={styles.loadingDots}>
                            <span className="loading-dot"></span>
                            <span className="loading-dot"></span>
                            <span className="loading-dot"></span>
                        </div>
                        <span style={styles.loadingText}>Cargando dispositivos...</span>
                    </div>
                ) : detallesDispositivos.length > 0 ? (
                    <ul style={styles.deviceList}>
                        {detallesDispositivos.map((d) => {
                            const conexiones = conexionesPorDispositivo[d.id] || []
                            const tipos = [...new Set(conexiones.map((c) => c.connection_type))]

                            return (
                                <li key={d.id} style={styles.deviceItem} className="device-item">
                                    <span style={styles.deviceModel}>{d.model}</span>
                                    {tipos.length > 0 ? (
                                        <div style={styles.connectionTags}>
                                            {tipos.map((tipo, index) => (
                                                <span key={index} style={styles.connectionTag(tipo)}>
                                                    {iconoConexion(tipo)}
                                                    {tipo}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span style={{ fontSize: "12px", color: theme.textSecondary }}>Sin conexiones</span>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                ) : (
                    <div style={styles.noDevices}>No hay dispositivos en esta estancia</div>
                )}
            </div>

            {showDetails && (
                <div style={styles.detailsContainer}>
                    <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>ID:</span>
                        <span style={styles.detailValue}>{estancia.id}</span>
                    </div>
                    {estancia.ubicacion && (
                        <div style={styles.detailRow}>
                            <span style={styles.detailLabel}>Ubicación:</span>
                            <span style={styles.detailValue}>{estancia.ubicacion}</span>
                        </div>
                    )}
                    <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Total dispositivos:</span>
                        <span style={styles.detailValue}>{estancia.dispositivos?.length || 0}</span>
                    </div>
                </div>
            )}

            <div style={styles.buttonContainer}>
                <button
                    style={{ ...styles.button, ...styles.showButton }}
                    onClick={() =>
                        navigate(`/estancia/${estancia.nombreEstancia || estancia.nombre}/modelado`)
                    }
                >
                    <FaEye size={16} /> Ir al modelado
                </button>
                <button
                    style={{ ...styles.button, ...styles.deleteButton }}
                    onClick={async () => {
                        try {
                            const res = await fetch(`http://127.0.0.1:8000/vulnet/api/v1/Estancia/${estancia.id}/`, {
                                method: "DELETE",
                            });
                            if (res.ok) {
                                onDelete(estancia.id);
                            } else {
                                console.error("Error al eliminar la estancia:", await res.text());
                            }
                        } catch (error) {
                            console.error("Error de red al eliminar la estancia:", error);
                        }
                    }}
                >
                    <Trash2 size={16} /> Eliminar
                </button>
            </div>
        </div>
    )
}
