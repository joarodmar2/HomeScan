import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createDevice, deleteDevice, getDevice, updateDevice, getDeviceTypes, getDeviceCapabilities } from "../api/devices.api";
import { toast } from "react-hot-toast";
import { useColorMode, IconButton, Flex } from "@chakra-ui/react";
import { getDeviceModels } from "../api/devices.api";
import { FaSun, FaMoon } from "react-icons/fa";

// ----- Styles helper -----
const getStyles = (dark) => ({
  container: {
    maxWidth: '480px',
    margin: '1.5rem auto',
    padding: '0 1rem',
    color: dark ? '#ffffff' : '#1f2937',
    backgroundColor: 'transparent',
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
    textAlign: 'center',
    width: '100%',
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
    borderRadius: '0',
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

function DeviceForm({ register, errors, device_types, device_capab, styles }) {
  return (
    <>
      {/* Modelo */}
      <div style={styles.field}>
        <label htmlFor="model" style={styles.label}>Modelo</label>
        <input
          type="text"
          id="model"
          {...register("model", { required: true })}
          style={styles.input}
          placeholder="Ingrese el modelo del dispositivo"
        />
        {errors.model && <p style={styles.error}>Este campo es obligatorio</p>}
      </div>

      {/* Tipo */}
      <div style={styles.field}>
        <label htmlFor="type" style={styles.label}>Tipo de Dispositivo</label>
        <select
          id="type"
          {...register("type", { required: true })}
          style={styles.select}
          defaultValue=""
        >
          <option value="" disabled hidden>Seleccione un tipo</option>
          {device_types.map((protocol, i) => (
            <option key={i} value={protocol}>{protocol}</option>
          ))}
        </select>
        {errors.type && <p style={styles.error}>Este campo es obligatorio</p>}
      </div>

      {/* Categoría */}
      <div style={styles.field}>
        <label htmlFor="category" style={styles.label}>Categoría</label>
        <select
          id="category"
          {...register("category", { required: true })}
          style={styles.select}
          defaultValue=""
        >
          <option value="" disabled hidden>Seleccione una categoría</option>
          {device_capab.map((cap, i) => (
            <option key={i} value={cap}>{cap}</option>
          ))}
        </select>
        {errors.category && <p style={styles.error}>Este campo es obligatorio</p>}
      </div>
    </>
  );
}

export function DevicesFormPage() {
  const [isShown, setIsShown] = useState(false);
  const [device_models, setDeviceModels] = useState([]);
  const [device_types, setDeviceTypes] = useState([]);
  const [device_capab, setDeviceCapab] = useState([]);
  const { colorMode, toggleColorMode } = useColorMode();
  const modoOscuro = colorMode === 'dark';

  const styles = getStyles(modoOscuro);

  useEffect(() => {
    async function loadDeviceModels() {
      const res = await getDeviceModels();
      setDeviceModels(res.data["models"]);
    }
    loadDeviceModels();
  }, []);

  useEffect(() => {
    async function loadDeviceTypes() {
      const res = await getDeviceTypes();
      setDeviceTypes(res.data["types"]);
    }
    loadDeviceTypes();
  }, []);


  useEffect(() => {
    async function loadDeviceCapab() {
      const res = await getDeviceCapabilities();
      setDeviceCapab(res.data["capabilities"]);
    }
    loadDeviceCapab();
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
      await updateDevice(params.id, data);
      toast.success("Device updated", {
        position: "bottom-right",
        style: {
          background: "#101010",
          color: "#fff",
        },
      });
    } else {
      console.log("Datos enviados al backend:", data);

      await createDevice(data);
      toast.success("New Device Added", {
        position: "bottom-right",
        style: {
          background: "#101010",
          color: "#fff",
        },
      });
    }

    navigate("/devices");
  });

  useEffect(() => {
    async function loadDevice() {
      if (params.id) {
        const { data } = await getDevice(params.id);
        setValue("model", data.model);
        setValue("type", data.type);
        setValue("category", data.category);

      }
    }
    loadDevice();
  }, []);



  return (

    <div style={styles.container}>
      <Flex style={styles.header}>
        <h1 style={styles.title}>
          Dispositivo
        </h1>

      </Flex>
      <form onSubmit={onSubmit}>
        <DeviceForm register={register} errors={errors} device_types={device_types} device_capab={device_capab} styles={styles} />
        {params.id ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
            <button
              type="submit"
              style={{
                backgroundColor: '#10B981',
                color: '#ffffff',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                width: '12rem',
                cursor: 'pointer',
                border: 'none',
                transition: 'background-color 0.3s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#10B981')}
            >
              Guardar Cambios
            </button>
            <button
              style={{
                ...styles.deleteBtn,
                transition: 'background-color 0.3s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#DC2626')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#EF4444')}
              onClick={async () => {
                const accepted = window.confirm("Are you sure?");
                if (accepted) {
                  await deleteDevice(params.id);
                  toast.success("Device Removed", {
                    position: "bottom-right",
                    style: {
                      background: "#101010",
                      color: "#fff",
                    },
                  });
                  navigate("/devices");
                }
              }}
            >
              Eliminar
            </button>
          </div>
        ) : (
          <button
            type="submit"
            style={{
              backgroundColor: '#4F46E5',
              color: '#ffffff',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              width: '100%',
              marginTop: '1rem',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            Guardar
          </button>
        )}
      </form>
    </div>
  );
}