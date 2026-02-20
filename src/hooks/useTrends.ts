import { useQuery } from '@tanstack/react-query'
import { getMonthlyTrends, getDashboardSummary } from '../api/trends'

export function useMonthlyTrends(months = 6) {
  return useQuery({
    queryKey: ['trends', 'monthly', months],
    queryFn:  () => getMonthlyTrends(months),
  })
}

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['trends', 'summary'],
    queryFn:  getDashboardSummary,
  })
}
