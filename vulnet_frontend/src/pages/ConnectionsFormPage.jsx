import { useEffect, useState } from "react";
import { useColorMode, IconButton, Flex } from "@chakra-ui/react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createConnection, deleteConnection, getConnection, updateConnection, getConnectionProtocols } from "../api/connections.api";
import { getDeviceModels } from "../api/devices.api";
import { toast } from "react-hot-toast";

// ----- Styles helper -----
const getStyles = (dark) => ({
  container: {
    maxWidth: '480px',
    margin: '1.5rem auto',
    padding: '0 1rem',
    color: dark ? '#ffffff' : '#1f2937',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 600,
  },
  field: {
    marginBottom: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 500,
    marginBottom: '0.25rem',
    color: dark ? '#ffffff' : '#1f2937',
  },
  input: {
    backgroundColor: dark ? '#23232d' : 'transparent',
    border: `1px solid ${dark ? '#4B5563' : '#D1D5DB'}`,
    padding: '0.5rem 0.25rem',
    color: dark ? '#ffffff' : '#1f2937',
    outline: 'none',
  },
  select: {
    backgroundColor: dark ? '#23232d' : 'transparent',
    border: `1px solid ${dark ? '#4B5563' : '#D1D5DB'}`,
    padding: '0.5rem 0.25rem',
    color: dark ? '#ffffff' : '#1f2937',
    outline: 'none',
  },
  error: {
    marginTop: '0.25rem',
    fontSize: '0.75rem',
    color: '#F87171',
  },
  submitBtn: {
    width: '100%',
    padding: '0.5rem',
    fontWeight: 500,
    background: 'none',
    color: dark ? '#ffffff' : '#4F46E5',
    border: 'none',
    cursor: 'pointer',
  },
  deleteBtn: {
    backgroundColor: '#EF4444',
    color: '#ffffff',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    width: '12rem',
    marginTop: '0.75rem',
    cursor: 'pointer',
    border: 'none',
  },
});
// -------------------------

function ConnectionForm({ register, errors, deviceModels, connProtocols, styles }) {
  return (
    <>
      {/* Tipo de protocolo */}
      <div style={styles.field}>
        <label htmlFor="type" style={styles.label}>Tipo de Protocolo</label>
        <select
          id="type"
          {...register("type", { required: true })}
          style={styles.select}
          defaultValue=""
        >
          <option value="" disabled hidden>Seleccione un protocolo</option>
          {connProtocols.map((p, i) => (
            <option key={i} value={p}>{p}</option>
          ))}
        </select>
        {errors.type && <p style={styles.error}>Este campo es obligatorio</p>}
      </div>

      {/* Primer dispositivo */}
      <div style={styles.field}>
        <label htmlFor="first_device" style={styles.label}>Primer Dispositivo</label>
        <select
          id="first_device"
          {...register("first_device", { required: true })}
          style={styles.select}
          defaultValue=""
        >
          <option value="" disabled hidden>Seleccione un dispositivo</option>
          {deviceModels.map((m, i) => (
            <option key={i} value={m}>{m}</option>
          ))}
        </select>
        {errors.first_device && <p style={styles.error}>Este campo es obligatorio</p>}
      </div>

      {/* Segundo dispositivo */}
      <div style={styles.field}>
        <label htmlFor="second_device" style={styles.label}>Segundo Dispositivo</label>
        <select
          id="second_device"
          {...register("second_device", { required: true })}
          style={styles.select}
          defaultValue=""
        >
          <option value="" disabled hidden>Seleccione un dispositivo</option>
          {deviceModels.map((m, i) => (
            <option key={i} value={m}>{m}</option>
          ))}
        </select>
        {errors.second_device && <p style={styles.error}>Este campo es obligatorio</p>}
      </div>
    </>
  );
}

export function ConnectionsFormPage() {
  const [isShown, setIsShown] = useState(false);
  const [device_models, setDeviceModels] = useState([]);
  const [conn_protocols, setConnProtocols] = useState([]);
  const { colorMode, toggleColorMode } = useColorMode();
  const modoOscuro = colorMode === 'dark';

  const styles = getStyles(modoOscuro);

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
    <div style={styles.container}>
      <Flex style={styles.header} alignItems="center" mb={6}>
        <h1 style={styles.title}>
          Formulario de Conexiones
        </h1>
        <IconButton
          icon={modoOscuro ? <FaSun /> : <FaMoon />}
          onClick={toggleColorMode}
          aria-label="Toggle color mode"
          variant="ghost"
          size="md"
        />
      </Flex>
      <form onSubmit={onSubmit}>
        <ConnectionForm register={register} errors={errors} deviceModels={device_models} connProtocols={conn_protocols} styles={styles} />
        <button
          type="submit"
          style={styles.submitBtn}
        >
          Guardar
        </button>
      </form>
      {params.id && (
        <div className="flex justify-end">
          <button
            style={styles.deleteBtn}
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
    </div>
  );
}