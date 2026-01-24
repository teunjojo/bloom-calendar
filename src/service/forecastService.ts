import api from '@/axiosClient'
import type { Forecast } from '@/types/Forecast'
import type { ForecastFilter } from '@/types/ForecastFilter'

export const getForecasts = async (filters: ForecastFilter = {}): Promise<Forecast[]> => {
  const response = await api.get<Forecast[]>('/forecasts', {
    params: filters,
  })
  return response.data
}

export const updateForecastPublicState = async (id: number, state: boolean) => {
  const response = await api.post<Forecast>(`/forecasts/${id}/public`, {
    state: state,
  })
  return response.data
}

export const createForecast = async (event: Forecast) => {
  const response = await api.put<Forecast>('/forecasts', event)
  return response.data
}

export const updateForecast = async (event: Forecast): Promise<Forecast> => {
  const response = await api.post<Forecast>(`/forecasts/${event.id}`, event)
  return response.data
}

export const deleteForecast = async (id: number) => {
  const response = await api.delete<Forecast>(`/forecasts/${id}`)
  return response.data
}
