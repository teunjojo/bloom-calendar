import type { PikminEvent } from '@/types/PikminEvent'
import type { EventFilter } from '@/types/EventFilter'
import api from '@/axiosClient'

export const getEvents = async (filters: EventFilter = {}): Promise<PikminEvent[]> => {
  const response = await api.get<PikminEvent[]>('/events', {
    params: filters,
  })
  return response.data
}

export const updateEventPublicState = async (id: number, state: boolean) => {
  const response = await api.post<PikminEvent>(`/events/${id}/public`, {
    state: state,
  })

  return response.data
}
