import { useNavigate } from "react-router-dom";

export function DeviceCard({ device }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-slate-800 p-3 hover:bg-slate-700 hover:cursor-pointer rounded-lg"
      onClick={() => {
        navigate(`/devices/${device.id}`);
      }}
    >
      <h1 className="text-white font-bold uppercase rounded-lg">
        {device.model}
      </h1>
      <p className="text-slate-400">{device.type}</p>
    </div>
  );
}