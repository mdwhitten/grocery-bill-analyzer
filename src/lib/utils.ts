import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import type { Category } from '../types'

const CAT_COLORS: Record<string, string> = {
  'Produce': '#2d7a4f', 'Meat & Seafood': '#c4622d', 'Dairy & Eggs': '#2d5fa0',
  'Snacks': '#d4a017', 'Pantry': '#6b4fa0', 'Beverages': '#4a90a4',
  'Frozen': '#4f7ab0', 'Household': '#8a7d6b', 'Cleaning': '#7ab04f', 'Other': '#b08a4f',
}
const CAT_ICONS: Record<string, string> = {
  'Produce': '🥦', 'Meat & Seafood': '🥩', 'Dairy & Eggs': '🥚',
  'Snacks': '🍿', 'Pantry': '🥫', 'Beverages': '☕',
  'Frozen': '🧊', 'Household': '🧹', 'Cleaning': '🧼', 'Other': '📦',
}

export function catColor(name: string, categories?: Category[]): string {
  const cat = categories?.find(c => c.name === name)
  if (cat?.color) return cat.color
  return CAT_COLORS[name] ?? '#888'
}
export function catIcon(name: string, categories?: Category[]): string {
  const cat = categories?.find(c => c.name === name)
  if (cat?.icon) return cat.icon
  return CAT_ICONS[name]  ?? '📦'
}

export function fmt(n: number)      { return `$${n.toFixed(2)}` }
export function fmtShort(n: number) { return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${Math.round(n)}` }

export function relativeTime(iso: string): string {
  const diff  = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins  < 2)  return 'just now'
  if (mins  < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days  <  7) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function storeIcon(name: string | null): string {
  if (!name) return '🛒'
  const n = name.toLowerCase()
  if (n.includes('costco'))  return '🏭'
  if (n.includes('h-e-b') || n.includes('heb')) return '🛒'
  if (n.includes('target'))  return '🎯'
  if (n.includes('walmart')) return '🏪'
  if (n.includes('whole'))   return '🌿'
  if (n.includes('kroger'))  return '🛍️'
  if (n.includes('aldi'))    return '🏬'
  return '🛒'
}
