import { ConnectionsList } from "../components/ConnectionsList";
import { ConnectionsGraph } from "../pages/ConnectionsGraph";

export function ConnectionsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", padding: "24px" }}>
      <ConnectionsList />

    </div>

  );
}