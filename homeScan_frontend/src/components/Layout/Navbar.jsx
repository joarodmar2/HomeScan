import { Box, Flex, Text } from '@chakra-ui/react';

export default function Navbar() {
    return (
        <Flex
            as="header"
            w="full"
            px={6}
            h="16"
            align="center"
            justify="space-between"
            bg="gray.100"
            borderBottom="1px"
            borderColor="gray.200"
        >
            <Text fontWeight="semibold">Panel de Administración</Text>
        </Flex>
    );
}
