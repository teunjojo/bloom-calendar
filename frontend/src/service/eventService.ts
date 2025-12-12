import type { PikminEvent } from '@/types/PikminEvent'
import type { EventFilter } from '@/types/EventFilter'
import api from '@/axiosClient'

export const getEvents = async (filters: EventFilter = {}): Promise<PikminEvent[]> => {
  const response = await api.get<PikminEvent[]>('/events', {
    params: filters,
  })
  return response.data
}
