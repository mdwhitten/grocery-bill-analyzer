import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listMappings, updateMappingCategory } from '../api/mappings'
import type { ItemMapping } from '../types'

export const mappingKeys = {
  list: () => ['mappings', 'list'] as const,
}

export function useMappingList() {
  return useQuery<ItemMapping[]>({
    queryKey: mappingKeys.list(),
    queryFn:  () => listMappings(),
  })
}

export function useUpdateMappingCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, category }: { id: number; category: string }) =>
      updateMappingCategory(id, category),
    onSuccess: () => qc.invalidateQueries({ queryKey: mappingKeys.list() }),
  })
}
