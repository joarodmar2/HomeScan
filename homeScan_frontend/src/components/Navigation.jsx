import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  VStack,
  Divider,
  useColorModeValue,
  useColorMode
} from "@chakra-ui/react";
import { FiSun, FiMoon } from "react-icons/fi";
import { Image } from '@chakra-ui/react';
import { Space } from "lucide-react";

import {
  FiCpu,
  FiLink,
  FiActivity,
  FiInfo,
  FiHome,
  FiMenu,
  FiDownload,
  FiBarChart2,
  FiPlusSquare,
  FiPlus,
  FiAlertTriangle,
  FiCompass
} from "react-icons/fi";

import { Link } from "react-router-dom";


export function Navigation({ onClose, ...rest }) {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box
      bg={colorMode === "light" ? "white" : "linear-gradient(to-b, #1a202c, #2d3748)"}
      borderRight="1px"
      borderRightColor={colorMode === "light" ? "gray.200" : "gray.700"}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      boxShadow="md"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Flex alignItems="center">


          <Image
            src="/logo/logo.png"
            alt="Logo de la App"
            height="100"
            onLoad={() => console.log("✅ Imagen cargada correctamente")}
            onError={(e) => console.error("❌ Error cargando imagen:", e)}
          />
        </Flex>
      </Flex>

      <Text fontWeight="bold" fontSize="lg" mb={4} mt={2} color={colorMode === "light" ? "gray.700" : "gray.200"} fontFamily="'Inter', 'Segoe UI', sans-serif" textAlign="center">
      </Text>

      <VStack spacing={4} align="stretch" px={4}>
        <Box height="2" />
        <Box>


          <Text fontWeight="bold" mb={2} fontSize="sm" color="gray.500" fontFamily="'Inter', 'Segoe UI', sans-serif">
            MENÚ PRINCIPAL
          </Text>

          <VStack spacing={2} align="stretch">

            <Button
              as={Link}
              to="/Estancia"
              leftIcon={<FiHome />}
              justifyContent="flex-start"
              variant="ghost"
              colorScheme={colorMode === "light" ? "blue" : "cyan"}
              fontFamily="'Inter', 'Segoe UI', sans-serif"
              px={3}
              transition="all 0.3s ease"
              _transform="scale(1)"
              color={colorMode === "light" ? "blue.900" : undefined}
              _hover={{
                transform: "scale(1.05)",
                bg: colorMode === "light" ? "blue.700" : "cyan.700",
                color: colorMode === "light" ? "white" : "white"
              }}
            >
              Estancias
            </Button>
            <Button
              as={Link}
              to="/connections"
              leftIcon={<FiLink />}
              justifyContent="flex-start"
              variant="ghost"
              colorScheme={colorMode === "light" ? "blue" : "cyan"}
              fontFamily="'Inter', 'Segoe UI', sans-serif"
              px={3}
              transition="all 0.3s ease"
              _transform="scale(1)"
              color={colorMode === "light" ? "blue.900" : undefined}
              _hover={{
                transform: "scale(1.05)",
                bg: colorMode === "light" ? "blue.700" : "cyan.700",
                color: colorMode === "light" ? "white" : "white"
              }}
            >
              Conexiones
            </Button>
            <Button
              as={Link}
              to="/dashboard"
              leftIcon={<FiBarChart2 />}
              justifyContent="flex-start"
              variant="ghost"
              colorScheme={colorMode === "light" ? "blue" : "cyan"}
              fontFamily="'Inter', 'Segoe UI', sans-serif"
              px={3}
              transition="all 0.3s ease"
              _transform="scale(1)"
              color={colorMode === "light" ? "blue.900" : undefined}
              _hover={{
                transform: "scale(1.05)",
                bg: colorMode === "light" ? "blue.700" : "cyan.700",
                color: colorMode === "light" ? "white" : "white"
              }}
            >Dashboard
            </Button>
            <Button
              as={Link}
              to="/devices"
              leftIcon={<FiCpu />}
              justifyContent="flex-start"
              variant="ghost"
              colorScheme={colorMode === "light" ? "blue" : "cyan"}
              fontFamily="'Inter', 'Segoe UI', sans-serif"
              px={3}
              transition="all 0.3s ease"
              _transform="scale(1)"
              color={colorMode === "light" ? "blue.900" : undefined}
              _hover={{
                transform: "scale(1.05)",
                bg: colorMode === "light" ? "blue.700" : "cyan.700",
                color: colorMode === "light" ? "white" : "white"
              }}
            >Dispositivos
            </Button>
            <Button
              as={Link}
              to="/Info"
              leftIcon={<FiInfo />}
              justifyContent="flex-start"
              variant="ghost"
              colorScheme={colorMode === "light" ? "blue" : "cyan"}
              fontFamily="'Inter', 'Segoe UI', sans-serif"
              px={3}
              transition="all 0.3s ease"
              _transform="scale(1)"
              color={colorMode === "light" ? "blue.900" : undefined}
              _hover={{
                transform: "scale(1.05)",
                bg: colorMode === "light" ? "blue.700" : "cyan.700",
                color: colorMode === "light" ? "white" : "white"
              }}
            >
              Inicio
            </Button>

            <Button
              onClick={toggleColorMode}
              leftIcon={colorMode === "light" ? <FiMoon /> : <FiSun />}
              justifyContent="flex-start"
              variant="ghost"
              colorScheme={colorMode === "light" ? "blue" : "cyan"}
              fontFamily="'Inter', 'Segoe UI', sans-serif"
              px={3}
              transition="all 0.3s ease"
              _transform="scale(1)"
              color={colorMode === "light" ? "blue.900" : undefined}
              _hover={{
                transform: "scale(1.05)",
                bg: colorMode === "light" ? "blue.700" : "cyan.700",
                color: colorMode === "light" ? "white" : "white"
              }}
            >
              {colorMode === "light" ? "Modo Oscuro" : "Modo Claro"}
            </Button>

          </VStack>

        </Box>

        <Divider />


      </VStack>
    </Box>
  );
}
