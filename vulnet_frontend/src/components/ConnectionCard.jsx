import { useNavigate } from "react-router-dom";

export function ConnectionCard({ connection }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-slate-800 p-3 hover:bg-slate-700 hover:cursor-pointer rounded-lg"
      onClick={() => {
        navigate(`/connections/${connection.id}`);
      }}
    >
      <h1 className="text-white font-bold uppercase rounded-lg">
        {connection.type}
      </h1>
      <p className="text-slate-400">{connection.first_device.model}</p>
      <p className="text-slate-400">{connection.second_device.model}</p>
    </div>
  );
}