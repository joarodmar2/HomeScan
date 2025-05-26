// "use client"

import { useEffect, useState } from "react"
import { Wifi, Bluetooth, Network, Radio, Plug, Cable, Trash2 } from "lucide-react"
import { FaEye } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

export default function Estancia({ estancia, onDelete, modoOscuro }) {
    const [detallesDispositivos, setDetallesDispositivos] = useState([])
    const [conexionesPorDispositivo, setConexionesPorDispositivo] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [showDetails, setShowDetails] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const navigate = useNavigate()

    // Paleta de colores moderna y legible para modo oscuro
    const theme = {
        bg: modoOscuro ? "#0D1117" : "#fafbfc",
        cardBg: modoOscuro ? "#161B22" : "#ffffff",
        text: modoOscuro ? "#C9D1D9" : "#1a202c",
        textSecondary: modoOscuro ? "#8B949E" : "#64748b",
        border: modoOscuro ? "#30363D" : "#e2e8f0",
        itemBg: modoOscuro ? "#21262D" : "#f8fafc",
        accent: modoOscuro ? "#58A6FF" : "#3b82f6",
        accentHover: modoOscuro ? "#79C0FF" : "#2563eb",
        danger: "#ef4444",
        dangerHover: "#dc2626",
        success: "#10b981",
        info: "#06b6d4",
        warning: "#f59e0b",
        gradient: modoOscuro
            ? "linear-gradient(135deg, #161B22 0%, #21262D 100%)"
            : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        shadow: modoOscuro
            ? "0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)"
            : "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        shadowHover: modoOscuro
            ? "0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 8px 12px -4px rgba(0, 0, 0, 0.3)"
            : "0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 8px 12px -4px rgba(0, 0, 0, 0.1)",
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
            size: 16,
            strokeWidth: 2,
            style: {
                verticalAlign: "middle",
                marginRight: "6px",
                color: getConnectionColor(tipo),
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
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
            wifi: "#10b981",
            bluetooth: "#3b82f6",
            ethernet: "#f59e0b",
            usb: "#8b5cf6",
            zigbee: "#06b6d4",
            zwave: "#6366f1",
        }

        for (const [key, value] of Object.entries(colors)) {
            if (clean.includes(key)) return value
        }

        return theme.textSecondary
    }

    // Estilos mejorados con más sofisticación visual
    const styles = {
        card: {
            border: `1px solid ${theme.border}`,
            borderRadius: "20px",
            padding: "28px",
            background: theme.gradient,
            color: theme.text,
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: isHovered ? theme.shadowHover : theme.shadow,
            position: "relative",
            overflow: "hidden",
            backdropFilter: "blur(10px)",
            transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        },
        cardOverlay: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${theme.accent}, ${getConnectionColor("wifi")}, ${getConnectionColor("bluetooth")})`,
            borderRadius: "20px 20px 0 0",
        },
        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "24px",
            paddingBottom: "20px",
            borderBottom: `2px solid ${theme.border}`,
            position: "relative",
        },
        title: {
            fontSize: "28px",
            fontWeight: "800",
            margin: "0 0 8px 0",
            color: modoOscuro ? "#8CD3E0" : "#1A202C",
            fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, Roboto, sans-serif",
            letterSpacing: "-0.8px",
            lineHeight: "1.2",
        },
        deviceCount: {
            display: "inline-flex",
            alignItems: "center",
            padding: "8px 16px",
            background: `linear-gradient(135deg, ${theme.accent}20, ${theme.accent}10)`,
            color: theme.accent,
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: "600",
            marginTop: "12px",
            border: `1px solid ${theme.accent}30`,
            backdropFilter: "blur(10px)",
            boxShadow: `0 4px 12px ${theme.accent}20`,
        },
        deviceSection: {
            marginTop: "24px",
        },
        deviceSectionTitle: {
            fontSize: "18px",
            fontWeight: "700",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            color: theme.text,
            fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
            letterSpacing: "-0.3px",
        },
        deviceList: {
            margin: "0",
            padding: "0",
            listStyle: "none",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
        },
        deviceItem: {
            padding: "20px",
            borderRadius: "16px",
            background: `linear-gradient(135deg, ${theme.itemBg}, ${modoOscuro ? "#2a2d5a" : "#f1f5f9"})`,
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            border: `1px solid ${theme.border}`,
            position: "relative",
            overflow: "hidden",
            backdropFilter: "blur(5px)",
        },
        deviceModel: {
            fontWeight: "600",
            fontSize: "16px",
            color: theme.text,
            letterSpacing: "-0.2px",
            lineHeight: "1.3",
        },
        connectionTags: {
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
        },
        connectionTag: (type) => ({
            display: "inline-flex",
            alignItems: "center",
            padding: "6px 12px",
            borderRadius: "16px",
            fontSize: "12px",
            fontWeight: "600",
            background: `linear-gradient(135deg, ${getConnectionColor(type)}15, ${getConnectionColor(type)}08)`,
            color: getConnectionColor(type),
            border: `1px solid ${getConnectionColor(type)}30`,
            backdropFilter: "blur(5px)",
            transition: "all 0.2s ease",
            boxShadow: `0 2px 8px ${getConnectionColor(type)}20`,
        }),
        buttonContainer: {
            display: "flex",
            justifyContent: "space-between",
            marginTop: "32px",
            gap: "16px",
        },
        button: {
            padding: "14px 20px",
            borderRadius: "12px",
            fontWeight: "600",
            cursor: "pointer",
            border: "none",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            flex: "1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            fontSize: "14px",
            letterSpacing: "-0.1px",
            position: "relative",
            overflow: "hidden",
            backdropFilter: "blur(10px)",
        },
        showButton: {
            background: `linear-gradient(135deg, ${theme.accent}15, ${theme.accent}08)`,
            color: theme.accent,
            border: `1px solid ${theme.accent}40`,
            boxShadow: `0 4px 12px ${theme.accent}20`,
        },
        deleteButton: {
            background: `linear-gradient(135deg, ${theme.danger}15, ${theme.danger}08)`,
            color: theme.danger,
            border: `1px solid ${theme.danger}40`,
            boxShadow: `0 4px 12px ${theme.danger}20`,
        },
        loadingContainer: {
            padding: "40px 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "16px",
            background: `linear-gradient(135deg, ${theme.itemBg}, ${modoOscuro ? "#2a2d5a" : "#f1f5f9"})`,
            borderRadius: "16px",
            border: `1px solid ${theme.border}`,
            backdropFilter: "blur(5px)",
        },
        loadingText: {
            fontSize: "14px",
            color: theme.textSecondary,
            fontWeight: "500",
        },
        loadingDots: {
            display: "flex",
            gap: "8px",
        },
        subtitle: {
            fontSize: "15px",
            color: theme.textSecondary,
            margin: "0 0 12px 0",
            fontWeight: "500",
            fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "6px",
        },
        noDevices: {
            padding: "32px",
            textAlign: "center",
            color: theme.textSecondary,
            background: `linear-gradient(135deg, ${theme.itemBg}, ${modoOscuro ? "#2a2d5a" : "#f1f5f9"})`,
            borderRadius: "16px",
            fontSize: "15px",
            border: `2px dashed ${theme.border}`,
            fontWeight: "500",
            backdropFilter: "blur(5px)",
        },
        detailsContainer: {
            marginTop: "24px",
            padding: "20px",
            background: `linear-gradient(135deg, ${theme.itemBg}, ${modoOscuro ? "#2a2d5a" : "#f1f5f9"})`,
            borderRadius: "16px",
            fontSize: "14px",
            display: showDetails ? "block" : "none",
            animation: "fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            border: `1px solid ${theme.border}`,
            backdropFilter: "blur(5px)",
        },
        detailRow: {
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 0",
            borderBottom: `1px solid ${theme.border}`,
        },
        detailLabel: {
            fontWeight: "600",
            color: theme.textSecondary,
        },
        detailValue: {
            fontWeight: "600",
            color: theme.text,
        },
    }

    // Crear un estilo para las animaciones mejoradas
    useEffect(() => {
        const loadingStyle = document.createElement("style")
        loadingStyle.innerHTML = `
            @keyframes pulse {
                0%, 100% { 
                    opacity: 0.4; 
                    transform: scale(0.8); 
                    background-color: ${theme.accent}60;
                }
                50% { 
                    opacity: 1; 
                    transform: scale(1.1); 
                    background-color: ${theme.accent};
                }
            }
            @keyframes fadeIn {
                from { 
                    opacity: 0; 
                    transform: translateY(20px) scale(0.95); 
                }
                to { 
                    opacity: 1; 
                    transform: translateY(0) scale(1); 
                }
            }
            @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            .loading-dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: linear-gradient(135deg, ${theme.accent}, ${getConnectionColor("wifi")});
                margin: 0 4px;
                display: inline-block;
                animation: pulse 1.8s infinite ease-in-out;
                box-shadow: 0 2px 8px ${theme.accent}40;
            }
            .loading-dot:nth-child(2) {
                animation-delay: 0.3s;
            }
            .loading-dot:nth-child(3) {
                animation-delay: 0.6s;
            }
            .device-item {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .device-item:hover {
                transform: translateY(-4px) scale(1.02);
                box-shadow: 0 12px 24px ${modoOscuro ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.12)"};
                border-color: ${theme.accent}60;
            }
            .device-item::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, ${theme.accent}10, transparent);
                transition: left 0.5s;
            }
            .device-item:hover::before {
                left: 100%;
            }
            .button-hover:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(0,0,0,0.15);
            }
            .button-hover:active {
                transform: translateY(0);
            }
        `
        document.head.appendChild(loadingStyle)

        return () => {
            if (document.head.contains(loadingStyle)) {
                document.head.removeChild(loadingStyle)
            }
        }
    }, [modoOscuro, theme.accent])

    return (
        <div style={styles.card} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <div style={styles.cardOverlay}></div>

            <div style={styles.header}>
                <div>
                    <h3 style={styles.title}>{estancia.nombreEstancia || estancia.nombre}</h3>
                    {estancia.ubicacion && (
                        <p style={styles.subtitle}>
                            <Network size={16} style={{ color: theme.accent }} />
                            {estancia.ubicacion}
                        </p>
                    )}
                    <span style={styles.deviceCount}>
                        <Network size={14} style={{ marginRight: "6px" }} />
                        {estancia.dispositivos?.length || 0} dispositivos
                    </span>
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
                                        <span
                                            style={{
                                                fontSize: "13px",
                                                color: theme.textSecondary,
                                                fontStyle: "italic",
                                                fontWeight: "500",
                                            }}
                                        >
                                            Sin conexiones
                                        </span>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                ) : (
                    <div style={styles.noDevices}>
                        <Network size={24} style={{ marginBottom: "8px", opacity: 0.5 }} />
                        <br />
                        No hay dispositivos en esta estancia
                    </div>
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
                    className="button-hover"
                    style={{ ...styles.button, ...styles.showButton }}
                    onClick={() => navigate(`/estancia/${estancia.nombreEstancia || estancia.nombre}/modelado`)}
                >
                    <FaEye size={16} /> Ir al modelado
                </button>
                <button
                    className="button-hover"
                    style={{ ...styles.button, ...styles.deleteButton }}
                    onClick={async () => {
                        try {
                            const res = await fetch(`http://127.0.0.1:8000/vulnet/api/v1/Estancia/${estancia.id}/`, {
                                method: "DELETE",
                            })
                            if (res.ok) {
                                onDelete(estancia.id)
                            } else {
                                console.error("Error al eliminar la estancia:", await res.text())
                            }
                        } catch (error) {
                            console.error("Error de red al eliminar la estancia:", error)
                        }
                    }}
                >
                    <Trash2 size={16} /> Eliminar
                </button>
            </div>
        </div>
    )
}
