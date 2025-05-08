// src/theme/index.js
import { extendTheme } from "@chakra-ui/react";

// Paleta de colores personalizada (puedes adaptarla si quieres)
const colors = {
  brand: {
    50: "#e3f2ff",
    100: "#b3d4ff",
    200: "#81b6ff",
    300: "#4f97ff",
    400: "#1d78ff",
    500: "#045fe6",
    600: "#004ab4",
    700: "#003682",
    800: "#002150",
    900: "#000c21",
  },
};

// Configuración base del tema
const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

// Extiende el tema con tus colores y configuración
const customTheme = extendTheme({ colors, config });

export default customTheme;
