import { useState, useMemo } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { useMappingList, useUpdateMappingCategory } from '../hooks/useMappings'
import { useCategoryList } from '../hooks/useCategories'
import { catColor, catIcon, relativeTime } from '../lib/utils'
import { SourceTag } from '../components/SourceTag'
import { CategorySelect } from '../components/CategorySelect'
import type { ItemMapping } from '../types'

export function LearnedItems() {
  const { data: items = [], isLoading, isError } = useMappingList()
  const { data: categories = [] }                = useCategoryList()
  const updateCat = useUpdateMappingCategory()

  const [search, setSearch]       = useState('')
  const [catFilter, setCatFilter] = useState('All')

  const allCats = ['All', ...Array.from(new Set(items.map(i => i.category))).sort()]

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return items.filter(m => {
      const matchSearch = !q ||
        m.display_name.toLowerCase().includes(q) ||
        m.normalized_key.includes(q) ||
        m.category.toLowerCase().includes(q)
      const matchCat = catFilter === 'All' || m.category === catFilter
      return matchSearch && matchCat
    })
  }, [items, search, catFilter])

  function handleCategoryChange(id: number, category: string) {
    updateCat.mutate({ id, category })
  }

  return (
    <div className="space-y-4 max-w-5xl">

      {/* Filter toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input type="text" placeholder="Search items…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#03a9f4]/30 focus:border-[#03a9f4] transition-all placeholder:text-gray-400" />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {allCats.map(cat => (
            <button key={cat} onClick={() => setCatFilter(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                catFilter === cat
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
              }`}>
              {cat !== 'All' && (
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: catColor(cat) }} />
              )}
              {cat !== 'All' ? catIcon(cat) + ' ' : ''}{cat}
            </button>
          ))}
        </div>

        <span className="text-xs text-gray-400 ml-auto whitespace-nowrap">
          {isLoading ? '…' : `${filtered.length} rule${filtered.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
        {isLoading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading learned items…</span>
          </div>
        ) : isError ? (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold text-red-500 mb-1">Failed to load learned items</p>
            <p className="text-xs text-gray-400">Check that the backend is running</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl mb-3">📚</p>
            <p className="text-sm font-semibold text-gray-700 mb-1">No learned items found</p>
            <p className="text-xs text-gray-400">Save receipts and correct categories to build up rules</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left text-[11px] uppercase tracking-widest text-gray-400 font-semibold px-5 py-3">Item</th>
                <th className="text-left text-[11px] uppercase tracking-widest text-gray-400 font-semibold px-4 py-3 hidden lg:table-cell">Raw OCR Key</th>
                <th className="text-left text-[11px] uppercase tracking-widest text-gray-400 font-semibold px-4 py-3">Category</th>
                <th className="text-center text-[11px] uppercase tracking-widest text-gray-400 font-semibold px-3 py-3 hidden md:table-cell">Seen</th>
                <th className="text-left text-[11px] uppercase tracking-widest text-gray-400 font-semibold px-4 py-3 hidden sm:table-cell">Last Seen</th>
                <th className="w-10 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <LearnedItemRow key={m.id} mapping={m} index={i} categories={categories}
                  onCategoryChange={cat => handleCategoryChange(m.id, cat)} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-gray-400 px-1">
        Learned rules are applied automatically when the same item is scanned again. Changing a category here updates future receipts only.
      </p>
    </div>
  )
}

interface RowProps {
  mapping: ItemMapping
  index: number
  categories: import('../types').Category[]
  onCategoryChange: (cat: string) => void
}

function LearnedItemRow({ mapping: m, index, categories, onCategoryChange }: RowProps) {
  return (
    <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-colors group"
      style={{ animationDelay: `${Math.min(index, 9) * 25}ms` }}>

      <td className="px-5 py-3">
        <p className="text-sm font-medium text-gray-900 leading-tight">{m.display_name}</p>
        <div className="mt-1">
          <SourceTag source={m.source} />
        </div>
      </td>

      <td className="px-4 py-3 hidden lg:table-cell">
        <span className="text-[11px] font-mono text-gray-400 bg-gray-50 border border-gray-100 rounded px-1.5 py-0.5 max-w-[180px] truncate block">
          {m.normalized_key}
        </span>
      </td>

      <td className="px-4 py-3">
        <CategorySelect value={m.category} categories={categories} onChange={onCategoryChange} />
      </td>

      <td className="px-3 py-3 text-center hidden md:table-cell">
        <span className="text-xs font-mono font-medium text-gray-600 bg-gray-100 rounded-full px-2 py-0.5 tabular-nums">
          ×{m.times_seen}
        </span>
      </td>

      <td className="px-4 py-3 hidden sm:table-cell">
        <span className="text-xs text-gray-400">{relativeTime(m.last_seen)}</span>
      </td>

      <td className="pr-4 py-3 text-right">
        {/* Mappings don't have a delete endpoint, so this is intentionally absent */}
        <span className="w-6 h-6 inline-block" />
      </td>
    </tr>
  )
}
