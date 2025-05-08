import React, { useEffect, useState } from 'react';
import { Wifi, Bluetooth, Network, Radio, Plug } from "lucide-react";

export default function Estancia({ estancia, onDelete, modoOscuro }) {
    const [detallesDispositivos, setDetallesDispositivos] = useState([]);
    const [conexionesPorDispositivo, setConexionesPorDispositivo] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        const fetchInfo = async () => {
            setIsLoading(true);
            const detallesTemp = [];
            const conexionesTemp = {};

            for (const id of estancia.dispositivos || []) {
                try {
                    // 1️⃣ Obtener detalles del dispositivo
                    const res = await fetch(`http://127.0.0.1:8000/vulnet/api/v1/devices/${id}/`);
                    const data = await res.json();
                    detallesTemp.push(data);

                    // 2️⃣ Obtener conexiones del dispositivo
                    const resConn = await fetch(`http://127.0.0.1:8000/vulnet/api/v1/device/${id}/conexiones/`);
                    const connData = await resConn.json();
                    conexionesTemp[id] = connData.conexiones;

                } catch (error) {
                    console.error(`Error al cargar info del dispositivo ${id}:`, error);
                }
            }

            setDetallesDispositivos(detallesTemp);
            setConexionesPorDispositivo(conexionesTemp);
            setIsLoading(false);
        };

        fetchInfo();
    }, [estancia.id, estancia.dispositivos]);
    const iconoConexion = (tipo) => {
        const clean = tipo.toLowerCase().replace(/[^a-z0-9]/g, '');

        if (clean.includes("wifi")) return <Wifi size={20} strokeWidth={2} />;
        if (clean.includes("bluetooth")) return <Bluetooth size={20} strokeWidth={2} />;
        if (clean.includes("ethernet")) return <Cable size={20} strokeWidth={2} />;
        if (clean.includes("zigbee")) return <Radio size={20} strokeWidth={2} />;
        return <Plug size={20} strokeWidth={2} />;
    };


    // Función para obtener un color basado en el tipo de conexión
    const getConnectionColor = (type) => {
        const colors = {
            'wifi': '#4caf50',
            'bluetooth': '#2196f3',
            'ethernet': '#ff9800',
            'usb': '#9c27b0',
            'zigbee': '#00bcd4',
            'zwave': '#673ab7',
        };
        return colors[type?.toLowerCase()] || '#757575';
    };

    // Estilos mejorados
    const styles = {
        card: {
            border: '1px solid',
            borderColor: modoOscuro ? '#333' : '#e0e0e0',
            borderRadius: '12px',
            padding: '20px',
            backgroundColor: modoOscuro ? '#1e1e1e' : 'white',
            color: modoOscuro ? '#fff' : '#333',
            transition: 'all 0.3s ease',
            boxShadow: modoOscuro ? '0 4px 8px rgba(0,0,0,0.3)' : '0 4px 8px rgba(0,0,0,0.1)',
            position: 'relative',
            overflow: 'hidden',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px',
            borderBottom: `1px solid ${modoOscuro ? '#333' : '#eee'}`,
            paddingBottom: '12px',
        },
        title: {
            fontSize: '18px',
            fontWeight: '600',
            margin: '0 0 4px 0',
            color: modoOscuro ? '#fff' : '#111',
            fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        },
        deviceCount: {
            display: 'inline-block',
            padding: '4px 8px',
            backgroundColor: modoOscuro ? '#333' : '#f0f0f0',
            color: modoOscuro ? '#fff' : '#333',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500',
        },
        deviceSection: {
            marginTop: '16px',
        },
        deviceSectionTitle: {
            fontSize: '16px',
            fontWeight: '500',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
        },
        deviceList: {
            margin: '0',
            padding: '0',
            listStyle: 'none',
        },
        deviceItem: {
            padding: '10px 12px',
            marginBottom: '8px',
            borderRadius: '8px',
            backgroundColor: modoOscuro ? '#2a2a2a' : '#f5f5f5',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
        },
        deviceModel: {
            fontWeight: '500',
            fontSize: '14px',
        },
        connectionTags: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
        },
        connectionTag: (type) => ({
            display: 'inline-block',
            padding: '3px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '500',
            backgroundColor: getConnectionColor(type) + (modoOscuro ? '30' : '20'),
            color: getConnectionColor(type),
            border: `1px solid ${getConnectionColor(type)}`,
        }),
        buttonContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '20px',
            gap: '10px',
        },
        button: {
            padding: '10px 16px',
            borderRadius: '8px',
            fontWeight: '500',
            cursor: 'pointer',
            border: 'none',
            transition: 'all 0.2s ease',
            flex: '1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '6px',
        },
        showButton: {
            backgroundColor: modoOscuro ? '#333' : '#f0f0f0',
            color: modoOscuro ? '#fff' : '#333',
        },
        deleteButton: {
            backgroundColor: '#d32f2f20',
            color: '#d32f2f',
            border: '1px solid #d32f2f',
        },
        loadingContainer: {
            padding: '20px 0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '10px',
        },
        loadingText: {
            fontSize: '14px',
            color: modoOscuro ? '#aaa' : '#666',
        },
        connectionIcon: {
            width: '20px',
            height: '20px',
            marginRight: '6px',
            objectFit: 'contain',
            verticalAlign: 'middle',
        },
        loadingDot: {
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: modoOscuro ? '#555' : '#ccc',
            margin: '0 3px',
            animation: 'pulse 1.5s infinite ease-in-out',
        },
        subtitle: {
            fontSize: '14px',
            color: modoOscuro ? '#bbb' : '#6c757d',
            margin: '0 0 8px 0',
            fontWeight: '400',
            fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        },

        noDevices: {
            padding: '16px',
            textAlign: 'center',
            color: modoOscuro ? '#aaa' : '#666',
            backgroundColor: modoOscuro ? '#2a2a2a' : '#f5f5f5',
            borderRadius: '8px',
            fontSize: '14px',
        },
        detailsContainer: {
            marginTop: '16px',
            padding: '16px',
            backgroundColor: modoOscuro ? '#2a2a2a' : '#f5f5f5',
            borderRadius: '8px',
            fontSize: '14px',
            display: showDetails ? 'block' : 'none',
            animation: 'fadeIn 0.3s ease',
        },
        detailRow: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 0',
            borderBottom: `1px solid ${modoOscuro ? '#333' : '#e0e0e0'}`,
        },
        '@keyframes pulse': {
            '0%, 100%': { opacity: 0.5 },
            '50%': { opacity: 1 },
        },
        '@keyframes fadeIn': {
            from: { opacity: 0 },
            to: { opacity: 1 },
        },
    };

    // Crear un estilo para la animación de carga
    const loadingStyle = document.createElement('style');
    loadingStyle.innerHTML = `
        @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }
        .loading-dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: ${modoOscuro ? '#555' : '#ccc'};
            margin: 0 3px;
            animation: pulse 1.5s infinite ease-in-out;
        }
        .loading-dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        .loading-dot:nth-child(3) {
            animation-delay: 0.4s;
        }
    `;
    document.head.appendChild(loadingStyle);

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <div>
                    <h3 style={styles.title}>{estancia.nombreEstancia || estancia.nombre}</h3>
                    <p style={styles.subtitle}>{estancia.ubicacion}</p>

                    <span style={styles.deviceCount}>
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
                        <div>
                            <span className="loading-dot"></span>
                            <span className="loading-dot"></span>
                            <span className="loading-dot"></span>
                        </div>
                        <span style={styles.loadingText}>Cargando dispositivos...</span>
                    </div>
                ) : detallesDispositivos.length > 0 ? (
                    <ul style={styles.deviceList}>
                        {detallesDispositivos.map((d) => {
                            const conexiones = conexionesPorDispositivo[d.id] || [];
                            const tipos = [...new Set(conexiones.map(c => c.connection_type))];

                            return (
                                <li key={d.id} style={styles.deviceItem}>
                                    <span style={styles.deviceModel}>{d.model}</span>
                                    {tipos.length > 0 ? (
                                        <div style={styles.connectionTags}>
                                            {tipos.map((tipo, index) => (
                                                <span key={index} title={tipo} style={{ marginRight: '6px' }}>
                                                    {iconoConexion(tipo)}
                                                </span>
                                            ))}

                                        </div>
                                    ) : (
                                        <span style={{ fontSize: '12px', color: modoOscuro ? '#aaa' : '#888' }}>
                                            Sin conexiones
                                        </span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div style={styles.noDevices}>
                        No hay dispositivos en esta estancia
                    </div>
                )}
            </div>

            {showDetails && (
                <div style={styles.detailsContainer}>
                    <div style={styles.detailRow}>
                        <span>ID:</span>
                        <span>{estancia.id}</span>
                    </div>
                    {estancia.ubicacion && (
                        <div style={styles.detailRow}>
                            <span>Ubicación:</span>
                            <span>{estancia.ubicacion}</span>
                        </div>
                    )}
                    <div style={styles.detailRow}>
                        <span>Total dispositivos:</span>
                        <span>{estancia.dispositivos?.length || 0}</span>
                    </div>
                </div>
            )}

            <div style={styles.buttonContainer}>
                <button
                    style={{ ...styles.button, ...styles.showButton }}
                    onClick={() => setShowDetails(!showDetails)}
                >
                    {showDetails ? 'Ocultar detalles' : 'Mostrar detalles'}
                </button>
                <button
                    style={{ ...styles.button, ...styles.deleteButton }}
                    onClick={() => onDelete(estancia.id)}
                >
                    Eliminar
                </button>
            </div>
        </div>
    );
}