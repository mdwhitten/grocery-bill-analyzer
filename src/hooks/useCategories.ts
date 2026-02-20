import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../api/categories'
import type { CategoryCreate, CategoryUpdate } from '../api/categories'

export const categoryKeys = {
  all:  () => ['categories']       as const,
  list: () => ['categories', 'list'] as const,
}

export function useCategoryList() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn:  listCategories,
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CategoryCreate) => createCategory(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.list() }),
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: { id: number } & CategoryUpdate) =>
      updateCategory(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.list() }),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.list() }),
  })
}
