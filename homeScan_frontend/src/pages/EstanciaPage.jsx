import React, { useState, useEffect } from 'react';
import Estancia from '/src/components/Estancia.jsx';
import { IconButton, useColorMode } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';
import Header from '../components/Header'; // ajusta la ruta según dónde lo coloques
import { Space } from 'lucide-react';
import EstanciaForm from '../components/EstanciaForm';

export default function EstanciaPage() {
    const [estancias, setEstancias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'list'

    // Chakra UI mode
    const { colorMode, toggleColorMode } = useColorMode();
    const modoOscuro = colorMode === 'dark';

    const styles = {
        container: {
            width: '100%',
            maxWidth: '2000px',
            margin: '0 auto',
            padding: '20px',
            backgroundColor: modoOscuro ? '#1a202c' : '#f9f9f9',
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
            backgroundColor: modoOscuro ? '#1a202c' : '#6366f1',
            color: '#fff',
            border: modoOscuro ? '1px solid #fff' : 'none',
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
            backgroundColor: modoOscuro ? '#112240' : '#f0f0f0',
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
            backgroundColor: modoOscuro ? '#112240' : '#fff',
            border: '1px solid #333',
            borderRadius: '8px',
            color: modoOscuro ? '#e0e0e0' : '#666',
        },
        fixedHeader: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 1000,
            backgroundColor: modoOscuro ? '#1a202c' : '#f9f9f9',
            padding: '6px 16px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
        titulo: {
            fontSize: '2rem',
            fontWeight: '600',
            textAlign: 'center',
            color: modoOscuro ? '#edf2f7' : '#1a202c',
            marginBottom: '24px',
        },
    };

    const scrollStyles = {
        containerWithScroll: {
            ...styles.container,
            overflowY: 'auto',
            maxHeight: '100vh',
            paddingTop: '20px', // espacio suficiente para el header fijo
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

            <div style={{
                padding: '20px',
                marginBottom: '24px',
                borderRadius: '8px',
                backgroundColor: modoOscuro ? '#2D3748' : '#FFFFFF',
                textAlign: 'center',
                boxShadow: modoOscuro ? '0 2px 6px rgba(0,0,0,0.6)' : '0 2px 6px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{
                    fontSize: '2.2rem',
                    fontWeight: '700',
                    color: modoOscuro ? '#8CD3E0' : '#1A365D',
                    margin: 0,
                    letterSpacing: '1px',
                    fontFamily: "'Segoe UI', sans-serif",
                }}>
                    ESTANCIAS
                </h1>
            </div>

            {error && <div style={styles.errorMessage}>{error}</div>}

            <div style={styles.refreshButtonContainer}>
                <button
                    style={styles.refreshButton}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? "Cerrar formulario" : "Crear nueva estancia"}
                </button>
                <button
                    style={{
                        ...styles.refreshButton,
                        marginLeft: '10px',
                        backgroundColor: modoOscuro ? '#4A5568' : '#3182CE'
                    }}
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                >
                    {viewMode === 'grid' ? 'Lista' : 'Columnas'}
                </button>
            </div>
            {showForm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <div style={{
                        backgroundColor: modoOscuro ? '#2D3748' : '#FFFFFF',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        width: '90%',
                        maxWidth: '600px',
                        zIndex: 2000,
                    }}>
                        <EstanciaForm
                            onEstanciaCreated={fetchEstancias}
                            onClose={() => setShowForm(false)}
                        />
                    </div>
                </div>
            )}

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
                <div style={viewMode === 'grid' ? styles.estanciasGrid : { display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {estancias.map((estancia) => (
                        <Estancia
                            key={estancia.id}
                            estancia={estancia}
                            onDelete={handleDelete}
                            modoOscuro={modoOscuro}
                            vista={viewMode === 'grid' ? 'columna' : 'lista'}
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
