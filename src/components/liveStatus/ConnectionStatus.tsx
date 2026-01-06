
interface Props {
  connections: number;
}

export default function ConnectionStatus({ connections }: Props) {
  const isConnected = connections > 0;
  return (
    <div>
      <h2 className="text-lg font-bold">🔌 Estado de conexión</h2>
      <p className={isConnected ? "text-green-400" : "text-red-500"}>
        {isConnected ? "⚡ 1+ devices connected" : "🔌 0 devices connected"}
      </p>
    </div>
  );
}
