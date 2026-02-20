import { useState } from 'react'
import { Pencil, Trash2, Plus, Check, Loader2 } from 'lucide-react'
import { cn } from '../lib/utils'
import { useCategoryList, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks/useCategories'
import type { Category } from '../types'

// ── Constants ────────────────────────────────────────────────────────────────

const PRESET_COLORS = [
  '#2d7a4f', '#c4622d', '#2d5fa0', '#d4a017',
  '#6b4fa0', '#8a7d6b', '#4a90a4', '#a06b4f',
  '#b04f70', '#4f7ab0', '#7ab04f', '#b08a4f',
]

// ── Types ────────────────────────────────────────────────────────────────────

interface EditDraft {
  name: string
  icon: string
  color: string
}

// ── Color Swatches ────────────────────────────────────────────────────────────

function ColorSwatches({ selected, onSelect }: { selected: string; onSelect: (c: string) => void }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {PRESET_COLORS.map(color => (
        <button key={color} type="button" onClick={() => onSelect(color)}
          className={cn(
            'w-5 h-5 rounded-full transition-all',
            selected === color ? 'ring-2 ring-offset-1 ring-gray-800 scale-110' : 'hover:scale-110'
          )}
          style={{ backgroundColor: color }} title={color}>
          {selected === color && <Check className="w-3 h-3 text-white mx-auto" strokeWidth={3} />}
        </button>
      ))}
    </div>
  )
}

// ── Inline Edit Row ───────────────────────────────────────────────────────────

interface EditRowProps {
  draft: EditDraft
  isBuiltin: boolean
  saveLabel: string
  saving?: boolean
  onChange: (d: EditDraft) => void
  onSave: () => void
  onCancel: () => void
}

function EditRow({ draft, isBuiltin, saveLabel, saving, onChange, onSave, onCancel }: EditRowProps) {
  return (
    <div className="px-5 py-3.5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
            <span className="text-xl leading-none">{draft.icon || '📦'}</span>
          </div>
          {!isBuiltin && (
            <input type="text" value={draft.icon}
              onChange={e => { const val = e.target.value; onChange({ ...draft, icon: val.slice(-2) || val }) }}
              maxLength={8}
              className="absolute inset-0 w-10 h-10 opacity-0 cursor-pointer"
              title="Click to change emoji" placeholder="📦" />
          )}
        </div>

        <input type="text" value={draft.name}
          onChange={e => onChange({ ...draft, name: e.target.value })}
          disabled={isBuiltin}
          placeholder="Category name"
          className={cn(
            'flex-1 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-1.5',
            'focus:outline-none focus:ring-2 focus:ring-[#03a9f4]/30 focus:border-[#03a9f4]',
            isBuiltin && 'opacity-50 cursor-not-allowed bg-gray-50'
          )} />

        <div className="flex items-center gap-2 flex-shrink-0">
          <button type="button" onClick={onSave} disabled={!draft.name.trim() || saving}
            className={cn(
              'text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors',
              'bg-[#03a9f4] text-white hover:bg-[#0290d1]',
              'disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1'
            )}>
            {saving && <Loader2 className="w-3 h-3 animate-spin" />}
            {saveLabel}
          </button>
          <button type="button" onClick={onCancel}
            className="text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors text-gray-500 hover:bg-gray-100">
            Cancel
          </button>
        </div>
      </div>

      {!isBuiltin && (
        <div className="flex items-center gap-3 pl-13">
          <span className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold w-10 flex-shrink-0">Color</span>
          <ColorSwatches selected={draft.color} onSelect={color => onChange({ ...draft, color })} />
        </div>
      )}
    </div>
  )
}

// ── Active Row ────────────────────────────────────────────────────────────────

interface ActiveRowProps {
  cat: Category
  isEditing: boolean
  editDraft: EditDraft | null
  onEditStart: () => void
  onEditChange: (d: EditDraft) => void
  onEditSave: () => void
  onEditCancel: () => void
  onDisable: () => void
  onDelete: () => void
  saving?: boolean
}

function ActiveRow({ cat, isEditing, editDraft, onEditStart, onEditChange, onEditSave, onEditCancel, onDisable, onDelete, saving }: ActiveRowProps) {
  if (isEditing && editDraft) {
    return (
      <div className="border-b border-gray-50 bg-blue-50/30">
        <EditRow draft={editDraft} isBuiltin={cat.is_builtin} saveLabel="Save"
          saving={saving} onChange={onEditChange} onSave={onEditSave} onCancel={onEditCancel} />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 rounded-xl group border-b border-gray-50 transition-colors">
      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
        <span className="text-xl leading-none">{cat.icon}</span>
      </div>
      <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
      <span className="text-sm font-medium text-gray-900">{cat.name}</span>
      {cat.is_builtin ? (
        <span className="text-[10px] uppercase font-semibold tracking-wide px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Built-in</span>
      ) : (
        <span className="text-[10px] uppercase font-semibold tracking-wide px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">Custom</span>
      )}
      <div className="flex-1" />
      <div className="flex items-center gap-1">
        {cat.is_builtin ? (
          <button type="button" onClick={onDisable}
            className="text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors text-gray-500 hover:bg-gray-100">
            Disable
          </button>
        ) : (
          <>
            <button type="button" onClick={onEditStart}
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors text-gray-500 hover:bg-gray-100">
              <Pencil className="w-3 h-3" /> Edit
            </button>
            <button type="button" onClick={onDelete}
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors text-red-400 hover:bg-red-50 opacity-0 group-hover:opacity-100">
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ── Disabled Row ──────────────────────────────────────────────────────────────

function DisabledRow({ cat, onEnable }: { cat: Category; onEnable: () => void }) {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 rounded-xl border-b border-gray-50 last:border-b-0 transition-colors">
      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 opacity-50">
        <span className="text-xl leading-none">{cat.icon}</span>
      </div>
      <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 opacity-50" style={{ backgroundColor: cat.color }} />
      <span className="text-sm font-medium text-gray-900 opacity-50">{cat.name}</span>
      {cat.is_builtin ? (
        <span className="text-[10px] uppercase font-semibold tracking-wide px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">Built-in</span>
      ) : (
        <span className="text-[10px] uppercase font-semibold tracking-wide px-2 py-0.5 rounded-full bg-blue-50 text-blue-400">Custom</span>
      )}
      <div className="flex-1" />
      <button type="button" onClick={onEnable}
        className="text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors text-gray-500 hover:bg-gray-100">
        Enable
      </button>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export function Categories() {
  const { data: categories = [], isLoading } = useCategoryList()
  const createMut = useCreateCategory()
  const updateMut = useUpdateCategory()
  const deleteMut = useDeleteCategory()

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null)
  const [showNew, setShowNew]     = useState(false)
  const [newDraft, setNewDraft]   = useState<EditDraft>({
    name: '', icon: '📦', color: PRESET_COLORS[0],
  })

  const activeCats   = categories.filter(c => !c.is_disabled)
  const disabledCats = categories.filter(c => c.is_disabled)

  function startEdit(cat: Category) {
    setEditingId(cat.id)
    setShowNew(false)
    setEditDraft({ name: cat.name, icon: cat.icon, color: cat.color })
  }

  function cancelEdit() { setEditingId(null); setEditDraft(null) }

  async function saveEdit() {
    if (!editDraft || !editDraft.name.trim() || editingId == null) return
    await updateMut.mutateAsync({ id: editingId, name: editDraft.name.trim(), icon: editDraft.icon, color: editDraft.color })
    setEditingId(null)
    setEditDraft(null)
  }

  async function toggleDisable(id: number, is_disabled: boolean) {
    await updateMut.mutateAsync({ id, is_disabled })
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this category?')) return
    await deleteMut.mutateAsync(id)
  }

  function startNew() {
    setShowNew(true)
    setEditingId(null)
    setNewDraft({ name: '', icon: '📦', color: PRESET_COLORS[0] })
  }

  async function createCategory() {
    if (!newDraft.name.trim()) return
    await createMut.mutateAsync({ name: newDraft.name.trim(), icon: newDraft.icon || '📦', color: newDraft.color })
    setShowNew(false)
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl flex items-center justify-center py-32 gap-2 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading categories…</span>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <div>
            <p className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 mb-0.5">Manage</p>
            <h2 className="text-base font-bold text-gray-900">Categories</h2>
          </div>
          <button type="button" onClick={startNew} disabled={showNew}
            className={cn(
              'flex items-center gap-1.5 bg-[#03a9f4] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#0290d1] transition-colors',
              'disabled:opacity-40 disabled:cursor-not-allowed'
            )}>
            <Plus className="w-4 h-4" />
            New Category
          </button>
        </div>

        {/* Active list */}
        <div>
          {activeCats.map(cat => (
            <ActiveRow key={cat.id} cat={cat}
              isEditing={editingId === cat.id}
              editDraft={editingId === cat.id ? editDraft : null}
              onEditStart={() => startEdit(cat)}
              onEditChange={setEditDraft}
              onEditSave={saveEdit}
              onEditCancel={cancelEdit}
              onDisable={() => toggleDisable(cat.id, true)}
              onDelete={() => handleDelete(cat.id)}
              saving={updateMut.isPending} />
          ))}

          {showNew && (
            <div className="border-b border-gray-50 bg-blue-50/30">
              <EditRow draft={newDraft} isBuiltin={false} saveLabel="Create"
                saving={createMut.isPending}
                onChange={setNewDraft} onSave={createCategory} onCancel={() => setShowNew(false)} />
            </div>
          )}
        </div>

        {/* Disabled section */}
        {disabledCats.length > 0 && (
          <>
            <div className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold px-5 py-2 bg-gray-50 border-t border-gray-100">
              Disabled
            </div>
            <div>
              {disabledCats.map(cat => (
                <DisabledRow key={cat.id} cat={cat} onEnable={() => toggleDisable(cat.id, false)} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
