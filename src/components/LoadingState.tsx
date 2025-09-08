export default function LoadingState() {
  return (
    <div className="bg-white rounded-lg shadow p-8 flex justify-center items-center h-64">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 bg-blue-100 rounded-full mb-4"></div>
        <div className="h-4 bg-blue-100 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-blue-100 rounded w-1/2"></div>
      </div>
    </div>
  );
}
