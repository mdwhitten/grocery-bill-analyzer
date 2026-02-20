import { useState } from 'react'
import { fmt } from '../lib/utils'

interface PriceInputProps {
  lineTotal: number
  locked?: boolean
  onChange: (newLineTotal: number) => void
}

export function PriceInput({ lineTotal, locked, onChange }: PriceInputProps) {
  const [value, setValue] = useState(lineTotal.toFixed(2))
  const [focused, setFocused] = useState(false)

  if (locked) {
    return (
      <span className="font-mono font-medium text-sm tabular-nums">
        {fmt(lineTotal)}
      </span>
    )
  }

  return (
    <div className={`inline-flex items-center border rounded-lg overflow-hidden transition-shadow ${
      focused
        ? 'border-blue-400 shadow-[0_0_0_3px_rgba(59,130,246,0.15)]'
        : 'border-gray-200 hover:border-gray-300'
    }`}>
      <span className="px-1.5 py-1 bg-gray-50 border-r border-gray-200 text-xs font-mono text-gray-400 select-none">
        $
      </span>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onFocus={e => { setFocused(true); e.target.select() }}
        onBlur={() => {
          setFocused(false)
          const n = parseFloat(value)
          if (isNaN(n) || n <= 0) {
            setValue(lineTotal.toFixed(2))
          } else {
            setValue(n.toFixed(2))
            onChange(n)
          }
        }}
        onChange={e => {
          setValue(e.target.value)
          const n = parseFloat(e.target.value)
          if (!isNaN(n) && n > 0) onChange(n)
        }}
        className="w-16 px-1.5 py-1 text-sm font-mono font-medium text-right bg-white outline-none tabular-nums"
      />
    </div>
  )
}
