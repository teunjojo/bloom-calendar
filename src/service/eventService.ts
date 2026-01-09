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

export const createEvent = async (event: PikminEvent) => {
  const response = await api.put<PikminEvent>('/events', event)
  return response.data
}

export const deleteEvent = async (id: number) => {
  const response = await api.delete<PikminEvent>(`/events/${id}`)
  return response.data
}

export const updateEvent = async (event: PikminEvent): Promise<PikminEvent> => {
  const response = await api.post<PikminEvent>(`/events/${event.id}`, event)
  return response.data
}
