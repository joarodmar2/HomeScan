import { useEffect, useState } from "react";
import { Graph } from "react-d3-graph";
import { getDeviceModels } from "../api/devices.api";
import { getConnectionGraph } from "../api/connections.api";
import { useColorMode, IconButton, Flex } from "@chakra-ui/react";
import { FaSun, FaMoon } from "react-icons/fa";
import { Box, Text } from "@chakra-ui/react";


export function ConnectionsGraph() {
  const [device_models, setDeviceModels] = useState([]);
  const [connection_sources, setConnectionSource] = useState([]);
  const [connection_targets, setConnectionTarget] = useState([]);
  const [connection_labels, setConnectionLabels] = useState([]);

  const [loading, setLoading] = useState(true); // State to track API call status
  const [secondloading, secondSetLoading] = useState(true); // State to track API call status
  const { colorMode, toggleColorMode } = useColorMode();
  const modoOscuro = colorMode === 'dark';

  const scrollStyles = {
    containerWithScroll: {
      overflowY: "auto",
      maxHeight: "100vh",
      paddingTop: "120px", // espacio para header fijo
      paddingX: "20px",     // margen lateral opcional
      scrollbarWidth: "thin", // Firefox
      "&::-webkit-scrollbar": {
        width: "8px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#a0aec0", // gris medio
        borderRadius: "4px",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "#edf2f7", // gris claro
      },
      _dark: {
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#4A5568", // gris oscuro
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#1A202C", // fondo oscuro
        },
      }
    }
  };

  useEffect(() => {
    async function loadDeviceModels() {
      try {
        const res = await getDeviceModels();
        setDeviceModels(res.data["models"]);
        setLoading(false); // Set loading to false when API call is successful
      } catch (error) {
        console.error("Error fetching device models:", error);
        setLoading(false); // Set loading to false even if there's an error
      }
    }
    loadDeviceModels();
  }, []);

  useEffect(() => {
    async function loadConnectionInfo() {
      try {
        const res = await getConnectionGraph();
        setConnectionSource(res.data["first_devices"]);
        setConnectionTarget(res.data["second_devices"]);
        setConnectionLabels(res.data["protocols"]);

        secondSetLoading(false); // Set loading to false when API call is successful
      } catch (error) {
        console.error("Error fetching device models:", error);
        secondSetLoading(false); // Set loading to false even if there's an error
      }
    }
    loadConnectionInfo();
  }, []);


  // Show only devices that are part of at least one connection
  const uniqueDeviceNames = Array.from(new Set([...connection_sources, ...connection_targets]));
  const nodes = uniqueDeviceNames.map((name) => ({ id: name }));
  const links = connection_sources.map((source, index) => ({
    source,
    target: connection_targets[index],
    label: connection_labels[index],
    id: `${source}-${connection_targets[index]}-${connection_labels[index]}` // clave única
  }));
  const graph_data = {
    nodes: nodes,
    links: links,
  };

  const config = {
    directed: false,
    automaticRearrangeAfterDropNode: true,
    collapsible: false,
    highlightDegree: 1,
    highlightOpacity: 0.2,
    linkHighlightBehavior: true,
    maxZoom: 0,
    minZoom: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    nodeHighlightBehavior: true,
    panAndZoom: false,
    staticGraph: false,
    d3: {
      alphaTarget: 0.15,
      gravity: -800,
      linkLength: 250,
      linkStrength: 1,
    },
    node: {
      color: colorMode === "dark" ? "white" : "#222222",
      fontColor: colorMode === "dark" ? "white" : "#222222",
      fontSize: 14,
      fontWeight: "normal",
      highlightColor: "#3b82f6", // azul
      highlightFontSize: 16,
      highlightFontWeight: "bold",
      highlightStrokeWidth: 1.5,
      mouseCursor: "pointer",
      opacity: 0.9,
      renderLabel: true,
      size: 800,
      strokeColor: "none",
      strokeWidth: 1.5,
      symbolType: "circle",
      viewGenerator: null,
    },
    link: {
      color: colorMode === "dark" ? "white" : "#555555",
      fontColor: colorMode === "dark" ? "white" : "#555555",
      fontSize: 14,
      fontWeight: "normal",
      highlightColor: "#3b82f6",
      highlightFontSize: 16,
      highlightFontWeight: "bold",
      highlightStrokeWidth: 1.5,
      labelProperty: "label",
      mouseCursor: "pointer",
      opacity: 0.9,
      renderLabel: true,
      semanticStrokeWidth: true,
      strokeWidth: 1.5,
      markerHeight: 6,
      markerWidth: 6,
      strokeDasharray: 0,
      strokeDashoffset: 0,
      strokeLinecap: "butt",
    },
    backgroundColor: colorMode === "dark" ? "#0f111d" : "#ffffff",
  };


  const onClickNode = function (nodeId) {
    window.location.replace("/dashboard/" + nodeId);
  };

  const onClickLink = function (source, target) {
    window.alert(`Clicked link between ${source} and ${target}`);
  };

  return (
    <Box sx={scrollStyles.containerWithScroll}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Flex flex={1} justifyContent="center">
          <Text
            fontSize="2xl"
            fontWeight="semibold"
            color="gray.900"
            _dark={{ color: "white" }}
          >
            Grafo de Conexiones
          </Text>
        </Flex>
        <IconButton
          icon={modoOscuro ? <FaSun /> : <FaMoon />}
          onClick={toggleColorMode}
          aria-label="Toggle color mode"
          variant="ghost"
          size="md"
        />
      </Flex>

      {loading && secondloading ? (
        <div>Loading...</div>
      ) : (
        <Flex justifyContent="center">
          <Graph
            id="graph-id"
            data={graph_data}
            config={config}
            onClickNode={onClickNode}
            onClickLink={onClickLink}
          />
        </Flex>
      )}
    </Box>
  );
}
