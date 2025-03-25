import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap", // Evita solapamientos al permitir múltiples líneas
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        padding: "10px",
      }}
    >
      <Link to="/devices">
        <h1 style={{ flex: "1 1 100%", textAlign: "center" }}>ALBA-ASSISTANT</h1>
      </Link>
      <button style={{ backgroundColor: "gray", padding: "10px 15px", borderRadius: "8px", whiteSpace: "nowrap" }}>
        <Link to="/devices">Devices</Link>
      </button>
      <button style={{ backgroundColor: "gray", padding: "10px 15px", borderRadius: "8px", whiteSpace: "nowrap" }}>
        <Link to="/connections">Connections</Link>
      </button>
      <button style={{ backgroundColor: "gray", padding: "10px 15px", borderRadius: "8px", whiteSpace: "nowrap" }}>
        <Link to="/graph">Graph</Link>
      </button>
      <button style={{ backgroundColor: "gray", padding: "10px 15px", borderRadius: "8px", whiteSpace: "nowrap" }}>
        <Link to="/Estancia">Estancia</Link>
      </button>
      <button style={{ backgroundColor: "gray", padding: "10px 15px", borderRadius: "8px", whiteSpace: "nowrap" }}>
        <Link to="/dashboard">Dashboard</Link>
      </button>
      <button style={{ backgroundColor: "gray", padding: "10px 15px", borderRadius: "8px", whiteSpace: "nowrap" }}>
        <Link to="/device-create">Create Device</Link>
      </button>
      <button style={{ backgroundColor: "gray", padding: "10px 15px", borderRadius: "8px", whiteSpace: "nowrap" }}>
        <Link to="/connection-create">Create Connection</Link>
      </button>
      <button style={{ backgroundColor: "gray", padding: "10px 15px", borderRadius: "8px", whiteSpace: "nowrap" }}>
      <Link to="/vulnerabilities" className="text-white">Vulnerabilidades</Link>
      </button>
    </div>
  );
  
  
}