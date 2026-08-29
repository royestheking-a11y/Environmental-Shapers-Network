import { useRouteError, isRouteErrorResponse, Link } from "react-router";
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from "lucide-react";

export function RootErrorBoundary() {
  const error = useRouteError();

  const errorMessage =
    isRouteErrorResponse(error)
      ? `${error.status} ${error.statusText}`
      : error instanceof Error
      ? error.message
      : "An unexpected error occurred.";

  const isChunkError =
    errorMessage.includes("Failed to fetch dynamically imported module") ||
    errorMessage.includes("Loading chunk") ||
    errorMessage.includes("MIME type");

  const handleReload = () => {
    sessionStorage.removeItem("esn_chunk_reload_attempt");
    sessionStorage.removeItem("vite_preload_reload");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#F6FBF8] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-emerald-100 text-center">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#0B5D3F]">
          {isChunkError ? <ShieldAlert size={32} /> : <AlertTriangle size={32} />}
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {isChunkError ? "App Update Available" : "Something Went Wrong"}
        </h2>

        <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
          {isChunkError
            ? "A newer version of the platform has been published. Please refresh the page to load the latest updates and access the admin dashboard."
            : "An unexpected error occurred while rendering this page. You can try refreshing or returning to the homepage."}
        </p>

        {process.env.NODE_ENV !== "production" && !isChunkError && (
          <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl mb-6 text-left overflow-auto max-h-32 font-mono">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleReload}
            className="flex items-center justify-center gap-2 bg-[#0B5D3F] hover:bg-[#0a5237] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <RefreshCw size={16} />
            Refresh & Update
          </button>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer"
          >
            <Home size={16} />
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
