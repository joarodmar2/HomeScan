import { useEffect, useState } from "react";
import { useColorMode, IconButton, Flex } from "@chakra-ui/react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createConnection, deleteConnection, getConnection, updateConnection, getConnectionProtocols } from "../api/connections.api";
import { getDeviceModels } from "../api/devices.api";
import { toast } from "react-hot-toast";

export function ConnectionsFormPage() {
  const [isShown, setIsShown] = useState(false);
  const [device_models, setDeviceModels] = useState([]);
  const [conn_protocols, setConnProtocols] = useState([]);
  const { colorMode, toggleColorMode } = useColorMode();
  const modoOscuro = colorMode === 'dark';

  // Eliminado el manejo manual de darkMode y sincronización de localStorage/document.documentElement


  useEffect(() => {
    async function loadDeviceModels() {
      const res = await getDeviceModels();
      setDeviceModels(res.data["models"]);
    }
    loadDeviceModels();
  }, []);


  useEffect(() => {
    async function loadConnProtocols() {
      const res = await getConnectionProtocols();
      setConnProtocols(res.data["protocols"]);
    }
    loadConnProtocols();
  }, []);


  const handleClick = event => {
    setIsShown(current => !current);

  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const params = useParams();

  const onSubmit = handleSubmit(async (data) => {
    if (params.id) {
      await updateConnection(params.id, data);
      toast.success("Connection updated", {
        position: "bottom-right",
        style: {
          background: "#101010",
          color: "#fff",
        },
      });
    } else {
      await createConnection(data);
      toast.success("New Connection Added", {
        position: "bottom-right",
        style: {
          background: "#101010",
          color: "#fff",
        },
      });
    }

    navigate("/connections");
  });

  useEffect(() => {
    async function loadConnection() {
      if (params.id) {
        const { data } = await getConnection(params.id);
        setValue("type", data.type);
        setValue("first_device", data.first_device.model);
        setValue("second_device", data.second_device.model);

      }
    }
    loadConnection();
  }, []);



  return (
    <div className="max-w-md mx-auto mt-6">
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Formulario de Conexiones
        </h1>
        <IconButton
          icon={modoOscuro ? <FaSun /> : <FaMoon />}
          onClick={toggleColorMode}
          aria-label="Toggle color mode"
          isRound
          size="md"
        />
      </Flex>
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-white">Tipo de Protocolo</label>
          <select
            id="type"
            {...register("type", { required: true })}
            className="block w-full bg-transparent border-b border-gray-300 dark:border-gray-600 py-2 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition text-gray-900 dark:text-white"
            defaultValue=""
          >
            <option value="" disabled hidden>Seleccione un protocolo</option>
            {conn_protocols.map((protocol, i) => (
              <option key={i} value={protocol}>{protocol}</option>
            ))}
          </select>
          {errors.type && <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>}
        </div>

        <div>
          <label htmlFor="first_device" className="block text-sm font-medium text-gray-700 dark:text-white">Primer Dispositivo</label>
          <select
            id="first_device"
            {...register("first_device", { required: true })}
            className="block w-full bg-transparent border-b border-gray-300 dark:border-gray-600 py-2 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition text-gray-900 dark:text-white"
            defaultValue=""
          >
            <option value="" disabled hidden>Seleccione un dispositivo</option>
            {device_models.map((model, i) => (
              <option key={i} value={model}>{model}</option>
            ))}
          </select>
          {errors.first_device && <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>}
        </div>

        <div>
          <label htmlFor="second_device" className="block text-sm font-medium text-gray-700 dark:text-white">Segundo Dispositivo</label>
          <select
            id="second_device"
            {...register("second_device", { required: true })}
            className="block w-full bg-transparent border-b border-gray-300 dark:border-gray-600 py-2 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition text-gray-900 dark:text-white"
            defaultValue=""
          >
            <option value="" disabled hidden>Seleccione un dispositivo</option>
            {device_models.map((model, i) => (
              <option key={i} value={model}>{model}</option>
            ))}
          </select>
          {errors.second_device && <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>}
        </div>

        <button
          type="submit"
          className="w-full text-center text-indigo-600 dark:text-indigo-400 font-medium py-2 hover:text-indigo-500 dark:hover:text-indigo-300 transition"
        >
          Guardar
        </button>
      </form>

      {isShown && (
        <div className="flex justify-center mt-4">
          <button disabled type="button" className="text-gray-700 bg-gray-200 font-medium rounded-md text-sm px-5 py-2.5 inline-flex items-center">
            <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#CBD5E0" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
            </svg>
            Loading...
          </button>
        </div>
      )}

      {params.id && (
        <div className="flex justify-end">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-red-600 transition"
            onClick={async () => {
              const accepted = window.confirm("Are you sure?");
              if (accepted) {
                await deleteConnection(params.id);
                toast.success("Connection Removed", {
                  position: "bottom-right",
                  style: { background: "#101010", color: "#fff" },
                });
                navigate("/connections");
              }
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}