import api from '@/axiosClient'
import type { Decor } from '@/types/Decor'

export const getDecors = async (): Promise<Decor[]> => {
  const response = await api.get<Decor[]>('/decors')
  return response.data
}
