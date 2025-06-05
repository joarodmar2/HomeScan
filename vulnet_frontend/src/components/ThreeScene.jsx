"use client"

import { useRef, useEffect, useState } from "react"
import { useColorMode } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import FurnitureForm from "./FurnitureForm"
import Header from "./Header"
import axios from 'axios';

const CanvasRoom = () => {
    const canvasRef = useRef(null)
    const { nombreEstancia } = useParams()
    // debajo de otros useState
    const [activePanel, setActivePanel] = useState("furniture");   // "furniture" | "devices"
    const [furniture, setFurniture] = useState([])
    const [selectedItem, setSelectedItem] = useState(null)
    const [rotations, setRotations] = useState({})
    const [estanciaId, setEstanciaId] = useState(null)
    const [muebles, setMuebles] = useState([])
    const [estancia, setEstancia] = useState(null)
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    const [draggingItem, setDraggingItem] = useState(null)
    const [resizing, setResizing] = useState(null)
    const [backgroundImage, setBackgroundImage] = useState(null)
    const [bgImgObject, setBgImgObject] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [dispositivosDisponibles, setDispositivosDisponibles] = useState([]);
    const [dispositivosEstancia, setDispositivosEstancia] = useState([]);
    const [error, setError] = useState(null);

    const { colorMode } = useColorMode();
    // unified light/dark palette
    const COLORS = {
        lightBg: "#f4f4f4",
        lightCard: "#ffffff",
        darkBg: "#1a202c",
        darkCard: "#2d3748",
        darkText: "#ffffff",
        lightText: "#1a1a1a",
    };
    const isDark = colorMode === "dark";
    const navigate = useNavigate();

    // Cargar imagen de fondo con crossOrigin
    useEffect(() => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = `${backgroundImage}?t=${Date.now()}`
        img.onload = () => setBgImgObject(img)
    }, [backgroundImage])

    // Obtener estanciaId
    useEffect(() => {
        setLoading(true)

        fetch(`http://localhost:8000/vulnet/api/v1/Estancia/nombre/${encodeURIComponent(nombreEstancia)}/`)
            .then((response) => response.json())
            .then((data) => {
                setEstanciaId(data.id);
                setEstancia(data);
            })
            .catch((error) => console.error("Error al obtener la estancia:", error))
            .finally(() => setLoading(false))
    }, [nombreEstancia])

    // Actualizar backgroundImage cuando cambia estancia?.tipo_suelo
    useEffect(() => {
        if (estancia?.tipo_suelo) {
            const map = {
                light_wood: "http://localhost:8000/media/textures/wood.jpg",
                tile: "http://localhost:8000/media/textures/baldosas.jpeg",
                dark_wood: "http://localhost:8000/media/textures/dark_wood.png",
            };
            setBackgroundImage(map[estancia.tipo_suelo]);
        }
    }, [estancia?.tipo_suelo]);

    // Obtener muebles
    useEffect(() => {
        if (estanciaId) {
            setLoading(true)
            fetch(`http://localhost:8000/vulnet/api/v1/muebles/estancia/${estanciaId}/`)
                .then((response) => response.json())
                .then((data) => {
                    setMuebles(data)
                    setFurniture(data.map((m) => ({ ...m })))
                    setRotations(data.reduce((acc, m, i) => ({ ...acc, [i]: m.rotation }), {}))
                })
                .catch((error) => console.error("Error al obtener los muebles:", error))
                .finally(() => setLoading(false))
        }
    }, [estanciaId])

    // Dibujar el canvas
    useEffect(() => {
        if (!canvasRef.current || !estancia || !bgImgObject) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(bgImgObject, 0, 0, canvas.width, canvas.height)

        furniture.forEach((item, index) => {
            const img = new Image()
            img.crossOrigin = "anonymous"
            img.src = `http://localhost:8000/${item.imagen}`
            img.onload = () => {
                ctx.save()
                const rotationAngle = rotations[index] || 0
                ctx.translate(item.x + item.width / 2, item.y + item.height / 2)
                ctx.rotate((rotationAngle * Math.PI) / 180)
                ctx.drawImage(img, -item.width / 2, -item.height / 2, item.width, item.height)
                ctx.restore()

                if (item.imagen_dispositivo) {
                    const dispositivoImg = new Image()
                    dispositivoImg.crossOrigin = "anonymous"

                    dispositivoImg.src = `http://localhost:8000${item.imagen_dispositivo}`

                    dispositivoImg.onload = () => {
                        ctx.save()
                        ctx.translate(item.x + item.width / 2, item.y + item.height / 2 - 15) // 15px más arriba
                        ctx.rotate((rotationAngle * Math.PI) / 180)
                        ctx.drawImage(dispositivoImg, -item.width / 4, -item.height / 4, item.width / 2, item.height / 2)
                        ctx.restore()
                    }
                }

                if (selectedItem === index) {
                    // Recuadro de selección con efecto de brillo
                    ctx.strokeStyle = "#4a90e2"
                    ctx.lineWidth = 2
                    ctx.setLineDash([5, 3])
                    ctx.strokeRect(item.x, item.y, item.width, item.height)
                    ctx.setLineDash([])

                    // Controlador de redimensión (esquina inferior derecha)
                    ctx.fillStyle = "#4a90e2"
                    ctx.beginPath()
                    ctx.arc(item.x + item.width, item.y + item.height, 6, 0, 2 * Math.PI)
                    ctx.fill()
                    ctx.strokeStyle = "white"
                    ctx.lineWidth = 1
                    ctx.stroke()

                    // Botón para eliminar (esquina superior derecha)
                    ctx.fillStyle = "#ff4757"
                    ctx.beginPath()
                    ctx.arc(item.x + item.width - 8, item.y + 8, 7, 0, 2 * Math.PI)
                    ctx.fill()
                    ctx.fillStyle = "white"
                    ctx.font = "bold 10px Arial"
                    ctx.textAlign = "center"
                    ctx.textBaseline = "middle"
                    ctx.fillText("×", item.x + item.width - 8, item.y + 8)
                }
            }
        })
    }, [bgImgObject, furniture, selectedItem, rotations, estancia])

    // Rotar con tecla "R"
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (selectedItem !== null && e.key.toLowerCase() === "r") {
                setRotations((prev) => ({
                    ...prev,
                    [selectedItem]: (prev[selectedItem] || 0) + 15,
                }))
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [selectedItem])

    useEffect(() => {
        setLoading(true);


        // Obtener la estancia por nombre para obtener su ID
        fetch("http://127.0.0.1:8000/vulnet/api/v1/Estancia/")
            .then(response => response.json())
            .then(data => {
                const estanciaFiltrada = data.find(e => e.nombreEstancia.toLowerCase() === nombreEstancia.toLowerCase());

                if (estanciaFiltrada) {
                    // Filtrar dispositivos basados en los IDs de la estancia
                    const idsDispositivosEstancia = estanciaFiltrada.dispositivos; // Los IDs de los dispositivos en esta estancia

                    // Obtener todos los dispositivos y filtrar solo los que están en la estancia
                    fetch("http://127.0.0.1:8000/vulnet/api/v1/devices/")
                        .then(res => res.json())
                        .then(devicesData => {
                            // Filtrar dispositivos solo por los IDs que vienen de la estancia
                            const dispositivosFiltrados = devicesData.filter(device =>
                                idsDispositivosEstancia.includes(device.id)
                            );

                            setDispositivosEstancia(dispositivosFiltrados);
                            setLoading(false);
                        })
                        .catch(err => {
                            console.error("Error al cargar dispositivos:", err);
                            setError(err.message);
                            setLoading(false);
                        });
                } else {
                    setDispositivosEstancia([]); // Si no se encuentra la estancia, vaciamos la lista de dispositivos
                    setLoading(false);
                }
            })
            .catch(error => {
                console.error("Error al obtener las estancias:", error);
                setError(error.message);
                setLoading(false);
            });
    }, [nombreEstancia]);

    useEffect(() => {
        const fetchDispositivos = async () => {
            try {
                const respuesta = await axios.get("http://127.0.0.1:8000/vulnet/api/v1/devices/"); // Cambia por tu endpoint real

                setDispositivosDisponibles(respuesta.data);
            } catch (error) {
                console.error('Error al cargar dispositivos:', error);
            }
        };

        fetchDispositivos();
    }, []);

    // Manejo de mouse
    const handleMouseDown = (e) => {
        const rect = canvasRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        let clicked = false

        furniture.forEach((item, index) => {
            if (
                x >= item.x + item.width - 16 &&
                x <= item.x + item.width &&
                y >= item.y + item.height - 16 &&
                y <= item.y + item.height
            ) {
                setResizing(index)
                clicked = true
                return
            }
            if (x >= item.x && x <= item.x + item.width && y >= item.y && y <= item.y + item.height) {
                setSelectedItem(index)
                setDraggingItem(index)
                setOffset({ x: x - item.x, y: y - item.y })
                clicked = true
            }
        })

        if (!clicked) setSelectedItem(null)
        // Si hizo clic en la cruz del mueble seleccionado
        if (selectedItem !== null) {
            const item = furniture[selectedItem]
            const xClick = x
            const yClick = y

            const crossX = item.x + item.width - 8
            const crossY = item.y + 8

            const distance = Math.sqrt((xClick - crossX) ** 2 + (yClick - crossY) ** 2)

            if (distance <= 8) {
                const confirmar = window.confirm("¿Eliminar este mueble?")
                if (confirmar) {
                    // Eliminar en el backend
                    fetch(`http://localhost:8000/vulnet/api/v1/muebles/${item.id}/`, {
                        method: "DELETE",
                    })
                        .then((res) => {
                            if (res.ok) {
                                // Eliminar del estado local
                                setFurniture((prev) => prev.filter((_, i) => i !== selectedItem))
                                setSelectedItem(null)
                                window.location.reload()
                            } else {
                                alert("❌ Error al eliminar el mueble.")
                            }
                        })
                        .catch((err) => {
                            console.error("Error al eliminar:", err)
                            alert("❌ Error al eliminar el mueble.")
                        })
                }
                return // Salir del handleMouseDown para que no se active selección ni movimiento
            }
        }
    }

    const handleMouseMove = (e) => {
        const rect = canvasRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const updatedFurniture = [...furniture]

        if (resizing !== null) {
            const item = updatedFurniture[resizing]
            const newSize = Math.max(20, x - item.x)
            item.width = newSize
            item.height = newSize
            setFurniture(updatedFurniture)
            return
        }

        if (draggingItem !== null) {
            const item = updatedFurniture[draggingItem]
            item.x = x - offset.x
            item.y = y - offset.y
            setFurniture(updatedFurniture)
        }
    }

    const handleMouseUp = () => {
        setDraggingItem(null)
        setResizing(null)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        const rect = canvasRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const tipo = e.dataTransfer.getData("tipo")
        const imagen = e.dataTransfer.getData("imagen")

        if (tipo && imagen) {
            const nuevo = {
                tipo,
                imagen,
                x: x - 25,
                y: y - 25,
                width: 50,
                height: 50,
                rotation: 0,
            }
            setFurniture((prev) => [...prev, nuevo])
        }
    }

    const guardarCambios = () => {
        const promises = furniture.map((item, index) =>
            fetch(`http://localhost:8000/vulnet/api/v1/muebles/update-position/${item.id}/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    x: item.x,
                    y: item.y,
                    width: item.width,
                    height: item.height,
                    rotation: rotations[index] || 0,
                }),
            })
        )

        Promise.all(promises)
            .then(() => {
                const notification = document.createElement("div")
                notification.innerHTML = "✅ <strong>Posiciones guardadas</strong><br>Los muebles han sido actualizados.";
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background-color: #4CAF50;
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    z-index: 1000;
                    font-family: Arial, sans-serif;
                    animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
                `
                document.body.appendChild(notification)
                setTimeout(() => {
                    notification.remove()
                }, 3000)
            })
            .catch((err) => {
                console.error("❌ Error al guardar:", err)
                alert("❌ Error al guardar los cambios. Inténtalo de nuevo.")
            })
    }

    if (loading && !estanciaId) {
        return (
            <div style={{
                ...styles.loadingContainer,
                backgroundColor: isDark ? "#1a1a2e" : "#f4f4f4",
            }}>
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>Cargando estancia...</p>
            </div>
        )
    }

    const updateEstancia = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/vulnet/api/v1/Estancia/${estancia.id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombreEstancia: estancia.nombreEstancia,
                    dispositivos: estancia.dispositivos,
                    tipo_suelo: estancia.tipo_suelo,
                }),
            });
            if (response.ok) {
                const notification = document.createElement("div");
                notification.innerHTML = "✅ <strong>Estancia actualizada con éxito</strong><br>Los cambios han sido guardados.";
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background-color: #4CAF50;
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    z-index: 1000;
                    font-family: Arial, sans-serif;
                    animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
                `;
                document.body.appendChild(notification);
                setTimeout(() => {
                    notification.remove();
                }, 3000);
            } else {
                alert("Hubo un error al guardar los cambios.");
            }
        } catch (error) {
            alert("Error de conexión con el servidor.");
            console.error(error);
        }
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

    const handleDeleteDevice = (deviceIdToRemove) => {
        const updatedIds = estancia.dispositivos.filter(id => id !== deviceIdToRemove);
        const updatedDevices = dispositivosEstancia.filter(device => device.id !== deviceIdToRemove);

        setEstancia({ ...estancia, dispositivos: updatedIds });
        setDispositivosEstancia(updatedDevices); // <-- aquí actualizas lo que estás mostrando
    };


    return (
        <>
            <Header title={nombreEstancia} />
            <div style={{
                ...styles.container,
                backgroundColor: isDark ? COLORS.darkBg : COLORS.lightBg,
                color: isDark ? COLORS.darkText : COLORS.lightText,
            }}>
                <div style={styles.header}>

                </div>

                <div style={styles.content}>
                    <div style={styles.sideColumn}>
                        <div style={{
                            ...styles.furniturePanel,
                            backgroundColor: isDark ? COLORS.darkCard : COLORS.lightCard,
                        }}>
                            <div style={{
                                ...styles.panelHeader,
                                backgroundColor: isDark ? COLORS.darkCard : COLORS.lightCard,
                            }}>
                                <h3
                                    style={{
                                        ...styles.panelTitle,
                                        color: isDark ? COLORS.darkText : COLORS.lightText,
                                    }}
                                >
                                    Muebles
                                </h3>
                                <button onClick={() => setShowForm(true)} style={styles.addButton} title="Añadir nuevo mueble">
                                    +
                                </button>
                            </div>

                            <div style={styles.furnitureGrid}>
                                {muebles.map((mueble, index) => (
                                    <div key={index} style={styles.furnitureItemContainer}>
                                        <img
                                            src={`http://localhost:8000/${mueble.imagen}`}
                                            alt={mueble.tipo}
                                            style={styles.furnitureItem}
                                            draggable
                                            onDragStart={(e) => {
                                                e.dataTransfer.setData("tipo", mueble.tipo)
                                                e.dataTransfer.setData("imagen", mueble.imagen)
                                            }}
                                        />
                                        <span
                                            style={{
                                                ...styles.furnitureLabel,
                                                color: isDark ? COLORS.darkText : COLORS.lightText,
                                            }}
                                        >
                                            {mueble.tipo}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div style={styles.panelSection}>
                                <h4
                                    style={{
                                        ...styles.sectionTitle,
                                        color: isDark ? COLORS.darkText : COLORS.lightText,
                                    }}
                                >
                                    Textura del suelo
                                </h4>
                                <select
                                    value={estancia?.tipo_suelo || "light_wood"}
                                    onChange={(e) => {
                                        const tipoSuelo = e.target.value;
                                        const map = {
                                            light_wood: "http://localhost:8000/media/textures/wood.jpg",
                                            tile: "http://localhost:8000/media/textures/baldosas.jpeg",
                                            dark_wood: "http://localhost:8000/media/textures/dark_wood.png",
                                        };

                                        setEstancia(prev => ({
                                            ...prev,
                                            tipo_suelo: tipoSuelo,
                                        }));
                                        setBackgroundImage(map[tipoSuelo]);
                                    }}
                                    style={{
                                        ...styles.select,
                                        backgroundColor: isDark ? COLORS.darkCard : COLORS.lightCard,
                                        color: isDark ? COLORS.darkText : COLORS.lightText,
                                    }}
                                >
                                    <option value="light_wood">Madera marrón claro</option>
                                    <option value="tile">Baldosas</option>
                                    <option value="dark_wood">Madera marrón oscuro</option>
                                </select>
                            </div>

                            <div style={styles.helpSection}>
                                <h4
                                    style={{
                                        ...styles.sectionTitle,
                                        color: isDark ? COLORS.darkText : COLORS.lightText,
                                    }}
                                >
                                    Ayuda
                                </h4>
                                <ul
                                    style={{
                                        ...styles.helpList,
                                        color: isDark ? COLORS.darkText : COLORS.lightText,
                                    }}
                                >
                                    <li>Usa la tecla "R" para rotar</li>
                                    <li>Arrastra el punto azul para redimensionar</li>
                                </ul>
                                <button
                                    onClick={() => {
                                        guardarCambios();
                                        updateEstancia();
                                    }}
                                    style={saving ? { ...styles.saveButton, ...styles.savingButton } : styles.saveButton}
                                    disabled={saving}
                                >
                                    {saving ? "Guardando..." : "Guardar cambios"}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "20px" }}>
                        <div style={styles.canvasContainer}>
                            <canvas
                                ref={canvasRef}
                                width={1000}
                                height={700}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                style={{
                                    ...styles.canvas,
                                    backgroundColor: isDark ? COLORS.darkCard : "#e0e0e0",
                                }}
                            />
                            {selectedItem !== null && (
                                <div style={styles.itemControls}>
                                    <button
                                        onClick={() => {
                                            setRotations((prev) => ({
                                                ...prev,
                                                [selectedItem]: (prev[selectedItem] || 0) + 15,
                                            }))
                                        }}
                                        style={styles.controlButton}
                                        title="Rotar (o presiona R)"
                                    >
                                        🔄
                                    </button>
                                </div>
                            )}
                        </div>
                        <div
                            style={{
                                ...styles.card,
                                backgroundColor: isDark ? COLORS.darkCard : COLORS.lightCard,
                                marginLeft: "-10px",
                            }}
                        >
                            <h2
                                style={{
                                    ...styles.nombre,
                                    color: isDark ? COLORS.darkText : COLORS.lightText,
                                }}
                            >
                                Dispositivos
                            </h2>

                            <ul
                                style={{
                                    ...styles.list,
                                    color: isDark ? COLORS.darkText : COLORS.lightText,
                                }}
                            >
                                {dispositivosEstancia.length > 0 ? (
                                    dispositivosEstancia.map((device) => (
                                        <li
                                            key={device.id}
                                            style={{
                                                ...styles.listItem,
                                                backgroundColor: isDark ? COLORS.darkCard : COLORS.lightCard,
                                                color: isDark ? COLORS.darkText : COLORS.lightText,
                                            }}
                                        >
                                            {device.model}
                                            <button
                                                style={styles.deleteButton}
                                                onClick={() => handleDeleteDevice(device.id)}
                                            >
                                                ❌
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <p style={{ color: isDark ? COLORS.darkText : COLORS.lightText, fontStyle: "italic" }}>
                                        No hay dispositivos en esta estancia.
                                    </p>
                                )}
                            </ul>

                            {/* 🔹 Select para añadir dispositivos */}
                            <div style={styles.addDeviceContainer}>
                                <select
                                    style={{
                                        ...styles.input,
                                        backgroundColor: isDark ? COLORS.darkCard : COLORS.lightCard,
                                        color: isDark ? COLORS.darkText : COLORS.lightText,
                                    }}
                                    onChange={handleAddDevice}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Selecciona un dispositivo</option>
                                    {dispositivosDisponibles.map((device) => (
                                        <option key={device.id} value={device.id}>{device.model}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {showForm && (
                        <div style={styles.modalOverlay}>
                            <div style={{
                                ...styles.modalContent,
                                backgroundColor: isDark ? "#16213e" : "#ffffff",
                            }}>
                                <button style={styles.closeButton} onClick={() => setShowForm(false)}>
                                    ×
                                </button>
                                <FurnitureForm estanciaId={estanciaId} onClose={() => setShowForm(false)} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // backgroundColor and color will be set dynamically
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
        // color will be set dynamically
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        maxWidth: "1200px",
        marginBottom: "20px",
        padding: "0 10px",
    },
    title: {
        fontSize: "32px",
        fontWeight: "600",
        margin: "0",
        background: "linear-gradient(45deg, #6a93cb, #a4bfef)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textShadow: "0px 2px 4px rgba(0,0,0,0.3)",
    },
    headerControls: {
        display: "flex",
        gap: "15px",
    },
    content: {
        display: "flex",
        gap: "25px",
        justifyContent: "flex-start",   // alinea todo al inicio
        alignItems: "flex-start",
        width: "100%",
        maxWidth: "100%",
    },
    furniturePanel: {
        // backgroundColor will be set dynamically
        borderRadius: "12px",
        width: "280px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
        border: "1px solid #2a3a5a",
        overflow: "hidden",
    },
    panelHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 20px",
        // backgroundColor will be set dynamically
    },
    panelTitle: {
        fontSize: "18px",
        fontWeight: "600",
        margin: "0",
        color: "#e2e8f0",
    },
    addButton: {
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "50%",
        width: "30px",
        height: "30px",
        fontSize: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        transition: "all 0.2s ease",
    },
    furnitureGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "15px",
        padding: "20px",
        maxHeight: "300px",
        overflowY: "auto",
    },
    furnitureItemContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "5px",
    },
    furnitureItem: {
        width: "80px",
        height: "80px",
        objectFit: "contain",
        cursor: "grab",
        borderRadius: "8px",
        backgroundColor: "#2a3a5a",
        padding: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        border: "1px solid #3a4a6a",
        ":hover": {
            transform: "scale(1.05)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        },
    },
    furnitureLabel: {
        fontSize: "12px",
        color: "#a0aec0", // will be overridden dynamically
        textAlign: "center",
        maxWidth: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    panelSection: {
        padding: "0px 20px 5px", // elimina espacio superior
    },
    sectionTitle: {
        fontSize: "16px",
        fontWeight: "500",
        marginTop: "0",
        marginBottom: "10px",
        color: "#e2e8f0",
    },
    select: {
        width: "100%",
        padding: "10px",
        borderRadius: "6px",
        backgroundColor: "#2a3a5a",
        color: "white",
        border: "1px solid #3a4a6a",
        outline: "none",
        cursor: "pointer",
    },
    helpSection: {
        padding: "15px 20px",
    },
    helpList: {
        margin: "0",
        paddingLeft: "20px",
        color: "#a0aec0",
        fontSize: "14px",
    },
    sideColumn: {
        display: "flex",
        flexDirection: "column",
        gap: "25px",
    },
    canvasContainer: {
        position: "relative",
        flexGrow: 2,
    },
    canvas: {
        border: "none",
        borderRadius: "12px",
        // backgroundColor will be set dynamically
        boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        width: "100%",
        maxWidth: "1000px",
        height: "700px",
    },
    itemControls: {
        position: "absolute",
        bottom: "15px",
        left: "15px",
        display: "flex",
        gap: "10px",
    },
    controlButton: {
        backgroundColor: "#0f3460",
        color: "white",
        border: "none",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        fontSize: "18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        transition: "all 0.2s ease",
    },
    saveButton: {
        padding: "10px 20px",
        fontSize: "16px",
        fontWeight: "500",
        backgroundColor: "#4CAF50",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        transition: "all 0.2s ease",
        marginTop: "15px",
    },
    savingButton: {
        backgroundColor: "#388E3C",
        opacity: 0.8,
        cursor: "not-allowed",
    },
    modalOverlay: {
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "1000",
    },
    modalContent: {
        position: "relative",
        // backgroundColor will be set dynamically
        borderRadius: "12px",
        padding: "25px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        maxWidth: "90%",
        maxHeight: "90%",
        overflow: "auto",
    },
    closeButton: {
        position: "absolute",
        top: "10px",
        right: "10px",
        backgroundColor: "transparent",
        color: "#a0aec0",
        border: "none",
        fontSize: "24px",
        cursor: "pointer",
        width: "30px",
        height: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        transition: "all 0.2s ease",
    },
    loadingContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        // backgroundColor will be set dynamically
    },
    spinner: {
        width: "50px",
        height: "50px",
        border: "5px solid rgba(255,255,255,0.1)",
        borderTopColor: "#4CAF50",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    },
    loadingText: {
        marginTop: "20px",
        color: "#e2e8f0",
        fontSize: "18px",
    },

    card: {
        backgroundColor: "#2a3a5a",
        borderRadius: "12px",
        padding: "20px",
        width: "280px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
        border: "1px solid #2a3a5a",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },

    // Título "Dispositivos"
    nombre: {
        fontSize: "18px",
        fontWeight: "600",
        margin: "0 0 10px 0",
        color: "#e2e8f0",
    },

    // Lista de dispositivos
    list: {
        listStyle: "none",
        padding: "0",
        margin: "0",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        color: "#a0aec0",
        fontSize: "14px",
    },

    // Cada ítem de la lista
    listItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#2a3a5a",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #3a4a6a",
    },

    // Botón de eliminar dispositivo
    deleteButton: {
        backgroundColor: "transparent",
        border: "none",
        color: "#ff6b6b",
        fontSize: "16px",
        cursor: "pointer",
        marginLeft: "10px",
    },

    // Contenedor del select para añadir dispositivos
    addDeviceContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },

    // Estilo del select (input de selección)
    input: {
        width: "100%",
        padding: "10px",
        borderRadius: "6px",
        backgroundColor: "#2a3a5a",
        color: "white",
        border: "1px solid #3a4a6a",
        outline: "none",
        cursor: "pointer",
    },
    "@keyframes spin": {
        "0%": { transform: "rotate(0deg)" },
        "100%": { transform: "rotate(360deg)" },
    },
    "@keyframes fadeIn": {
        "0%": { opacity: 0, transform: "translateY(-20px)" },
        "100%": { opacity: 1, transform: "translateY(0)" },
    },
    "@keyframes fadeOut": {
        "0%": { opacity: 1, transform: "translateY(0)" },
        "100%": { opacity: 0, transform: "translateY(-20px)" },
    },
}

export default CanvasRoom