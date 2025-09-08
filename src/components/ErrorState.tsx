interface ErrorStateProps {
  error: string;
  loadData: (force?: boolean) => void;
}

export default function ErrorState({ error, loadData }: ErrorStateProps) {
  return (
    <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center justify-center h-64">
      <div className="text-red-500 mb-4">⚠️</div>
      <p className="text-red-500 mb-4">{error}</p>
      <button
        onClick={() => loadData(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Retry
      </button>
    </div>
  );
}
