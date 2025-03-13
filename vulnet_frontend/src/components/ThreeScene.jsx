import React, { useRef, useEffect, useState } from "react";

const CanvasRoom = () => {
    const canvasRef = useRef(null);
    const [furniture, setFurniture] = useState([]);
    const [draggingItem, setDraggingItem] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [resizing, setResizing] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 }); // Almacena la diferencia al hacer clic
    const [rotations, setRotations] = useState({}); // Almacena la rotación de cada mueble

    const furnitureImages = {
        mesa: "./muebles/mesa.png",
        silla: "./muebles/silla.png"
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const backgroundImg = new Image();
        backgroundImg.src = "./textures/wood.jpg"; // Ruta de la imagen del suelo de madera
    
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas antes de redibujar
            ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    
            furniture.forEach((item, index) => {
                const img = new Image();
                img.src = furnitureImages[item.type];
    
                img.onload = () => {
                    ctx.save(); // Guardar el estado actual del contexto
    
                    // Si no hay rotación definida, usar 0 por defecto
                    const rotationAngle = rotations[index] || 0;
    
                    // Mover el contexto al centro del mueble
                    ctx.translate(item.x + item.width / 2, item.y + item.height / 2);
                    ctx.rotate(rotationAngle * Math.PI / 180); // Aplicar la rotación en grados
    
                    // Dibujar la imagen rotada centrada correctamente
                    ctx.drawImage(img, -item.width / 2, -item.height / 2, item.width, item.height);
                    
                    // Restaurar el contexto para evitar que las transformaciones afecten otros objetos
                    ctx.restore();
    
                    // Si el mueble está seleccionado, dibujar el borde y el punto de redimensionado
                    if (selectedItem === index) {
                        ctx.strokeStyle = "gray";
                        ctx.lineWidth = 2;
                        ctx.strokeRect(item.x, item.y, item.width, item.height);
                        
                        // Dibujar el punto de redimensionado en la esquina inferior derecha
                        ctx.fillStyle = "white";
                        ctx.fillRect(item.x + item.width - 5, item.y + item.height - 5, 10, 10);
                    }
                };
            });
        };
    
        backgroundImg.onload = draw;
        draw();
    }, [furniture, selectedItem, rotations]); // Ahora también escucha cambios en `rotations`
    
    

    const handleDrop = (e) => {
        e.preventDefault();
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - canvasRect.left;
        const y = e.clientY - canvasRect.top;
        
        if (draggingItem) {
            setFurniture([...furniture, { type: draggingItem, x, y, width: 60, height: 60 }]);
            setDraggingItem(null);
        }
    };
    const handleKeyDown = (e) => {
        if (selectedItem !== null && e.key === "r") {
            setRotations((prevRotations) => ({
                ...prevRotations,
                [selectedItem]: (prevRotations[selectedItem] || 0) + 15 // Incrementa 15 grados
            }));
        }
    };
    
    // Escuchar eventos de teclado
    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedItem]);

    const handleMouseDown = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let clicked = false;
        furniture.forEach((item, index) => {
            // Verificar si el usuario está haciendo clic en el punto de redimensionado
            if (x >= item.x + item.width - 5 && x <= item.x + item.width + 5 &&
                y >= item.y + item.height - 5 && y <= item.y + item.height + 5) {
                setResizing(index);
                clicked = true;
                return;
            }

            // Verificar si el usuario está seleccionando el mueble para moverlo
            if (x >= item.x && x <= item.x + item.width &&
                y >= item.y && y <= item.y + item.height) {
                setSelectedItem(index);
                setDraggingItem(index);
                setOffset({ x: x - item.x, y: y - item.y }); // Almacenar la diferencia al hacer clic
                clicked = true;
                return;
            }
        });

        if (!clicked) {
            setSelectedItem(null); // Deseleccionar si se hace clic fuera de un mueble
        }
    };

    const handleMouseMove = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (resizing !== null) {
            const updatedFurniture = [...furniture];
            const item = updatedFurniture[resizing];
            
            // Mantiene la proporción
            const newSize = Math.max(20, x - item.x);
            item.width = newSize;
            item.height = newSize;
            
            setFurniture(updatedFurniture);
        } else if (draggingItem !== null) {
            const updatedFurniture = [...furniture];
            const item = updatedFurniture[draggingItem];
            
            item.x = x - offset.x;
            item.y = y - offset.y;
            
            setFurniture(updatedFurniture);
        }
    };
    const handleDragOver = (e) => {
        e.preventDefault(); // Permite el evento de soltar (drop) en el canvas
    };
    

    const handleMouseUp = () => {
        setResizing(null);
        setDraggingItem(null);
    };

    return (
        <div style={styles.container}>
            <div style={styles.menu}>
                <h3 style={styles.menuTitle}>Muebles</h3>
                <img src={furnitureImages.mesa} alt="Mesa" draggable onDragStart={() => setDraggingItem("mesa")} style={styles.menuItem} />
                <img src={furnitureImages.silla} alt="Silla" draggable onDragStart={() => setDraggingItem("silla")} style={styles.menuItem} />
            </div>
            <div style={styles.canvasContainer}>
                <canvas
                    style={styles.canvas}
                    ref={canvasRef}
                    width={500}
                    height={400}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                />
            </div>
        </div>
    );
};


const styles = {
    container: {
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#202020",
    },
    menu: {
        width: "150px",
        padding: "20px",
        background: "#ffffff",
        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginRight: "20px",
        borderRadius: "10px",
    },
    menuTitle: {
        marginBottom: "10px",
        fontSize: "18px",
        color: "#333",
    },
    menuItem: {
        width: "80px",
        cursor: "grab",
        marginBottom: "10px",
        transition: "transform 0.2s ease",
    },
    canvasContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ddd",
        padding: "10px",
        borderRadius: "10px",
    },
    canvas: {
        border: "2px solid black",
        backgroundColor: "white",
    },
};

export default CanvasRoom;
