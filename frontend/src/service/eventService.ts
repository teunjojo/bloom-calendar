import axios from 'axios'

export interface EventFilter {
  eventType?: string
  limit?: number
  offset?: number
}

export interface PikminEvent {
  id: number
  name: string
  eventType: string
  startDate: string
  endDate: string
}

export const getEvents = async (filters: EventFilter = {}): Promise<PikminEvent[]> => {
  const requestUrl = `${import.meta.env.VITE_API_URL}/event`

  const response = await axios.get<PikminEvent[]>(requestUrl, {
    params: filters,
  })
  return response.data
}
