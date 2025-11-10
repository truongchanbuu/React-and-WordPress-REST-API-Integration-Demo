/**
 * Loading spinner component
 * Provides a consistent loading state across the application
 */

export function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        
        {/* Optional: Loading text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-600">Loading...</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Inline loader for smaller components
 */
export function InlineLoader() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
    </div>
  );
}

