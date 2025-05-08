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
} from "recharts";
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
// Datos de ejemplo para el gráfico de burbujas
const mockEstanciaVulnerabilidades = [
  { estancia: "Sala de estar", total_vulnerabilidades: 15 },
  { estancia: "Cocina", total_vulnerabilidades: 7 },
  { estancia: "Dormitorio", total_vulnerabilidades: 10 },
  { estancia: "Oficina", total_vulnerabilidades: 23 },
  { estancia: "Baño", total_vulnerabilidades: 5 }
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




  // Estado para los datos del gráfico de burbujas
  const [estanciaVulnerabilidades, setEstanciaVulnerabilidades] = useState(mockEstanciaVulnerabilidades);

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

  // Procesamiento de datos para el gráfico de barras apiladas
  const categories = stackedData.map(item => item.estancia);
  const dispositivosUnicos = [
    ...new Set(
      stackedData.flatMap(estancia => estancia.dispositivos.map(d => d.nombre))
    )
  ];
  // Procesamiento de datos para el gráfico de burbujas
  const data_array = estanciaVulnerabilidades.map(estancia => {
    const size = estancia.total_vulnerabilidades;
    let color = size >= 15 ? "#e11d48" : size >= 8 ? "#f97316" : "#facc15";
    return {
      label: estancia.estancia,
      value: size,
      size: size * 10,
      color: color
    };
  });

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

  return (
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
          <InputGroup w={{ base: "auto", md: "300px" }}>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input type="text" placeholder="Buscar..." />
          </InputGroup>

          <IconButton aria-label="Notificaciones" icon={<FiBell />} variant="ghost" />

          <IconButton
            aria-label="Alternar modo claro/oscuro"
            icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
            variant="ghost"
            size="md"
          />

          <Menu>
            <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={0}>
              <Avatar size="sm" name="Usuario" />
            </MenuButton>
            <MenuList>
              <MenuItem>Perfil</MenuItem>
              <MenuItem>Configuración</MenuItem>
              <MenuItem>Cerrar Sesión</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {/* Main Content */}
      <Box ml={{ base: 0, md: 60 }} p={4}>
        <Tabs colorScheme="blue" mb={6}>
          <TabList>
            <Tab>Resumen</Tab>
            <Tab>Dispositivos</Tab>
            <Tab>Análisis</Tab>
            <Tab>Reportes</Tab>
          </TabList>

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

              <Grid templateColumns={{ base: "1fr", lg: "4fr 3fr" }} gap={6} mb={6}>
                <Card>
                  <CardHeader>
                    <Heading size="md">Vulnerabilidades por Estancia</Heading>
                    <Text fontSize="xl" fontWeight="semibold" mb={4} color="gray.600">
                      Vulnerabilidades por Dispositivo en cada Estancia
                    </Text>
                  </CardHeader>
                  <CardBody>
                    <Box bg={cardBg} p={6} borderRadius="xl" boxShadow="md">

                      <Flex justify="center" align="center" height="100%">
                        <ReactApexChart
                          options={{
                            chart: {
                              type: 'bar',
                              stacked: true,
                              background: 'transparent',
                              toolbar: { show: false }
                            },
                            xaxis: {
                              categories: categories,
                              labels: { style: { colors: useColorModeValue('#2D3748', '#FFFFFF') } }
                            },
                            yaxis: {
                              title: {
                                text: 'Vulnerabilidades por Dispositivo',
                                style: { color: useColorModeValue('#2D3748', '#FFFFFF') }
                              },
                              labels: { style: { colors: useColorModeValue('#2D3748', '#FFFFFF') } }
                            },
                            legend: {
                              position: 'bottom',
                              labels: { colors: [useColorModeValue('#2D3748', '#FFFFFF')] }
                            },
                            tooltip: {
                              shared: false,
                              intersect: true,
                              y: {
                                formatter: function (val) {
                                  return `${val} vulnerabilidades`;
                                }
                              }
                            },
                            theme: { mode: colorMode }
                          }}
                          series={stackedSeries}
                          type="bar"
                          height={350}
                        />
                      </Flex>
                    </Box>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>
                    <Heading size="md">Tipos de Vulnerabilidades</Heading>
                    <Text color="gray.500" fontSize="sm">
                      Distribución de vulnerabilidades por severidad en la casa
                    </Text>
                  </CardHeader>
                  <CardBody>

                    <Box h="300px">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart width={400} height={400}>
                          <Pie
                            data={salesData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            label
                          >
                            {salesData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardBody>
                </Card>



              </Grid>

              <Grid templateColumns={{ base: "1fr", lg: "3fr 4fr" }} gap={6}>
                <Card>
                  <CardHeader>
                    <Heading size="md">Usuarios Activos vs Nuevos</Heading>
                    <Text color="gray.500" fontSize="sm">
                      Comparación mensual
                    </Text>
                  </CardHeader>
                  <CardBody>
                    <Box h="300px">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={usersData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="nuevos" fill="#805AD5" />
                          <Bar dataKey="activos" fill="#3182CE" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <Heading size="md">Fuentes de Tráfico</Heading>
                    <Text color="gray.500" fontSize="sm">
                      Distribución de tráfico por canal
                    </Text>
                  </CardHeader>
                  <CardBody>
                    <Box h="300px">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={trafficData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="directo" stroke="#3182CE" activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="orgánico" stroke="#805AD5" />
                          <Line type="monotone" dataKey="referido" stroke="#FFBB28" />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardBody>
                </Card>
              </Grid>
            </TabPanel>

            {/* Pestaña de Dispositivos - Aquí integramos el contenido del archivo compartido */}
            <TabPanel px={0}>
              <Text fontSize="2xl" fontWeight="bold" mb={6}>
                Dispositivos y Vulnerabilidades
              </Text>
              {/* Bubble Chart */}
              <Box
                bg={cardBg}
                p={6}
                borderRadius="xl"
                boxShadow="md"
                overflow="hidden"
                mb={8}
                maxW="800px"
              >
                <Text fontSize="xl" fontWeight="semibold" mb={4} color="gray.600">
                  Vulnerabilidades por Estancia
                </Text>

                <Flex justify="center" align="center">
                  <TightBubbleChart data={data} width={400} height={400} />
                </Flex>
              </Box>



              {/* Donut Chart + Stacked Bar Chart */}
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb={10}>
                <Box bg={cardBg} p={6} borderRadius="xl" boxShadow="md">
                  <Text fontSize="xl" fontWeight="semibold" mb={4} color="gray.600">
                    Resumen de Severidad
                  </Text>
                  <Flex justify="center" align="center" height="100%">
                    <ReactApexChart
                      options={{
                        chart: { type: 'donut', background: 'transparent' },
                        labels: pieChartLabels,
                        theme: { mode: colorMode },
                        legend: {
                          position: 'bottom',
                          labels: { colors: [legendTextColor] }
                        },
                        tooltip: {
                          y: { formatter: val => `${val} vulnerabilidades` }
                        },
                        plotOptions: {
                          pie: { donut: { size: '70%' } }
                        }
                      }}
                      series={pieChartSeries}
                      type="donut"
                      width={350}
                    />
                  </Flex>
                </Box>

                <Box bg={cardBg} p={6} borderRadius="xl" boxShadow="md">
                  <Text fontSize="xl" fontWeight="semibold" mb={4} color="gray.600">
                    Vulnerabilidades por Dispositivo en cada Estancia
                  </Text>
                  <Flex justify="center" align="center" height="100%">
                    <ReactApexChart
                      options={{
                        chart: {
                          type: 'bar',
                          stacked: true,
                          background: 'transparent',
                          toolbar: { show: false }
                        },
                        xaxis: {
                          categories: categories,
                          labels: { style: { colors: useColorModeValue('#2D3748', '#FFFFFF') } }
                        },
                        yaxis: {
                          title: {
                            text: 'Vulnerabilidades por Dispositivo',
                            style: { color: useColorModeValue('#2D3748', '#FFFFFF') }
                          },
                          labels: { style: { colors: useColorModeValue('#2D3748', '#FFFFFF') } }
                        },
                        legend: {
                          position: 'bottom',
                          labels: { colors: [useColorModeValue('#2D3748', '#FFFFFF')] }
                        },
                        tooltip: {
                          shared: false,
                          intersect: true,
                          y: {
                            formatter: function (val) {
                              return `${val} vulnerabilidades`;
                            }
                          }
                        },
                        theme: { mode: colorMode }
                      }}
                      series={stackedSeries}
                      type="bar"
                      height={350}
                    />
                  </Flex>
                </Box>
              </SimpleGrid>
            </TabPanel>

            <TabPanel>
              <Box p={4} bg={cardBg} borderRadius="lg">
                <Text>Contenido de Análisis (en desarrollo)</Text>
              </Box>
            </TabPanel>

            <TabPanel>
              <Box p={4} bg={cardBg} borderRadius="lg">
                <Text>Contenido de Reportes (en desarrollo)</Text>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
}