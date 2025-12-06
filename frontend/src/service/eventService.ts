import axios from 'axios'

import type { PikminEvent } from '@/types/PikminEvent'
import type { EventFilter } from '@/types/EventFilter'

export const getEvents = async (filters: EventFilter = {}): Promise<PikminEvent[]> => {
  const requestUrl = `${import.meta.env.VITE_API_URL}/event`

  const response = await axios.get<PikminEvent[]>(requestUrl, {
    params: filters,
  })
  return response.data
}
