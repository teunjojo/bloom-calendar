import api from '@/axiosClient'
import type { Forecast } from '@/types/Forecast'
import type { ForecastFilter } from '@/types/ForecastFilter'

export const getForecasts = async (filters: ForecastFilter = {}): Promise<Forecast[]> => {
  const response = await api.get<Forecast[]>('/forecasts', {
    params: filters,
  })
  return response.data
}
