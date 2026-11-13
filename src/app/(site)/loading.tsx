export default function PublicPageLoading() {
  return (
    <div className="min-h-[80svh] bg-white px-5 pb-16 pt-32 md:px-8" role="status" aria-live="polite" aria-busy="true">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-red-700">Loading page...</p>
        <div aria-hidden="true" className="mt-8 space-y-8 motion-safe:animate-pulse">
          <div className="h-64 rounded-lg bg-charcoal md:h-96" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((key) => <div key={key} className="h-48 rounded-lg border border-cream/10 bg-charcoal" />)}
          </div>
        </div>
      </div>
    </div>
  );
}
