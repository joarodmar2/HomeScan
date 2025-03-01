import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Objects = () => {
  const [objetos, setObjetos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const [mensajeExito, setMensajeExito] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    first_device: '',
    second_device: '',
    third_device: ''
  });
  useEffect(() => {
    fetchObjetos();
  }, []);
  const fetchObjetos = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/vulnet/api/v1/objects/');
      setObjetos(response.data);
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
    try {
      await axios.post('http://127.0.0.1:8000/vulnet/api/v1/createobject/', formData);
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
    console.log("Objeto seleccionado:", objeto); // Ver qué datos llegan
    setSelectedObject(objeto);
    setFormData({
      name: objeto.name,
      type: objeto.type,
      first_device: objeto.first_device?.model || '',
      second_device: objeto.second_device?.model || '',
      third_device: objeto.third_device?.model || '',
    });
    setShowModal(true);
  };

  const handleEdit = () => {
    setShowForm(true);
    setShowModal(false);
  };

  return (
    <div className="bg-black text-white min-h-screen p-4 flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4">Listado objetos salón</h2>
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
          <div className="bg-gray-800 p-6 rounded w-1/2">
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

      {/* Modal para opciones de edición y eliminación */}
      {showModal && selectedObject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded w-1/3">
            <h3 className="text-xl mb-4">{selectedObject.name}</h3>
            <div className="flex justify-around">
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
              onClick={() => setShowModal(false)}
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
