import { catColor, catIcon, fmtShort } from '../../lib/utils'

interface CategoryBarChartProps {
  data: { category: string; amount: number }[]
}

export function CategoryBarChart({ data }: CategoryBarChartProps) {
  const max = Math.max(...data.map(d => d.amount), 1)
  const total = data.reduce((s, d) => s + d.amount, 0)

  return (
    <div className="space-y-3">
      {data.map((d, i) => {
        const pct = (d.amount / max) * 100
        const share = ((d.amount / total) * 100).toFixed(0)
        const color = catColor(d.category)
        return (
          <div key={d.category} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                <span className="text-base">{catIcon(d.category)}</span>
                {d.category}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-gray-400">{share}%</span>
                <span className="text-sm font-mono font-semibold text-gray-800 tabular-nums w-14 text-right">
                  {fmtShort(d.amount)}
                </span>
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-700 ease-out"
                style={{
                  width: `${pct}%`,
                  background: color,
                  transitionDelay: `${i * 60}ms`,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
