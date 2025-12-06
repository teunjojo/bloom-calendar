import axios from 'axios'

import { PikminEvent } from '@/models/PikminEvent'

export interface EventFilter {
  eventType?: string
  limit?: number
  offset?: number
}

export const getEvents = async (filters: EventFilter = {}): Promise<PikminEvent[]> => {
  const requestUrl = `${import.meta.env.VITE_API_URL}/event`

  const response = await axios.get<PikminEvent[]>(requestUrl, {
    params: filters,
  })
  return response.data
}
