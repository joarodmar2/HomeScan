import React from 'react';
import { Link } from 'react-router-dom';
import { useColorMode } from '@chakra-ui/react';
import { FiSun, FiMoon } from 'react-icons/fi';

const LandingPage = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <div className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${colorMode === "light"
            ? "bg-white text-gray-900"
            : "bg-gradient-to-br from-gray-900 via-black to-gray-900 text-[#8CD3E0]"
            }`}>
            {/* Header */}
            <header className="w-full py-6 px-10 flex justify-between items-center border-b border-gray-700">
                <h1
                    className={`text-3xl font-bold tracking-wide ${colorMode === "dark" ? "text-[#8CD3E0]" : "text-[#1A365D]"}`}
                >
                    Información
                </h1>

            </header>

            {/* Hero */}
            <main className="flex flex-col items-center justify-center flex-1 px-4 text-center">
                <h2 className="text-4xl sm:text-6xl font-extrabold mb-6">
                    Gestión inteligente de <span className={`${colorMode === "dark" ? "text-[#8CD3E0]" : "text-[#1A36D6]"}`}>vulnerabilidades</span>
                </h2>
                <p className="text-lg sm:text-xl max-w-xl mb-8 text-gray-300">
                    Descubre, analiza y controla la seguridad de tu infraestructura desde una sola plataforma.
                </p>
                <div className="space-x-4">
                    <Link to="/dashboard" className="px-6 py-3 bg-[#1A36D6] text-white font-semibold rounded hover:bg-blue-900 transition">
                        Ir al Dashboard
                    </Link>
                </div>
            </main>

            {/* Instrucciones en columnas */}
            <section className={`${colorMode === "light" ? "bg-gray-100 text-gray-800" : "bg-gray-950 text-gray-200"} py-12 px-4`}>
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className={`${colorMode === "light" ? "bg-white" : "bg-gray-900"} p-6 rounded-lg shadow-md hover:shadow-[0_0_20px_rgba(26,54,214,0.4)] transition-shadow`}>
                        <h3 className={`text-xl font-semibold mb-4 ${colorMode === "dark" ? "text-[#8CD3E0]" : "text-[#1A36D6]"}`}>1. Añade tus dispositivos</h3>
                        <p className={`${colorMode === "dark" ? "text-gray-300" : ""}`}>Importa o crea los dispositivos que forman parte de tu red: routers, PCs, servidores, cámaras y más.</p>
                    </div>
                    <div className={`${colorMode === "light" ? "bg-white" : "bg-gray-900"} p-6 rounded-lg shadow-md hover:shadow-[0_0_20px_rgba(26,54,214,0.4)] transition-shadow`}>
                        <h3 className={`text-xl font-semibold mb-4 ${colorMode === "dark" ? "text-[#8CD3E0]" : "text-[#1A36D6]"}`}>2. Diseña la estancia</h3>
                        <p className={`${colorMode === "dark" ? "text-gray-300" : ""}`}>Organiza el espacio a tu gusto arrastrando los elementos sobre el plano: mesas, sillas, racks, etc.</p>
                    </div>
                    <div className={`${colorMode === "light" ? "bg-white" : "bg-gray-900"} p-6 rounded-lg shadow-md hover:shadow-[0_0_20px_rgba(26,54,214,0.4)] transition-shadow`}>
                        <h3 className={`text-xl font-semibold mb-4 ${colorMode === "dark" ? "text-[#8CD3E0]" : "text-[#1A36D6]"}`}>3. Comprueba vulnerabilidades</h3>
                        <p className={`${colorMode === "dark" ? "text-gray-300" : ""}`}>Accede al panel de análisis para visualizar los riesgos y puntos débiles detectados por estancia.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full py-4 text-center text-sm text-gray-500 border-t border-gray-700">
                © {new Date().getFullYear()} alba-Assistant. Todos los derechos reservados.
            </footer>
        </div>
    );
};

export default LandingPage;