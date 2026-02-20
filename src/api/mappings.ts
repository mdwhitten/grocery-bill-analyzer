import { apiFetch } from './client'
import type { ItemMapping } from '../types'

export async function listMappings(limit = 500): Promise<ItemMapping[]> {
  return apiFetch<ItemMapping[]>(`/items/mappings?limit=${limit}`)
}

export async function updateMappingCategory(
  itemId: number,
  category: string,
): Promise<{ status: string; item_id: number; category: string }> {
  return apiFetch(`/items/${itemId}/category`, {
    method: 'PATCH',
    body: JSON.stringify({ category }),
  })
}
