const AIProcessingScreen = () => {
  return (
    <div className="mx-auto max-w-xl rounded-xl bg-white p-10 text-center shadow">
      <div
        className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 
        border-[var(--color-processing-amber)] border-t-transparent"
      />

      <h2 className="text-xl font-semibold text-[var(--color-industrial-navy)]">
        Analyzing with AI
      </h2>

      <p className="mt-3 text-sm text-[var(--color-neutral-slate)]">
        Our AI is detecting issues and generating insights. This may take a few
        seconds.
      </p>
    </div>
  );
};

export default AIProcessingScreen;
