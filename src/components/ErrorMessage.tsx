import { HiExclamationCircle } from "react-icons/hi";
import { ApiError } from "../api/apiClient";

interface ErrorMessageProps {
  error: Error | null;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({
  error,
  onRetry,
  className = "",
}: ErrorMessageProps) {
  if (!error) return null;

  // Extract user-friendly error message
  const getErrorMessage = (error: Error): string => {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        return "The requested content was not found.";
      }
      if (error.status === 500) {
        return "Server error. Please try again later.";
      }
      if (error.message.includes("timeout")) {
        return "Request timed out. Please check your connection and try again.";
      }
      if (error.message.includes("Network error")) {
        return "Network error. Please check your internet connection.";
      }
      return error.message;
    }
    return error.message || "An unexpected error occurred.";
  };

  return (
    <div
      className={`bg-red-50 border border-red-200 rounded-lg p-6 text-center ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Error Icon */}
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <HiExclamationCircle
            className="w-6 h-6 text-red-600"
            aria-hidden="true"
          />
        </div>

        {/* Error Message */}
        <div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Something went wrong
          </h3>
          <p className="text-red-700">{getErrorMessage(error)}</p>
        </div>

        {/* Retry Button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            type="button"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
