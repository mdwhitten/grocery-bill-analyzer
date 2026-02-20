import { cn } from '../lib/utils'

interface StatCardProps {
  eyebrow: string
  value: string
  sub?: string
  trend?: { label: string; up: boolean }
  accent?: boolean
  icon?: React.ReactNode
}

export function StatCard({ eyebrow, value, sub, trend, accent, icon }: StatCardProps) {
  return (
    <div className={cn(
      'bg-white rounded-2xl p-5 border shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]',
      accent
        ? 'border-[#03a9f4]/30 ring-1 ring-[#03a9f4]/15'
        : 'border-gray-100'
    )}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-[11px] uppercase tracking-widest font-semibold text-gray-400">{eyebrow}</p>
        {icon && (
          <div className="text-xl opacity-80 -mt-0.5">{icon}</div>
        )}
      </div>
      <p className={cn(
        'text-3xl font-semibold tabular-nums font-mono leading-none',
        accent ? 'text-[#03a9f4]' : 'text-gray-900'
      )}>
        {value}
      </p>
      {sub && <p className="text-xs text-gray-500 mt-1.5">{sub}</p>}
      {trend && (
        <div className={cn(
          'inline-flex items-center gap-1 mt-2 text-xs font-medium',
          trend.up ? 'text-red-500' : 'text-emerald-500'
        )}>
          <span>{trend.up ? '↑' : '↓'}</span>
          <span>{trend.label}</span>
        </div>
      )}
    </div>
  )
}
