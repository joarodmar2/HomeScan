import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Objects = () => {
  const [objetos, setObjetos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLargeView, setShowLargeView] = useState(false); // Nuevo estado para la vista grande
  const [selectedObject, setSelectedObject] = useState(null);
  const [mensajeExito, setMensajeExito] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    first_device: '',
    second_device: '',
    third_device: ''
  });
  const location = window.location.pathname.split('/').filter(Boolean);
  const estanciaActual = location.length > 1 ? location[1] : 'desconocida';

  // Formatear la estancia con la primera letra en mayúscula
  const estanciaFormateada = estanciaActual.charAt(0).toUpperCase() + estanciaActual.slice(1);


  useEffect(() => {
    fetchObjetos();
  }, []);

  const fetchObjetos = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/vulnet/api/v1/objects/');

      // Obtener la estancia desde la URL
      const location = window.location.pathname.split('/').filter(Boolean);
      const estanciaActual = location.length > 1 ? location[1] : 'desconocida';

      // Filtrar objetos según la estancia actual
      const objetosFiltrados = response.data.filter(objeto => objeto.type.toLowerCase() === estanciaActual.toLowerCase());

      setObjetos(objetosFiltrados);
    } catch (error) {
      console.error('Error al obtener objetos', error);
    }
  };


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    // Obtener la estancia actual desde la URL
    const location = window.location.pathname.split('/').filter(Boolean);
    const estanciaActual = location.length > 1 ? location[1] : 'desconocida';

    try {
      // Agregar estanciaActual al objeto a enviar
      const nuevoObjeto = { ...formData, type: estanciaActual };

      await axios.post('http://127.0.0.1:8000/vulnet/api/v1/createobject/', nuevoObjeto);

      // Recargar la lista de objetos después de crear uno nuevo
      fetchObjetos();

      setShowForm(false);
      setFormData({ name: '', type: '', first_device: '', second_device: '', third_device: '' });
    } catch (error) {
      console.error('Error al crear objeto', error);
    }
  };


  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedObject) return;

    try {
      await axios.put(`http://127.0.0.1:8000/vulnet/api/v1/updateobject/${selectedObject.id}/`, formData);
      fetchObjetos();
      setShowForm(false);
      setSelectedObject(null);
      setMensajeExito('Objeto actualizado correctamente');

      setTimeout(() => {
        setMensajeExito('');
      }, 3000);
    } catch (error) {
      console.error('Error al actualizar objeto', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedObject) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/vulnet/api/v1/deleteobject/${selectedObject.id}/`);
      fetchObjetos();
      setShowModal(false);
      setSelectedObject(null);
    } catch (error) {
      console.error('Error al eliminar objeto', error);
    }
  };

  const handleSelectObject = (objeto) => {
    setSelectedObject(objeto);
    setShowLargeView(true);  // Abre la vista grande cuando se selecciona un objeto
  };

  const handleCloseLargeView = () => {
    setShowLargeView(false);  // Cierra la vista grande
  };

  const handleEdit = () => {

    setFormData({
      name: selectedObject.name,
      type: selectedObject.type,
      first_device: selectedObject.first_device?.model || '',
      second_device: selectedObject.second_device?.model || '',
      third_device: selectedObject.third_device?.model || '',
    });

    setShowForm(true);
    setShowLargeView(false);
  };

  return (
    <div className="bg-black text-white min-h-screen p-4 flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4">Listado de objetos en {estanciaFormateada}</h2>
      {mensajeExito && (
        <div className="bg-green-500 text-white p-2 rounded mb-4">
          {mensajeExito}
        </div>
      )}
      <div className="space-y-4 w-1/2">
        {objetos.length > 0 ? (
          objetos.map((objeto) => (
            <button
              key={objeto.id}
              className="bg-gray-800 p-3 rounded text-center w-full hover:bg-gray-700"
              onClick={() => handleSelectObject(objeto)}
            >
              {objeto.name}
            </button>
          ))
        ) : (
          <p>No hay objetos registrados.</p>
        )}
      </div>

      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={() => {
            setShowForm(true);
            setSelectedObject(null);
            setFormData({ name: '', type: '', first_device: '', second_device: '', third_device: '' });
          }}
          className="bg-gray-700 px-4 py-2 rounded"
        >
          Añadir nuevo objeto
        </button>
      </div>

      {/* Modal para formulario de creación y edición */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded w-3/4">
            <h3 className="text-xl mb-4">{selectedObject ? 'Editar Objeto' : 'Formulario Nuevo Objeto'}</h3>
            <form onSubmit={selectedObject ? handleUpdate : handleCreate}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre"
                className="bg-gray-600 text-white p-2 mb-4 w-full rounded"
              />
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="Tipo"
                className="bg-gray-600 text-white p-2 mb-4 w-full rounded"
              />
              <input
                type="text"
                name="first_device"
                value={formData.first_device}
                onChange={handleChange}
                placeholder="Primer Dispositivo"
                className="bg-gray-600 text-white p-2 mb-4 w-full rounded"
              />
              <input
                type="text"
                name="second_device"
                value={formData.second_device}
                onChange={handleChange}
                placeholder="Segundo Dispositivo"
                className="bg-gray-600 text-white p-2 mb-4 w-full rounded"
              />
              <input
                type="text"
                name="third_device"
                value={formData.third_device}
                onChange={handleChange}
                placeholder="Tercer Dispositivo"
                className="bg-gray-600 text-white p-2 mb-4 w-full rounded"
              />
              <button type="submit" className="bg-gray-700 px-4 py-2 rounded">
                {selectedObject ? 'Actualizar' : 'Crear'}
              </button>
            </form>
            <button onClick={() => setShowForm(false)} className="mt-4 text-red-500">
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Vista grande para el objeto seleccionado */}
      {showLargeView && selectedObject && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
          <div className="bg-gray-800 p-8 rounded w-3/4">
            <h3 className="text-2xl mb-4">{selectedObject.name}</h3>
            <p><strong>Tipo:</strong> {selectedObject.type}</p>
            <p><strong>Dispositivos:</strong></p>
            <ul>
              {/* Log para ver el contenido de los dispositivos */}
              {console.log('selectedObject:', selectedObject)}
              {selectedObject.first_device && selectedObject.first_device.model && (
                <li>{selectedObject.first_device.model}</li>
              )}
              {selectedObject.second_device && selectedObject.second_device.model && (
                <li>{selectedObject.second_device.model}</li>
              )}
              {selectedObject.third_device && selectedObject.third_device.model && (
                <li>{selectedObject.third_device.model}</li>
              )}
            </ul>
            <div className="flex justify-around mt-6">
              <button
                className="bg-yellow-500 px-4 py-2 rounded"
                onClick={handleEdit}
              >
                Editar
              </button>
              <button
                className="bg-red-500 px-4 py-2 rounded"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
            <button
              onClick={handleCloseLargeView}
              className="mt-4 text-white underline"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}



    </div>
  );
};

export default Objects;
