import { useState, useEffect } from "react";
import BubbleChart from "../components/Charts/BubbleChart";
import TightBubbleChart from "../components/Charts/TightBubbleChart";
import PolicyBubbleChart from "../components/Charts/PolicyBubbleChart";
import axios from "axios";
import { Image } from '@chakra-ui/react';
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



export default function Dashboard() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const modoOscuro = colorMode === "dark";
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

  const [statsData, setStatsData] = useState({
    ndev: 0,
    nvuln: 0,
    total_vulnerabilidades: 0,
  });
  // Estado para indicadores adicionales
  const [extraStats, setExtraStats] = useState({
    estancia_mas_vulnerable: "",
    dispositivo_mas_vulnerable: "",
    porcentaje_afectados: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("http://localhost:8000/vulnet/api/v1/estadisticas-generales/");
        const data = await res.json();
        setStatsData(data);

        // Calcular % de dispositivos afectados
        const porcentaje_afectados = data.ndev > 0 ? ((data.nvuln / data.ndev) * 100).toFixed(1) : 0;

        // Obtener estancia y dispositivo más vulnerable
        const stackedRes = await fetch("http://localhost:8000/vulnet/api/v1/vulnerabilidades-por-estancia-y-dispositivo/");
        const stackedData = await stackedRes.json();

        let estanciaMasVulnerable = "";
        let maxVulnEstancia = -1;
        let dispositivoMasVulnerable = "";
        let maxVulnDispositivo = -1;

        const mapaEstancias = {};
        const mapaDispositivos = {};

        for (const item of stackedData) {
          mapaEstancias[item.estancia] = (mapaEstancias[item.estancia] || 0) + item.cantidad;
          mapaDispositivos[item.dispositivo] = (mapaDispositivos[item.dispositivo] || 0) + item.cantidad;
        }

        for (const [estancia, total] of Object.entries(mapaEstancias)) {
          if (total > maxVulnEstancia) {
            maxVulnEstancia = total;
            estanciaMasVulnerable = estancia;
          }
        }

        for (const [dispositivo, total] of Object.entries(mapaDispositivos)) {
          if (total > maxVulnDispositivo) {
            maxVulnDispositivo = total;
            dispositivoMasVulnerable = dispositivo;
          }
        }

        setExtraStats({
          estancia_mas_vulnerable: estanciaMasVulnerable,
          dispositivo_mas_vulnerable: dispositivoMasVulnerable,
          porcentaje_afectados,
        });
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      }
    }

    loadStats();
  }, []);
  useEffect(() => {
    async function loadStackedData() {
      try {
        const res = await fetch("http://localhost:8000/vulnet/api/v1/vulnerabilidades-por-estancia-y-dispositivo/");
        const rawData = await res.json();
        console.log("Datos recibidos para stackedData:", rawData);

        // Agrupar por estancia
        const agrupado = rawData.reduce((acc, curr) => {
          const { estancia, dispositivo, cantidad } = curr;
          let estanciaObj = acc.find(e => e.estancia === estancia);
          if (!estanciaObj) {
            estanciaObj = { estancia, dispositivos: [] };
            acc.push(estanciaObj);
          }
          estanciaObj.dispositivos.push({
            nombre: dispositivo,
            vulnerabilidades: cantidad
          });
          return acc;
        }, []);

        setStackedData(agrupado);
      } catch (error) {
        console.error("Error al cargar stacked data:", error);
      }
    }

    loadStackedData();
  }, []);

  const styles = {
    containerWithScroll: {
      overflowY: 'auto',
      maxHeight: '100vh',
      padding: '20px',
      boxSizing: 'border-box',
      backgroundColor: modoOscuro ? '#1a202c' : '#f9f9f9',
      color: modoOscuro ? '#fff' : '#000',
    },
    headerTitle: {
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      fontWeight: 'bold',
      fontSize: '2rem',
      color: modoOscuro ? '#fff' : '#1a202c',
    },
    headerBar: {
      backgroundColor: modoOscuro ? '#2d3748' : '#fff',
      borderBottomColor: modoOscuro ? '#4A5568' : '#E2E8F0',
    },
    cardBox: {
      backgroundColor: modoOscuro ? '#2D3748' : '#fff',
      padding: '16px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    },
    pageTitle: {
      fontSize: '2.5rem',
      fontWeight: '700',
      textAlign: 'center',
      marginTop: '24px',
      marginBottom: '24px',
      color: modoOscuro ? '#edf2f7' : '#1a202c',
    },
  };

  // Procesamiento de datos para el gráfico de barras apiladas
  const categories = stackedData.map(item => item.estancia);
  const dispositivosUnicos = [
    ...new Set(
      stackedData.flatMap(estancia => (estancia.dispositivos || []).map(d => d.nombre))
    )
  ];
  // Derivar vulnerabilidades totales por estancia y ordenar por nombre
  const estanciaVulnerabilidades = stackedData
    .map(item => ({
      estancia: item.estancia,
      total_vulnerabilidades: (item.dispositivos || []).reduce((sum, d) => sum + d.vulnerabilidades, 0),
    }))
    .sort((a, b) => a.estancia.localeCompare(b.estancia));
  // Create a color scale from yellow (few) to orange (mid) to red (many)
  const data_array = estanciaVulnerabilidades.map(estancia => ({
    label: estancia.estancia,
    value: estancia.total_vulnerabilidades,
  }));

  const colorScale = scaleLinear()
    .domain([
      Math.min(...data_array.map(d => d.value)),
      (Math.min(...data_array.map(d => d.value)) + Math.max(...data_array.map(d => d.value))) / 2,
      Math.max(...data_array.map(d => d.value))
    ])
    .range(["#FACC15", "#F97316", "#E11D48"]);
  // Estado para punto de burbuja hover
  const [hoveredPoint, setHoveredPoint] = useState(null);

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

  // Nueva definición de stackedSeries con etiquetas de dispositivo en cada segmento
  const stackedSeries = dispositivosUnicos.map(nombreDispositivo => ({
    name: nombreDispositivo,
    data: stackedData.map(estancia => {
      const dispositivo = estancia.dispositivos.find(d => d.nombre === nombreDispositivo);
      return {
        x: estancia.estancia,
        y: dispositivo ? dispositivo.vulnerabilidades : 0,
        label: nombreDispositivo
      };
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

        <Box display="flex" justifyContent="flex-end" px={4} pt={2}>
          <IconButton
            aria-label="Alternar modo claro/oscuro"
            icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
            variant="ghost"
            size="md"
            minW="auto"
            p={0}
            borderRadius="none"
          />
        </Box>

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


        <Heading style={styles.pageTitle}>DASHBOARD</Heading>

        {/* Main Content */}
        <Box ml={{ base: 0, md: 0 }} p={4}>
          <Tabs colorScheme="blue" mb={6}>

            <TabPanels>
              <TabPanel px={0}>
                {/* Stats Cards */}
                {/* Mini Statistics */}
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mb={8}>
                  <MiniStatistics title="Dispositivos" value={statsData.ndev} icon={FiCpu} iconColor="blue.400" />
                  <MiniStatistics title="Dispositivos Vulnerables" value={statsData.nvuln} icon={FiShield} iconColor="red.400" />
                  <MiniStatistics title="Vulnerabilidades Totales" value={statsData.total_vulnerabilidades} icon={FiAlertCircle} iconColor="orange.400" />
                  <MiniStatistics title="Estancia Más Vulnerable" value={extraStats.estancia_mas_vulnerable || "—"} icon={FiHome} iconColor="purple.400" />
                  <MiniStatistics title="Dispositivo Más Vulnerable" value={extraStats.dispositivo_mas_vulnerable || "—"} icon={FiActivity} iconColor="teal.400" />
                  <MiniStatistics title="% Dispositivos Afectados" value={`${extraStats.porcentaje_afectados}%`} icon={FiTrendingUp} iconColor="yellow.400" />
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
                        {stackedData.length > 0 && categories.length > 0 && dispositivosUnicos.length > 0 ? (
                          <Box w="100%" overflowX="auto" pl={12}>
                            <ReactApexChart
                              options={{
                                chart: {
                                  type: 'bar',
                                  stacked: true,
                                  background: useColorModeValue('#ffffff', '#1A202C'),
                                  toolbar: { show: false },
                                  height: 500,
                                  animations: { enabled: true },
                                  padding: {
                                    top: 20,
                                    bottom: 10
                                  }
                                },
                                dataLabels: {
                                  enabled: true,
                                  formatter: function (_, opts) {
                                    return opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] > 0
                                      ? opts.w.globals.seriesNames[opts.seriesIndex]
                                      : '';
                                  },
                                  style: {
                                    colors: ['#ffffff'],
                                    fontSize: '14px',
                                    fontWeight: 'bold'
                                  }
                                },
                                grid: {
                                  show: false
                                },
                                xaxis: {
                                  categories,
                                  labels: {
                                    style: {
                                      colors: useColorModeValue('#2D3748', '#FFFFFF'),
                                      fontSize: '14px',
                                      fontWeight: 500
                                    }
                                  }
                                },
                                yaxis: {
                                  show: true,
                                  title: {
                                    text: 'Vulnerabilidades',
                                    style: {
                                      fontSize: '14px',
                                      fontWeight: 'bold',
                                      color: useColorModeValue('#2D3748', '#FFFFFF')
                                    }
                                  },
                                  labels: {
                                    style: {
                                      fontSize: '12px',
                                      colors: useColorModeValue('#2D3748', '#FFFFFF')
                                    }
                                  }
                                },
                                legend: {
                                  position: 'bottom',
                                  horizontalAlign: 'center',
                                  fontSize: '14px',
                                  labels: {
                                    colors: useColorModeValue('#2D3748', '#FFFFFF')
                                  },
                                  markers: {
                                    width: 12,
                                    height: 12,
                                    radius: 2
                                  }
                                },
                                tooltip: {
                                  theme: colorMode,
                                  y: {
                                    formatter: v => `${v} vulnerabilidades`
                                  }
                                },
                                plotOptions: {
                                  bar: {
                                    borderRadius: 6,
                                    horizontal: false,
                                    columnWidth: '35%',
                                    distributed: false,
                                    dataLabels: {
                                      enabled: false
                                    }
                                  }
                                },
                                theme: {
                                  mode: colorMode
                                }
                              }}
                              series={stackedSeries}
                              type="bar"
                              height={650}
                            />
                          </Box>
                        ) : (
                          <Text>Cargando datos...</Text>
                        )}
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
                        {stackedData.length > 0 && dataSolar.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                              <XAxis type="number" dataKey="x" domain={[-packSize.width / 2, packSize.width / 2]} hide />
                              <YAxis type="number" dataKey="y" domain={[-packSize.height / 2, packSize.height / 2]} hide />
                              <Scatter
                                data={dataSolar}
                                shape={props => {
                                  const isHovered = hoveredPoint && hoveredPoint.label === props.payload.label;
                                  return (
                                    <g onMouseEnter={() => setHoveredPoint(props.payload)} onMouseLeave={() => setHoveredPoint(null)}>
                                      <circle
                                        cx={props.cx}
                                        cy={props.cy}
                                        r={props.payload.size + (isHovered ? 15 : 0)}
                                        fill={props.payload.fill}
                                        stroke={isHovered ? "#2D3748" : "none"}
                                        strokeWidth={isHovered ? 2 : 0}
                                        style={{ transition: "all 0.3s ease-out", cursor: "pointer" }}
                                      />
                                      <text
                                        x={props.cx}
                                        y={props.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill={useColorModeValue('#2D3748', '#FFFFFF')}
                                        fontSize="12"
                                        fontWeight="bold"
                                      >
                                        {props.payload.label}
                                      </text>
                                    </g>
                                  );
                                }}
                              />
                              <Tooltip cursor={false} content={<CustomTooltip />} />
                            </ScatterChart>
                          </ResponsiveContainer>
                        ) : (
                          <Text>Cargando datos...</Text>
                        )}
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