import {
    Flex,
    Heading,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Avatar,
    HStack,
    useColorMode,
    useColorModeValue,
} from "@chakra-ui/react";
import { FiSearch, FiBell, FiMenu } from "react-icons/fi";
import { FaMoon, FaSun } from "react-icons/fa";

export default function Header({ title = "Panel", onOpenDrawer }) {
    const { colorMode, toggleColorMode } = useColorMode();
    const cardBg = useColorModeValue("white", "gray.800");

    return (
        <Flex
            ml={{ base: 0, md: 0 }}
            px={4}
            height="20"
            alignItems="center"
            bg={cardBg}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue("gray.200", "gray.700")}
            justifyContent="space-between"
            position="sticky"
            top="0"
            zIndex="999"
        >
            <IconButton
                display={{ base: "flex", md: "none" }}
                onClick={onOpenDrawer}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Heading size="lg" fontWeight="bold">
                {title.toUpperCase()}
            </Heading>

            <HStack spacing={4}>

                <IconButton
                    aria-label="Alternar modo claro/oscuro"
                    icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
                    onClick={toggleColorMode}
                    variant="ghost"
                    size="md"
                />


            </HStack>
        </Flex>
    );
}
