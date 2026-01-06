

interface Props {
  lastSeed: number | null;
  onGenerate: () => void;
}

export default function RandomSeedGenerator({ lastSeed, onGenerate }: Props) {
  return (
    <div>
      <h2 className="text-lg font-bold">🎲 Generador de número aleatorio</h2>
      <p>Last Random Seed: <strong>{lastSeed ?? "—"}</strong></p>
      <button
        onClick={onGenerate}
        className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded"
      >
        Simulate new seed
      </button>
    </div>
  );
}
