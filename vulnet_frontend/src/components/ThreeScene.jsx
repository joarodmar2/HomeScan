import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CanvasRoom = () => {
    const canvasRef = useRef(null);
    const { nombreEstancia } = useParams();

    const [furniture, setFurniture] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [rotations, setRotations] = useState({});
    const [estanciaId, setEstanciaId] = useState(null);
    const [muebles, setMuebles] = useState([]);
    const [estancia, setEstancia] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [draggingItem, setDraggingItem] = useState(null);
    const [resizing, setResizing] = useState(null);
    const furnitureImages = {
        mesa: "/muebles/mesa.png",
        silla: "/muebles/silla.png"
    };

    useEffect(() => {
        fetch(`http://localhost:8000/vulnet/api/v1/Estancia/nombre/${encodeURIComponent(nombreEstancia)}/`)
            .then(response => response.json())
            .then(data => setEstanciaId(data.id))
            .catch(error => console.error("Error al obtener la estancia:", error));
    }, [nombreEstancia]);

    useEffect(() => {
        if (estanciaId) {
            fetch(`http://localhost:8000/vulnet/api/v1/muebles/estancia/${estanciaId}/`)
                .then(response => response.json())
                .then(data => {
                    setMuebles(data);
                    setFurniture(data.map(m => ({ ...m })));
                    setRotations(data.reduce((acc, m, i) => ({ ...acc, [i]: m.rotation }), {}));
                })
                .catch(error => console.error("Error al obtener los muebles:", error));
        }
    }, [estanciaId]);

    useEffect(() => {
        fetch(`http://localhost:8000/vulnet/api/v1/Estancia/nombre/${encodeURIComponent(nombreEstancia)}/`)
            .then(res => res.json())
            .then(data => setEstancia(data))
            .catch(err => console.error("Error al cargar la estancia:", err));
    }, [nombreEstancia]);

    useEffect(() => {
        drawCanvas();
    }, [furniture, selectedItem, rotations, estancia]);

    //UseEffect para manejar el evento de teclado y poder rotar el mueble seleccionado
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (selectedItem !== null && e.key.toLowerCase() === "r") {
                setRotations((prev) => ({
                    ...prev,
                    [selectedItem]: (prev[selectedItem] || 0) + 15
                }));
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedItem]);

    const drawCanvas = () => {
        if (!canvasRef.current || !estancia) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const backgroundImg = new Image();
        backgroundImg.src = `http://localhost:8000/media/textures/wood.jpg?t=${new Date().getTime()}`;

        backgroundImg.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

            furniture.forEach((item, index) => {
                const img = new Image();
                img.src = `http://localhost:8000/${item.imagen}`;

                img.onload = () => {
                    ctx.save();
                    const rotationAngle = rotations[index] || 0;
                    ctx.translate(item.x + item.width / 2, item.y + item.height / 2);
                    ctx.rotate(rotationAngle * Math.PI / 180);
                    ctx.drawImage(img, -item.width / 2, -item.height / 2, item.width, item.height);
                    // Dibuja el cuadrado blanco para redimensionar si está seleccionado
                    

                    ctx.restore();

                    if (selectedItem === index) {
                        ctx.strokeStyle = "gray";
                        ctx.lineWidth = 2;
                        ctx.strokeRect(item.x, item.y, item.width, item.height);
                        ctx.fillStyle = "white";
                        ctx.fillRect(item.x + item.width - 5, item.y + item.height - 5, 10, 10);
                    }
                };
            });
        };
    };

    const handleMouseDown = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let clicked = false;
        furniture.forEach((item, index) => {
            // Verificar si clic en la esquina inferior derecha (área para redimensionar)
            if (
                x >= item.x + item.width - 16 &&
                x <= item.x + item.width &&
                y >= item.y + item.height - 16 &&
                y <= item.y + item.height
            ) {
                setResizing(index);
                clicked = true;
                return;
            }

            // Verificar si clic dentro del mueble para mover
            if (x >= item.x && x <= item.x + item.width && y >= item.y && y <= item.y + item.height) {
                setSelectedItem(index);
                setDraggingItem(index);
                setOffset({ x: x - item.x, y: y - item.y });
                clicked = true;
            }
        });

        if (!clicked) setSelectedItem(null);
    };


    const handleMouseMove = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const updatedFurniture = [...furniture];

        if (resizing !== null) {
            const item = updatedFurniture[resizing];
            const newSize = Math.max(20, x - item.x); // Puedes usar el eje Y también para proporcionalidad
            item.width = newSize;
            item.height = newSize;
            setFurniture(updatedFurniture);
            return;
        }

        if (draggingItem !== null) {
            const item = updatedFurniture[draggingItem];
            item.x = x - offset.x;
            item.y = y - offset.y;
            setFurniture(updatedFurniture);
        }
    };


    const handleMouseUp = () => {
        setDraggingItem(null);
        setResizing(null);
    };


    const handleDrop = (e) => {
        e.preventDefault();
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - canvasRect.left;
        const y = e.clientY - canvasRect.top;

        const tipo = e.dataTransfer.getData("tipo");
        const imagen = e.dataTransfer.getData("imagen");

        if (tipo && imagen) {
            const nuevo = {
                tipo,
                imagen,
                x: x - 25,
                y: y - 25,
                width: 50,
                height: 50,
                rotation: 0
            };
            setFurniture(prev => [...prev, nuevo]);
        }
    };

    const guardarCambios = () => {
        furniture.forEach((item, index) => {
            fetch(`http://localhost:8000/vulnet/api/v1/muebles/update-position/${item.id}/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    x: item.x,
                    y: item.y,
                    width: item.width,
                    height: item.height,
                    rotation: rotations[index] || 0,
                })
            })
                .then(res => res.json())
                .then(data => console.log("✅ Guardado:", data))
                .catch(err => console.error("❌ Error al guardar:", err));
        });
    };

    if (!estanciaId) return <p style={{ color: "white" }}>Cargando estancia...</p>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Estancia: {nombreEstancia}</h1>

            <div style={styles.content}>
                <div style={styles.furniturePanel}>
                    <h3 style={styles.panelTitle}>Muebles disponibles</h3>
                    {muebles.map((mueble, index) => (
                        <img
                            key={index}
                            src={`http://localhost:8000/${mueble.imagen}`}
                            alt={mueble.tipo}
                            style={styles.furnitureItem}
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData("tipo", mueble.tipo);
                                e.dataTransfer.setData("imagen", `http://localhost:8000/${mueble.imagen}`);
                            }}
                        />
                    ))}
                </div>

                <canvas
                    ref={canvasRef}
                    width={500}
                    height={400}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    style={styles.canvas}
                />
            </div>

            <button onClick={guardarCambios} style={styles.button}>
                Guardar Cambios
            </button>
        </div>

    );
};
const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#1e1e1e",
        minHeight: "100vh",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
    },
    title: {
        color: "#ffffff",
        fontSize: "34px",
        fontWeight: "bold",
        marginBottom: "10px",
        textShadow: "1px 1px 4px rgba(0,0,0,0.4)",
    },
    content: {
        display: "flex",
        gap: "30px",
        justifyContent: "center",
        alignItems: "flex-start",
        marginTop: "20px",
    },
    furniturePanel: {
        backgroundColor: "#2a2a2a",
        padding: "20px",
        borderRadius: "12px",
        minWidth: "200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0 0 12px rgba(0, 0, 0, 0.4)",
        border: "1px solid #444",
    },
    panelTitle: {
        color: "#ffffff",
        fontSize: "20px",
        marginBottom: "15px",
        borderBottom: "1px solid #555",
        paddingBottom: "5px",
        width: "100%",
        textAlign: "center",
    },
    furnitureItem: {
        width: "80px",
        height: "80px",
        objectFit: "contain",
        marginBottom: "12px",
        cursor: "grab",
        borderRadius: "8px",
        backgroundColor: "#3a3a3a",
        padding: "8px",
        boxShadow: "0 0 6px rgba(255,255,255,0.1)",
        transition: "transform 0.2s ease",
    },
    canvas: {
        border: "3px solid #666",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 6px 12px rgba(0,0,0,0.5)",
    },
    button: {
        marginTop: "30px",
        padding: "12px 28px",
        fontSize: "16px",
        fontWeight: "bold",
        backgroundColor: "#4CAF50",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        transition: "background-color 0.3s ease",
    },
};



export default CanvasRoom;
