import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  VStack,
  Divider,
  useColorModeValue
} from "@chakra-ui/react";
import { Image } from '@chakra-ui/react';
import { Space } from "lucide-react";

import {
  FiCpu,
  FiLink,
  FiActivity,
  FiHome,
  FiMenu,
  FiDownload,
  FiBarChart2,
  FiPlusSquare,
  FiPlus,
  FiAlertTriangle
} from "react-icons/fi";

import { Link } from "react-router-dom";


export function Navigation({ onClose, ...rest }) {
  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
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
        <IconButton
          display={{ base: "flex", md: "none" }}
          onClick={onClose}
          variant="outline"
          aria-label="close menu"
          icon={<FiMenu />}
        />
      </Flex>

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
              colorScheme="blue"
              fontFamily="'Inter', 'Segoe UI', sans-serif"
            >
              Estancias
            </Button>
            <Button
              as={Link}
              to="/connections"
              leftIcon={<FiLink />}
              justifyContent="flex-start"
              variant="ghost"
              colorScheme="blue"
              fontFamily="'Inter', 'Segoe UI', sans-serif"
            >
              Conexiones
            </Button>
            <Button
              as={Link}
              to="/dashboard"
              leftIcon={<FiBarChart2 />}
              justifyContent="flex-start"
              variant="ghost"
              colorScheme="blue"
              fontFamily="'Inter', 'Segoe UI', sans-serif"
            >Dashboard
            </Button>
            <Button
              as={Link}
              to="/devices"
              leftIcon={<FiCpu />}
              justifyContent="flex-start"
              variant="ghost"
              colorScheme="blue"
              fontFamily="'Inter', 'Segoe UI', sans-serif"
            >Dispositivos
            </Button>

          </VStack>

        </Box>

        <Divider />


      </VStack>
    </Box>
  );
}
