const API_BASE_URL = 'http://127.0.0.1:8000/vulnet/api/v1/vulnerabilities';

export const fetchVulnerabilities = async (ecosystem, packageName) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${ecosystem}/${packageName}/`, {
            method: 'POST',  // Importante: OSV.dev solo acepta POST
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({}) // Se necesita un cuerpo vacío para OSV.dev
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos de OSV');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};
