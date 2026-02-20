import { apiFetch } from './client'
import type { Category } from '../types'

export interface CategoryCreate {
  name: string
  color?: string
  icon?: string
}

export interface CategoryUpdate {
  name?: string
  color?: string
  icon?: string
  is_disabled?: boolean
}

export async function listCategories(): Promise<Category[]> {
  return apiFetch<Category[]>('/categories')
}

export async function createCategory(body: CategoryCreate): Promise<Category> {
  return apiFetch<Category>('/categories', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function updateCategory(id: number, body: CategoryUpdate): Promise<Category> {
  return apiFetch<Category>(`/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export async function deleteCategory(id: number): Promise<void> {
  return apiFetch(`/categories/${id}`, { method: 'DELETE' })
}
