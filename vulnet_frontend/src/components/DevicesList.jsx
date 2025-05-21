import { useEffect, useState } from "react";
import { getAllDevices } from "../api/devices.api";
import { DeviceCard } from "./DeviceCard";
import { Link } from "react-router-dom";

export function DevicesList() {
  const [devices, setDevices] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const dispositivosPorPagina = 24;

  useEffect(() => {
    async function loadDevices() {
      const res = await getAllDevices();
      setDevices(res.data);
    }
    loadDevices();
  }, []);

  // Calcular los dispositivos a mostrar en la página actual
  const indiceInicio = (paginaActual - 1) * dispositivosPorPagina;
  const indiceFin = indiceInicio + dispositivosPorPagina;
  const dispositivosPagina = devices.slice(indiceInicio, indiceFin);

  const totalPaginas = Math.ceil(devices.length / dispositivosPorPagina);

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
      <button style={estilos.botonCrear}>
        <Link to="/device-create" style={estilos.linkCrear}>
          Create Device
        </Link>
      </button>

      <div className="grid grid-cols-3 gap-3">
        {dispositivosPagina.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            className="bg-indigo-800 hover:bg-indigo-700 hover:cursor-pointer p-3" // Modificamos las clases aquí
          />
        ))}
      </div>

      {/* Controles de paginación */}
      <div style={estilos.paginacionContenedor}>
        <button
          onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
          disabled={paginaActual === 1}
          style={estilos.botonPaginacion(paginaActual === 1)}
        >
          Anterior
        </button>

        <span className="self-center">
          Página {paginaActual} de {totalPaginas}
        </span>

        <button
          onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
          disabled={paginaActual === totalPaginas}
          style={estilos.botonPaginacion(paginaActual === totalPaginas)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );



}