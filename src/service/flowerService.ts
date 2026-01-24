import api from '@/axiosClient'
import type { Flower } from '@/types/Flower'

export const getFlowers = async (): Promise<Flower[]> => {
  const response = await api.get<Flower[]>('/flowers')
  return response.data
}
