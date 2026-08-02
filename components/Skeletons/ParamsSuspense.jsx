const ParamsSuspense = () => {
  return (
    <div className="bg-surface text-text-primary flex min-h-screen flex-col items-center justify-center">
      <div className="border-text-primary mb-4 h-10 w-10 animate-spin rounded-full border-2 border-t-transparent" />
      <p className="text-lg">Loading...</p>
    </div>
  );
};

export default ParamsSuspense;
