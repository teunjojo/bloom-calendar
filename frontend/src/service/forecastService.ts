import axios from 'axios'

import type { Forecast } from '@/types/Forecast'
import type { ForecastFilter } from '@/types/ForecastFilter'

export const getForecasts = async (filters: ForecastFilter = {}): Promise<Forecast[]> => {
  const requestUrl = `${import.meta.env.VITE_API_URL}/forecast`

  const response = await axios.get<Forecast[]>(requestUrl, {
    params: filters,
  })
  return response.data
}
