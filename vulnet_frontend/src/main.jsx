import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react';

const theme = extendTheme({
    config: {
        initialColorMode: 'light',
        useSystemColorMode: false,
    },
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <App />
            {/* Footer */}
            <footer className="w-full py-4 text-center text-sm text-gray-500 border-t border-gray-700">
                © {new Date().getFullYear()} alba-Assistant. Todos los derechos reservados.
            </footer>
        </ChakraProvider>
    </React.StrictMode>
);
