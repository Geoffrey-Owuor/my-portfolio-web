const ParamsSuspense = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <div className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-gray-900 border-t-transparent dark:border-gray-100" />
      <p className="text-lg">Loading...</p>
    </div>
  );
};

export default ParamsSuspense;
