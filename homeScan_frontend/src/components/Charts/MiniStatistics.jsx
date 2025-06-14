import {
    Box,
    Flex,
    Text,
    Stat,
    StatLabel,
    StatNumber,
    Icon,
    useColorModeValue
} from "@chakra-ui/react";

export default function MiniStatistics({ title, value, icon, iconColor }) {
    const bgColor = useColorModeValue("white", "gray.800");

    return (
        <Box
            bg={bgColor}
            p={5}
            borderRadius="xl"
            boxShadow="md"
            w="100%"
        >
            <Flex justify="space-between" align="center">
                <Box>
                    <Stat>
                        <StatLabel fontSize="sm" color="gray.500">{title}</StatLabel>
                        <StatNumber fontSize="2xl" color="blue.400">{value}</StatNumber>
                    </Stat>
                </Box>
                <Flex
                    align="center"
                    justify="center"
                    w={12}
                    h={12}
                    borderRadius="full"
                    bg={iconColor || "blue.100"}
                >
                    <Icon as={icon} boxSize={6} color="blue.500" />
                </Flex>
            </Flex>
        </Box>
    );
}
