import { useState, useEffect } from "react";
import BubbleChart from "../components/Charts/BubbleChart";
import TightBubbleChart from "../components/Charts/TightBubbleChart";
import PolicyBubbleChart from "../components/Charts/PolicyBubbleChart";
import axios from "axios";
import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  Icon,
  Avatar,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Card,
  CardHeader,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
  HStack,
  Divider,
  SimpleGrid,
  Select,
  useColorMode,
} from "@chakra-ui/react";
import {
  BarChart,
  LineChart,
  PieChart,
  AreaChart,
  Bar,
  Line,
  Pie,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ScatterChart,
  Scatter,
  Layer,
  LabelList,
} from "recharts";
import { hierarchy, pack } from "d3-hierarchy";
import { scaleLinear } from "d3-scale";
import {
  FiBarChart2,
  FiHome,
  FiUsers,
  FiPieChart,
  FiTrendingUp,
  FiSettings,
  FiCreditCard,
  FiSearch,
  FiBell,
  FiMenu,
  FiDownload,
  FiDollarSign,
  FiActivity,
  FiCpu,
  FiShield,
  FiAlertCircle,
  FiHeart,
} from "react-icons/fi";
import { FaSun, FaMoon } from "react-icons/fa";
import ReactApexChart from "react-apexcharts";

// Componente MiniStatistics para mostrar estadísticas pequeñas
const MiniStatistics = ({ title, value, icon, iconColor }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const IconComponent = icon;

  // Custom tooltip to show vulnerabilities count
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box bg={cardBg} p={2} borderRadius="md" boxShadow="md">
          <Text>{`Vulnerabilidades : ${payload[0].payload.value}`}</Text>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box bg={cardBg} p={4} borderRadius="xl" boxShadow="sm">
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontSize="sm" color="gray.500">{title}</Text>
          <Text fontSize="2xl" fontWeight="bold">{value}</Text>
        </Box>
        <Box p={2} bg={iconColor} borderRadius="md" opacity={0.8}>
          <Icon as={IconComponent} boxSize={6} color="white" />
        </Box>
      </Flex>
    </Box>
  );
};

// Sample data for charts
const revenueData = [
  { name: "Ene", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 5000 },
  { name: "Abr", value: 2780 },
  { name: "May", value: 1890 },
  { name: "Jun", value: 2390 },
  { name: "Jul", value: 3490 },
  { name: "Ago", value: 4000 },
  { name: "Sep", value: 4500 },
  { name: "Oct", value: 5200 },
  { name: "Nov", value: 4800 },
  { name: "Dic", value: 6000 },
];
const data = [
  { x: 1, y: 1, value: 10, color: "#E53E3E" },
  { x: 2, y: 1, value: 20, color: "#3182CE" },
  { x: 3, y: 1, value: 30, color: "#38A169" },
  { x: 4, y: 1, value: 40, color: "#D69E2E" },
];

const usersData = [
  { name: "Ene", nuevos: 400, activos: 240 },
  { name: "Feb", nuevos: 300, activos: 139 },
  { name: "Mar", nuevos: 200, activos: 980 },
  { name: "Abr", nuevos: 278, activos: 390 },
  { name: "May", nuevos: 189, activos: 480 },
  { name: "Jun", nuevos: 239, activos: 380 },
  { name: "Jul", nuevos: 349, activos: 430 },
];






const trafficData = [
  { name: "Ene", directo: 400, orgánico: 240, referido: 140 },
  { name: "Feb", directo: 300, orgánico: 198, referido: 220 },
  { name: "Mar", directo: 200, orgánico: 980, referido: 350 },
  { name: "Abr", directo: 278, orgánico: 390, referido: 430 },
  { name: "May", directo: 189, orgánico: 480, referido: 380 },
  { name: "Jun", directo: 239, orgánico: 380, referido: 290 },
  { name: "Jul", directo: 349, orgánico: 430, referido: 340 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

// Datos de ejemplo para el gráfico de barras apiladas (simulando la respuesta de la API)
const mockStackedData = [
  {
    estancia: "Sala de estar",
    dispositivos: [
      { nombre: "Smart TV", vulnerabilidades: 5 },
      { nombre: "Altavoz inteligente", vulnerabilidades: 3 },
      { nombre: "Router WiFi", vulnerabilidades: 7 }
    ]
  },
  {
    estancia: "Cocina",
    dispositivos: [
      { nombre: "Nevera inteligente", vulnerabilidades: 2 },
      { nombre: "Altavoz inteligente", vulnerabilidades: 1 },
      { nombre: "Router WiFi", vulnerabilidades: 4 }
    ]
  },
  {
    estancia: "Dormitorio",
    dispositivos: [
      { nombre: "Smart TV", vulnerabilidades: 3 },
      { nombre: "Altavoz inteligente", vulnerabilidades: 2 },
      { nombre: "Router WiFi", vulnerabilidades: 5 }
    ]
  },
  {
    estancia: "Oficina",
    dispositivos: [
      { nombre: "Ordenador", vulnerabilidades: 8 },
      { nombre: "Impresora", vulnerabilidades: 6 },
      { nombre: "Router WiFi", vulnerabilidades: 9 }
    ]
  }
];

// Datos de ejemplo para las estadísticas
const mockStats = {
  ndev: 12,
  nvuln: 8,
  total_vulnerabilidades: 55,
  weighted_average: 3.7,
  average_sustainability: 6.8
};

// Datos de ejemplo para el gráfico de donut
const mockSeveritySummary = {
  none: 10,
  low: 20,
  medium: 15,
  high: 8,
  critical: 2,
  total: 55
};


export default function Dashboard() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const legendTextColor = useColorModeValue('#2D3748', '#FFFFFF');
  const [salesData, setSalesData] = useState([]);

  // Selector para elegir tipo de gráfico en Resumen
  const [selectedChart, setSelectedChart] = useState("bubble");

  useEffect(() => {
    axios.get("http://localhost:8000/vulnet/api/v1/nseveritysummary/")
      .then((response) => {
        const data = response.data;
        const pieData = [
          { name: "Baja", value: data.low },
          { name: "Media", value: data.medium },
          { name: "Alta", value: data.high },
          { name: "Crítica", value: data.critical },
        ];
        setSalesData(pieData);
      })
      .catch((error) => {
        console.error("Error fetching severity summary:", error);
      });
  }, []);





  // Estado para los datos del gráfico de barras apiladas
  const [stackedData, setStackedData] = useState([]);
  useEffect(() => {
    async function loadStackedData() {
      try {
        const res = await fetch("http://localhost:8000/vulnet/api/v1/vulnerabilidades-por-estancia-y-dispositivo/");
        const data = await res.json();
        if (Array.isArray(data)) {
          setStackedData(data);
        } else {
          console.error("Formato inesperado de stacked data:", data);
        }
      } catch (error) {
        console.error("Error al cargar stacked data:", error);
      }
    }
    loadStackedData();
  }, []);

  const styles = {
    containerWithScroll: {
      overflowY: 'auto',   // Habilita el scroll vertical
      maxHeight: '100vh',  // Limita la altura al tamaño de la ventana
      padding: '20px',     // Espaciado interno para que el contenido no quede pegado a los bordes
      boxSizing: 'border-box',
    },
  };

  // Procesamiento de datos para el gráfico de barras apiladas
  const categories = stackedData.map(item => item.estancia);
  const dispositivosUnicos = [
    ...new Set(
      stackedData.flatMap(estancia => estancia.dispositivos.map(d => d.nombre))
    )
  ];
  // Derivar vulnerabilidades totales por estancia y ordenar por nombre
  const estanciaVulnerabilidades = stackedData
    .map(item => ({
      estancia: item.estancia,
      total_vulnerabilidades: item.dispositivos.reduce((sum, d) => sum + d.vulnerabilidades, 0),
    }))
    .sort((a, b) => a.estancia.localeCompare(b.estancia));
  // Create a color scale from yellow (few vulnerabilities) to red (many)
  const data_array = estanciaVulnerabilidades.map(estancia => ({
    label: estancia.estancia,
    value: estancia.total_vulnerabilidades,
  }));

  const colorScale = scaleLinear()
    .domain([
      Math.min(...data_array.map(d => d.value)),
      Math.max(...data_array.map(d => d.value))
    ])
    .range(["#FACC15", "#E11D48"]);

  // Prepare non-overlapping bubble positions via D3 pack layout
  const packSize = { width: 600, height: 600 };
  const root = hierarchy({ children: data_array })
    .sum(d => d.value);

  const packed = pack()
    .size([packSize.width, packSize.height])
    .padding(0)(root);

  const dataSolar = packed.leaves().map(node => ({
    x: node.x - packSize.width / 2,
    y: node.y - packSize.height / 2,
    size: node.r,
    value: node.data.value,
    label: node.data.label,
    fill: colorScale(node.data.value),
  }));

  const stackedSeries = dispositivosUnicos.map(nombreDispositivo => ({
    name: nombreDispositivo,
    data: stackedData.map(estancia => {
      const dispositivo = estancia.dispositivos.find(d => d.nombre === nombreDispositivo);
      return dispositivo ? dispositivo.vulnerabilidades : 0;
    })
  }));

  // Datos para el gráfico de donut
  const pieChartSeries = salesData.map(item => item.value);
  const pieChartLabels = salesData.map(item => item.name);

  const COLORS = ['#A0AEC0', '#63B3ED', '#F6AD55', '#FC8181', '#E53E3E']; // none, low, medium, high, critical

  // Efecto para cargar datos reales (simulado con setTimeout)
  useEffect(() => {
    // Aquí podrías hacer tus llamadas a API reales
    // Por ahora usamos los datos de ejemplo
    const timer = setTimeout(() => {
      console.log("Datos cargados (simulado)");
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Custom tooltip to show vulnerabilities count in bubble charts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box bg={cardBg} p={2} borderRadius="md" boxShadow="md">
          <Text>{`Vulnerabilidades : ${payload[0].payload.value}`}</Text>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box style={styles.containerWithScroll}>
      <Box minH="100vh" bg={bgColor}>

        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full"
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>DataViz</DrawerHeader>
          </DrawerContent>
        </Drawer>

        {/* Header */}
        {/* Nueva cabecera para el título y logo de la app */}
        <Flex
          bg={useColorModeValue("gray.100", "gray.800")}
          color={useColorModeValue("gray.700", "gray.200")}
          px={4}
          height="16"
          alignItems="center"
          justifyContent="center" // Centra los elementos horizontalmente
          flexDirection="column" // Centra los elementos verticalmente si hay varios
        >
          {/* Aquí puedes añadir el logo de tu app */}
          {/* Ejemplo: */}
          {/* <Image src="/ruta/a/tu/logo.png" alt="Logo de la App" height="10" mb={2} /> */}
          <Heading size="2xl" fontWeight="bold" textAlign="center">Nombre de tu App</Heading>
        </Flex>

        <Flex
          ml={{ base: 0, md: 60 }}
          px={4}
          height="20"
          alignItems="center"
          bg={cardBg}
          borderBottomWidth="1px"
          borderBottomColor={useColorModeValue("gray.200", "gray.700")}
          justifyContent="space-between"
        >
          <IconButton
            display={{ base: "flex", md: "none" }}
            onClick={onOpen}
            variant="outline"
            aria-label="open menu"
            icon={<FiMenu />}
          />

          <Heading size="lg" fontWeight="semibold">
            Dashboard
          </Heading>

          <HStack spacing={4}>

            <IconButton
              aria-label="Alternar modo claro/oscuro"
              icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
              onClick={toggleColorMode}
              variant="ghost"
              size="md"
            />


          </HStack>
        </Flex>

        {/* Main Content */}
        <Box ml={{ base: 0, md: 60 }} p={4}>
          <Tabs colorScheme="blue" mb={6}>

            <TabPanels>
              <TabPanel px={0}>
                {/* Stats Cards */}
                {/* Mini Statistics */}
                <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4} mb={8}>
                  <MiniStatistics title="Dispositivos" value={mockStats.ndev} icon={FiCpu} iconColor="blue.400" />
                  <MiniStatistics title="Dispositivos Vulnerables" value={mockStats.nvuln} icon={FiShield} iconColor="red.400" />
                  <MiniStatistics title="Vulnerabilidades Totales" value={mockStats.total_vulnerabilidades} icon={FiAlertCircle} iconColor="orange.400" />
                  <MiniStatistics title="Promedio Ponderado" value={mockStats.weighted_average} icon={FiActivity} iconColor="purple.400" />
                  <MiniStatistics title="Sostenibilidad Media" value={mockStats.average_sustainability} icon={FiHeart} iconColor="green.400" />
                </SimpleGrid>

                {/* Selector de tipo de gráfico */}
                <HStack spacing={4} mb={4}>
                  <Button
                    colorScheme={selectedChart === "bar" ? "blue" : "gray"}
                    onClick={() => setSelectedChart("bar")}
                  >
                    Barras
                  </Button>
                  <Button
                    colorScheme={selectedChart === "donut" ? "blue" : "gray"}
                    onClick={() => setSelectedChart("donut")}
                  >
                    Donut
                  </Button>
                  <Button
                    colorScheme={selectedChart === "bubble" ? "blue" : "gray"}
                    onClick={() => setSelectedChart("bubble")}
                  >
                    Burbuja
                  </Button>
                </HStack>

                {/* Gráfico seleccionado */}
                {selectedChart === "bar" && (
                  <Card mb={6}>
                    <CardHeader>
                      <Heading size="md">Vulnerabilidades por Estancia</Heading>
                      <Text fontSize="sm" color="gray.500">
                        Dispositivos vulnerables por estancia
                      </Text>
                    </CardHeader>
                    <CardBody>
                      <Box bg={cardBg} p={4} borderRadius="xl" boxShadow="md" h="700px">
                        <ResponsiveContainer width="100%" height="100%">
                          <ReactApexChart
                            options={{
                              chart: { type: 'bar', stacked: true, background: 'transparent', toolbar: { show: false } },
                              xaxis: { categories, labels: { style: { colors: useColorModeValue('#2D3748', '#FFFFFF') } } },
                              yaxis: { title: { text: 'Vulnerabilidades' }, labels: { style: { colors: useColorModeValue('#2D3748', '#FFFFFF') } } },
                              legend: { position: 'bottom', labels: { colors: [useColorModeValue('#2D3748', '#FFFFFF')] } },
                              tooltip: { y: { formatter: v => `${v} vulnerabilidades` } },
                              theme: { mode: colorMode }
                            }}
                            series={stackedSeries}
                            type="bar"
                            height={700}
                          />
                        </ResponsiveContainer>
                      </Box>
                    </CardBody>
                  </Card>
                )}

                {selectedChart === "donut" && (
                  <Card mb={6}>
                    <CardHeader>
                      <Heading size="md">Tipos de Vulnerabilidades</Heading>
                      <Text fontSize="sm" color="gray.500">
                        Severidad de vulnerabilidades
                      </Text>
                    </CardHeader>
                    <CardBody>
                      <Box bg={cardBg} p={4} borderRadius="xl" boxShadow="md" h="700px" display="flex" alignItems="center" justifyContent="center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={salesData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} label>
                              {salesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={24} />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardBody>
                  </Card>
                )}

                {selectedChart === "bubble" && (
                  <Card mb={6}>
                    <CardHeader>
                      <Heading size="md">Vulnerabilidades (Burbuja)</Heading>
                      <Text fontSize="sm" color="gray.500">
                        Total de vulnerabilidades por estancia
                      </Text>
                    </CardHeader>
                    <CardBody>
                      <Box bg={cardBg} p={4} borderRadius="xl" boxShadow="md" h="700px">
                        <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                            <XAxis type="number" dataKey="x" domain={[-packSize.width / 2, packSize.width / 2]} hide />
                            <YAxis type="number" dataKey="y" domain={[-packSize.height / 2, packSize.height / 2]} hide />
                            <Scatter
                              data={dataSolar}
                              shape={props => (
                                <circle
                                  cx={props.cx}
                                  cy={props.cy}
                                  r={props.payload.size}
                                  fill={props.payload.fill}
                                  fillOpacity={1}
                                />
                              )}
                            >
                              <LabelList dataKey="label" position="center" fill={useColorModeValue('#2D3748', '#FFFFFF')} />
                            </Scatter>
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                          </ScatterChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardBody>
                  </Card>
                )}
              </TabPanel>

            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </Box>
  );
}