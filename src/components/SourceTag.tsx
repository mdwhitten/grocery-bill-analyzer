type Source = 'learned' | 'manual' | 'ai'

const config: Record<Source, { label: string; className: string }> = {
  learned: { label: '✓ Learned', className: 'bg-green-100 text-green-700' },
  manual:  { label: '✏️ Manual',  className: 'bg-orange-100 text-orange-700' },
  ai:      { label: '🤖 AI',     className: 'bg-purple-100 text-purple-700' },
}

export function SourceTag({ source }: { source: Source }) {
  const { label, className } = config[source]
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${className}`}>
      {label}
    </span>
  )
}
