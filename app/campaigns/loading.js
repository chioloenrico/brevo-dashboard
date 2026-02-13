export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mb-4"></div>
        <p className="text-foreground/70">Caricamento campagne...</p>
      </div>
    </div>
  )
}
