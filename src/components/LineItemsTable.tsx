import { useMemo } from 'react'
import type { LineItem, Category } from '../types'
import { CategorySelect } from './CategorySelect'
import { PriceInput } from './PriceInput'
import { SourceTag } from './SourceTag'
import { fmt } from '../lib/utils'

interface LineItemsTableProps {
  items: LineItem[]
  categories: Category[]
  locked: boolean
  onCategoryChange: (itemId: number, category: string) => void
  onPriceChange: (itemId: number, newUnitPrice: number) => void
}

export function LineItemsTable({
  items,
  categories,
  locked,
  onCategoryChange,
  onPriceChange,
}: LineItemsTableProps) {
  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.price * i.quantity, 0),
    [items]
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left text-[11px] uppercase tracking-wider text-gray-400 font-medium px-4 py-2">
              Item
            </th>
            <th className="text-left text-[11px] uppercase tracking-wider text-gray-400 font-medium px-3 py-2">
              Category
            </th>
            <th className="text-right text-[11px] uppercase tracking-wider text-gray-400 font-medium px-4 py-2">
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            const normalize = (s: string) => s.replace(/\s+/g, '').toLowerCase()
            const showRaw = item.clean_name && item.raw_name &&
              normalize(item.clean_name) !== normalize(item.raw_name)
            const lineTotal = item.price * item.quantity

            return (
              <tr
                key={item.id}
                className="border-b border-gray-50 hover:bg-gray-50/70 transition-colors group"
              >
                {/* Item name */}
                <td className="px-4 py-3 align-middle">
                  <p className="font-medium text-gray-900 leading-tight">
                    {item.clean_name || item.raw_name}
                  </p>
                  {showRaw && (
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                      {item.raw_name}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <SourceTag source={item.category_source} />
                    {item.quantity > 1 && (
                      <span className="text-[11px] text-gray-400 font-mono">
                        ×{item.quantity} @ {fmt(item.price)}
                      </span>
                    )}
                  </div>
                </td>

                {/* Category */}
                <td className="px-3 py-3 align-middle w-44">
                  <CategorySelect
                    value={item.category}
                    categories={categories}
                    onChange={cat => onCategoryChange(item.id, cat)}
                  />
                </td>

                {/* Price */}
                <td className="px-4 py-3 align-middle text-right">
                  <PriceInput
                    lineTotal={lineTotal}
                    locked={locked}
                    onChange={newLineTotal => onPriceChange(item.id, newLineTotal / item.quantity)}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-gray-200">
            <td className="px-4 py-3 font-semibold text-gray-700">Subtotal</td>
            <td />
            <td className="px-4 py-3 text-right font-mono font-semibold text-gray-900 tabular-nums">
              {fmt(subtotal)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
