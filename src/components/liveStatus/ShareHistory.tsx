
interface Props {
  shareTimestamps: number[];
  elapsed: string;
}

export default function ShareHistory({ shareTimestamps, elapsed }: Props) {
  return (
    <div>
      <h2 className="text-lg font-bold">📊 Historial de shares</h2>
      <p>Última share: <strong>{elapsed}</strong></p>
      <ul className="text-sm mt-2 max-h-32 overflow-auto">
        {shareTimestamps.slice(-5).reverse().map((ts, i) => (
          <li key={i}>• {new Date(ts).toLocaleTimeString()}</li>
        ))}
      </ul>
    </div>
  );
}
