import { useEffect, useState } from "react";
import { getAllConnections } from "../api/connections.api";
import { ConnectionCard } from "./ConnectionCard";
import { Link } from "react-router-dom";
import { useColorMode, IconButton, Flex } from "@chakra-ui/react";
import { FaSun, FaMoon, FaPlus, FaProjectDiagram } from "react-icons/fa";
import { ConnectionsGraph } from "../pages/ConnectionsGraph";

export function ConnectionsList() {
  const [connections, setConnections] = useState([]);
  const [paginaActualConexiones, setPaginaActualConexiones] = useState(1);
  const [totalPaginasConexiones, setTotalPaginasConexiones] = useState(1);
  const [vista, setVista] = useState("grid");

  const { colorMode, toggleColorMode } = useColorMode();
  const modoOscuro = colorMode === "dark";

  useEffect(() => {
    async function loadConnections() {
      const res = await getAllConnections();
      setConnections(res.data);
    }
    loadConnections();
  }, []);

  const estilos = {
    contenedor: {
      padding: "24px",
      backgroundColor: modoOscuro ? "#0D1117" : "#F7FAFC",
      color: modoOscuro ? "#E2E8F0" : "#1A202C",
      minHeight: "100vh",
      maxHeight: "100vh",
      overflowY: "auto",
      // Estilo personalizado para la barra de scroll tipo macOS
      "::-webkit-scrollbar": {
        width: "8px",
      },
      "::-webkit-scrollbar-track": {
        background: "transparent",
      },
      "::-webkit-scrollbar-thumb": {
        backgroundColor: modoOscuro ? "#4B5563" : "#CBD5E0",
        borderRadius: "8px",
        border: "2px solid transparent",
        backgroundClip: "content-box",
      },
      "::-webkit-scrollbar-thumb:hover": {
        backgroundColor: modoOscuro ? "#6B7280" : "#A0AEC0",
      },
    },
    botonCrear: {
      backgroundColor: modoOscuro ? "#1F2937" : "#1A365D",
      padding: "10px 20px",
      borderRadius: "8px",
      color: "#FFFFFF",
      fontWeight: "600",
      marginBottom: "12px",
      border: "1px solid transparent",
      boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
      transition: "all 0.3s ease",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      ":hover": {
        backgroundColor: modoOscuro ? "#2D3748" : "#274C77",
        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.25)",
      },
    },
    linkCrear: {
      textDecoration: "none",
      color: "inherit",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    titulo: {
      fontSize: "2rem",
      fontWeight: "600",
      textAlign: "center",
      color: modoOscuro ? "#E2E8F0" : "#1A202C",
      marginBottom: "24px",
      letterSpacing: "0.5px",
    },
    paginacionContenedor: {
      color: modoOscuro ? "#e2e8f0" : "#1a202c",
      fontSize: "16px",
      marginTop: "32px",
      display: "flex",
      justifyContent: "center",
      gap: "16px",
    },
    botonPaginacion: (deshabilitado) => ({
      padding: "10px 16px",
      backgroundColor: modoOscuro ? "#2D3748" : "#1A365D",
      color: "white",
      borderRadius: "6px",
      border: "1px solid transparent",
      fontWeight: "600",
      opacity: deshabilitado ? 0.5 : 1,
      cursor: deshabilitado ? "default" : "pointer",
      transition: "all 0.2s ease-in-out",
      ...(deshabilitado
        ? {}
        : {
          ":hover": {
            backgroundColor: modoOscuro ? "#3B4455" : "#274C77",
          },
        }),
    }),
  };

  return (
    <div style={estilos.contenedor}>
      <Flex justifyContent="flex-end" marginBottom="16px">
      </Flex>
      <h1 style={estilos.titulo}>CONEXIONES</h1>
      <div style={{ marginBottom: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <Link to="/connection-create" style={{ textDecoration: "none" }}>
          <button
            style={{
              ...estilos.botonCrear,
              transition: "all 0.3s ease",
              backgroundColor: modoOscuro ? "#1F2937" : "#1A365D",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = modoOscuro ? "#2D3748" : "#274C77")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = modoOscuro ? "#1F2937" : "#1A365D")}
          >
            <FaPlus style={{ marginRight: 8 }} />
            Añadir conexión
          </button>
        </Link>

      </div>

      <div style={{ marginBottom: "16px", display: "flex", gap: "12px" }}>
        <button onClick={() => setVista("grid")} style={{ ...estilos.botonCrear, backgroundColor: vista === "grid" ? "#1A365D" : estilos.botonCrear.backgroundColor }}>
          Vista en columnas
        </button>
        <button onClick={() => setVista("list")} style={{ ...estilos.botonCrear, backgroundColor: vista === "list" ? "#1A365D" : estilos.botonCrear.backgroundColor }}>
          Vista en lista
        </button>
      </div>

      <div className={vista === "grid" ? "grid grid-cols-3 gap-3" : "flex flex-col gap-4"}>
        {connections.map((connection) => (
          <ConnectionCard
            key={connection.id}
            connection={connection}
            className="bg-indigo-800 hover:bg-indigo-700 hover:cursor-pointer p-3 rounded-lg" // He añadido algunas clases de la DeviceCard como ejemplo
          />
        ))}
      </div>

      {/* Aquí podrías añadir la paginación si la necesitas para las conexiones */}
      {<div style={estilos.paginacionContenedor}>
        <button
          onClick={() => setPaginaActualConexiones((prev) => Math.max(prev - 1, 1))}
          disabled={paginaActualConexiones === 1}
          style={estilos.botonPaginacion(paginaActualConexiones === 1)}
        >
          Anterior
        </button>

        <span className="self-center">
          Página {paginaActualConexiones} de {totalPaginasConexiones}
        </span>

        <button
          onClick={() => setPaginaActualConexiones((prev) => Math.min(prev + 1, totalPaginasConexiones))}
          disabled={paginaActualConexiones === totalPaginasConexiones}
          style={estilos.botonPaginacion(paginaActualConexiones === totalPaginasConexiones)}
        >
          Siguiente
        </button>
      </div>}

      <div
        style={{
          marginTop: "48px",
          padding: "32px",
          borderRadius: "12px",
          backgroundColor: modoOscuro ? "#161B22" : "#F7FAFC",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          border: modoOscuro ? "1px solid #30363D" : "1px solid #E2E8F0",
        }}
      >
        <h2
          style={{
            fontSize: "1.75rem",
            fontWeight: "700",
            color: modoOscuro ? "#8CD3E0" : "#1A365D",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          Mapa de Conexiones
        </h2>
        <ConnectionsGraph />
      </div>
    </div>
  );

}