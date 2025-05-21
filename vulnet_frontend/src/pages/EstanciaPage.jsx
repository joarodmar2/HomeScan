import React, { useState, useEffect } from 'react';
import Estancia from '/src/components/Estancia.jsx';
import { IconButton, useColorMode } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';
import Header from '../components/Header'; // ajusta la ruta según dónde lo coloques
import { Space } from 'lucide-react';


export default function EstanciaPage() {
    const [estancias, setEstancias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Chakra UI mode
    const { colorMode, toggleColorMode } = useColorMode();
    const modoOscuro = colorMode === 'dark';

    const styles = {
        container: {
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px',
            backgroundColor: modoOscuro ? '#121212' : '#f9f9f9',
            minHeight: '100vh',
            color: modoOscuro ? '#fff' : '#000',
            transition: 'background-color 0.3s ease',
        },
        refreshButtonContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
        },
        refreshButton: {
            padding: '8px 16px',
            backgroundColor: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
        },
        errorMessage: {
            padding: '16px',
            backgroundColor: '#ffebee',
            color: '#c62828',
            border: '1px solid #ffcdd2',
            borderRadius: '4px',
            marginBottom: '20px',
        },
        estanciasGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
        },
        cardSkeleton: {
            border: '1px solid #333',
            borderRadius: '8px',
            padding: '16px',
            backgroundColor: modoOscuro ? '#1e1e1e' : '#f0f0f0',
        },
        skeletonLine: {
            height: '16px',
            backgroundColor: modoOscuro ? '#2e2e2e' : '#ddd',
            borderRadius: '4px',
            marginBottom: '12px',
            width: '80%',
        },
        skeletonLineShort: {
            height: '16px',
            backgroundColor: modoOscuro ? '#2e2e2e' : '#ddd',
            borderRadius: '4px',
            marginBottom: '12px',
            width: '50%',
        },
        skeletonButtons: {
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '16px',
        },
        skeletonButton: {
            height: '32px',
            width: '80px',
            backgroundColor: modoOscuro ? '#2e2e2e' : '#ccc',
            borderRadius: '4px',
        },
        emptyMessage: {
            padding: '24px',
            textAlign: 'center',
            backgroundColor: modoOscuro ? '#1e1e1e' : '#fff',
            border: '1px solid #333',
            borderRadius: '8px',
            color: modoOscuro ? '#ccc' : '#666',
        },
    };

    const scrollStyles = {
        containerWithScroll: {
            ...styles.container, // Mantiene todos los estilos originales del contenedor
            overflowY: 'auto',   // Habilita el scroll vertical
            maxHeight: '100vh', // Limita la altura al tamaño de la ventana
        },
    };



    const fetchEstancias = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("http://localhost:8000/vulnet/api/v1/Estancia/");
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            const data = await response.json();
            setEstancias(data);
        } catch (err) {
            console.error("Error al cargar estancias:", err);
            setError("No se pudieron cargar las estancias. Por favor, intente nuevamente.");

            setEstancias(exampleEstancias);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEstancias();
    }, []);

    const handleRefresh = () => {
        fetchEstancias();
    };

    const handleDelete = (id) => {
        setEstancias(estancias.filter((estancia) => estancia.id !== id));
    };

    return (
        //<div style={styles.container}>
        <div style={scrollStyles.containerWithScroll}>
            <Header title="Estancias" />


            {error && <div style={styles.errorMessage}>{error}</div>}

            {isLoading ? (
                <div style={styles.estanciasGrid}>
                    {[...Array(6)].map((_, index) => (
                        <div key={index} style={styles.cardSkeleton}>
                            <div style={styles.skeletonLine}></div>
                            <div style={styles.skeletonLineShort}></div>
                            <div style={styles.skeletonButtons}>
                                <div style={styles.skeletonButton}></div>
                                <div style={styles.skeletonButton}></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : estancias.length > 0 ? (
                <div style={styles.estanciasGrid}>
                    {estancias.map((estancia) => (
                        <Estancia
                            key={estancia.id}
                            estancia={estancia}
                            onDelete={handleDelete}
                            modoOscuro={modoOscuro}
                        />
                    ))}
                </div>
            ) : (
                <div style={styles.emptyMessage}>
                    No hay estancias disponibles.
                </div>
            )}
        </div>

    );
}
