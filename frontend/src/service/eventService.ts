import axios from 'axios'

export interface EventFilter {
  eventType?: string
  limit?: number
  offset?: number
}

export interface Event {
  id: number
  name: string
  eventType: string
  startDate: string
}

export const getEvents = async (filters: EventFilter = {}): Promise<Event[]> => {
  const requestUrl = `${import.meta.env.VITE_API_URL}/event`

  const response = await axios.get<Event[]>(requestUrl, {
    params: filters,
  })
  return response.data
}
