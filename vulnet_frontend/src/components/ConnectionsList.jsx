import { useEffect, useState } from "react";
import { getAllConnections } from "../api/connections.api";
import { ConnectionCard } from "./ConnectionCard";
import { Link } from "react-router-dom";


export function ConnectionsList() {
  const [connections, setConnections] = useState([]);
  const [paginaActualConexiones, setPaginaActualConexiones] = useState(1);
  const [totalPaginasConexiones, setTotalPaginasConexiones] = useState(1);

  useEffect(() => {
    async function loadConnections() {
      const res = await getAllConnections();
      setConnections(res.data);
    }
    loadConnections();
  }, []);

  const estilos = {
    contenedor: {
      padding: "20px",
    },
    botonCrear: {
      backgroundColor: "#2a3a5a",
      padding: "10px 20px",
      borderRadius: "8px",
      color: "white",
      fontWeight: "bold",
      marginBottom: "20px",
      border: "1px solid #3a4a6a",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      whiteSpace: "nowrap", // Añadido para evitar el salto de línea del texto
    },
    linkCrear: {
      textDecoration: "none",
      color: "inherit",
    },
    paginacionContenedor: {
      color: "#e2e8f0",
      fontSize: "16px",
      marginTop: "32px",
      display: "flex",
      justifyContent: "center",
      gap: "16px",
    },
    botonPaginacion: (deshabilitado) => ({
      padding: "10px 16px",
      backgroundColor: "#2a3a5a",
      color: "white",
      borderRadius: "6px",
      border: "1px solid #3a4a6a",
      opacity: deshabilitado ? 0.5 : 1,
      cursor: deshabilitado ? "default" : "pointer",
    }),
  };

  return (
    <div style={estilos.contenedor}>
      <div className="mb-4">
        <button style={estilos.botonCrear}>
          <Link to="/connection-create" style={estilos.linkCrear}>
            Create Connection
          </Link>
        </button>
        <button style={estilos.botonCrear}>
          <Link to="/graph" style={estilos.linkCrear}>
            Grafo de conexiones
          </Link>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
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
    </div>
  );

}