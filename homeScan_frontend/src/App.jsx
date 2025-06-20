
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { DevicesFormPage } from "./pages/DevicesFormPage";
import { DevicesPage } from "./pages/DevicesPage";
import { ConnectionsPage } from "./pages/ConnectionsPage";
import { ConnectionsFormPage } from "./pages/ConnectionsFormPage";
import DevicesDashboard from "./pages/DevicesDashboard";
import { DeviceVulnerabilitiesDashboard } from "./pages/DeviceVulnerabilitiesDashboard";
import { ConnectionsGraph } from "./pages/ConnectionsGraph";
import Objects from './components/Objects';


import { Toaster } from "react-hot-toast";

import EstanciaPage from "./pages/EstanciaPage";
import Estancia from "./components/Estancia";
import ThreeScene from "./components/ThreeScene";
import { ChakraProvider, Box } from "@chakra-ui/react";
import VulnerabilityPage from "./pages/VulnerabilityPage";  // Importamos la nueva página
import LandingPage from "./pages/LandingPage";


function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Navigation />

        <Box ml={{ base: 0, md: 60 }} p={4}> {/* MARGEN PARA TODAS LAS PÁGINAS */}
          <Routes>
            <Route path="/" element={<Navigate to="/info" />} />
            <Route path="/devices" element={<DevicesPage />} />
            <Route path="/devices/:id" element={<DevicesFormPage />} />
            <Route path="/device-create" element={<DevicesFormPage />} />
            <Route path="/connections" element={<ConnectionsPage />} />
            <Route path="/connection-create" element={<ConnectionsFormPage />} />
            <Route path="/connections/:id" element={<ConnectionsFormPage />} />
            <Route path="/dashboard" element={<DevicesDashboard />} />
            <Route path="/dashboard/:id/:vuln_id?" element={<DeviceVulnerabilitiesDashboard />} />
            <Route path="/graph" element={<ConnectionsGraph />} />
            <Route path="/objetos" element={<Objects />} />
            <Route path="/estancia" element={<EstanciaPage />} />
            <Route path="/estancia/:nombre" element={<Estancia />} />
            <Route path="/estancia/:nombreEstancia/modelado" element={<ThreeScene />} />
            <Route path="/modelado" element={<ThreeScene />} />
            <Route path="/info" element={<LandingPage />} />
            <Route path="/vulnerabilities" element={<VulnerabilityPage />} />
          </Routes>



          <Toaster />
        </Box>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;