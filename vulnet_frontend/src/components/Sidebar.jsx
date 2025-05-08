import {
    Box,
    Flex,
    Icon,
    Link,
    Text,
    VStack,
    useColorModeValue
} from "@chakra-ui/react";
import { FiHome, FiGrid } from "react-icons/fi";
import { NavLink } from "react-router-dom";

const links = [
    { name: "Dashboard", icon: FiHome, path: "/" },
    { name: "Devices", icon: FiGrid, path: "/devices" },
];

export default function Sidebar() {
    const sidebarBg = useColorModeValue("white", "gray.900");
    const activeBg = useColorModeValue("gray.100", "gray.700");

    return (
        <Box
            as="nav"
            position="fixed"
            left={0}
            top={0}
            w={{ base: "full", md: "250px" }}
            h="100vh"
            bg={sidebarBg}
            borderRightWidth="1px"
            boxShadow="md"
            zIndex={10}
            p={6}
        >
            <Text fontSize="2xl" fontWeight="bold" mb={8}>
                alba-Assistant
            </Text>
            <VStack spacing={4} align="stretch">
                {links.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        style={({ isActive }) => ({
                            background: isActive ? activeBg : "transparent",
                            borderRadius: "lg",
                            display: "flex",
                            alignItems: "center",
                            padding: "10px 12px",
                            fontWeight: "500",
                            gap: "12px",
                            color: isActive ? "#2B6CB0" : "inherit",
                            textDecoration: "none"
                        })}
                    >
                        <Icon as={link.icon} boxSize={5} />
                        {link.name}
                    </NavLink>
                ))}
            </VStack>
        </Box>
    );
}
