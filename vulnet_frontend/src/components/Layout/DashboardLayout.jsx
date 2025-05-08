import { Box } from "@chakra-ui/react";
import Sidebar from "../Sidebar";

export default function DashboardLayout({ children }) {
    return (
        <Box minH="100vh" pl={{ base: 0, md: "250px" }} bg="gray.50">
            <Sidebar />
            <Box p={6}>{children}</Box>
        </Box>
    );
}
