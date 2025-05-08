import { Box, VStack, Link, Text } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
    return (
        <Box
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="100vh"
            bg="gray.900"
            color="white"
            p={5}
        >
            <Text fontSize="xl" fontWeight="bold" mb={6}>alba-Assistant</Text>
            <VStack spacing={4} align="start">
                <Link as={NavLink} to="/dashboard">Dashboard</Link>
                <Link as={NavLink} to="/devices">Devices</Link>
                {/* Añade más links si necesitas */}
            </VStack>
        </Box>
    );
}
