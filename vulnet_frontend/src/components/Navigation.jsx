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
          <Text fontSize="2xl" fontWeight="bold" ml="2">
            DataViz
          </Text>
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
        <Box>
          <Text fontWeight="bold" mb={2} fontSize="sm" color="gray.500">
            MENÚ PRINCIPAL
          </Text>

          <VStack spacing={2} align="stretch">



            <Text fontWeight="bold" mb={2} fontSize="sm" color="gray.500">
              Estos dos se borraran
            </Text>
            <Button as={Link} to="/device-create" colorScheme="gray" variant="solid">
              Create Device
            </Button>
            <Button as={Link} to="/connection-create" colorScheme="gray" variant="solid">
              Create Connection
            </Button>

            <Button
              as={Link}
              to="/Estancia"
              leftIcon={<FiHome />}
              justifyContent="flex-start"
              variant="ghost"
              colorScheme="blue"
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
            >
              Conexiones
            </Button>
            <Button
              as={Link}
              to="/graph"
              leftIcon={<FiActivity />}
              justifyContent="flex-start"
              variant="ghost"
              colorScheme="blue"
            >
              Grafo de Conexiones
            </Button>
            <Button
              as={Link}
              to="/dashboard"
              leftIcon={<FiBarChart2 />}
              justifyContent="flex-start"
              variant="ghost"
              colorScheme="blue"
            >Dashboard
            </Button>
            <Button
              as={Link}
              to="/devices"
              leftIcon={<FiCpu />}
              justifyContent="flex-start"
              variant="ghost"
              colorScheme="blue"
            >Dispositivos
            </Button>

          </VStack>

        </Box>

        <Divider />

        <Box mt="auto" pb={4}>
          <Button leftIcon={<FiDownload />} colorScheme="blue" variant="outline" w="full">
            Exportar Datos
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
