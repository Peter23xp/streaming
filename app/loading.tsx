export default function Loading() {
  return (
    <div className="animate-pulse space-y-8" aria-busy="true" aria-label="Chargement">
      <div className="h-7 w-48 rounded-lg bg-surface-2" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-[2/3] rounded-xl bg-surface-2" />
            <div className="h-3 w-3/4 rounded bg-surface-2" />
          </div>
        ))}
      </div>
    </div>
  )
}
