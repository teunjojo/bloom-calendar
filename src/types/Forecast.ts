import type { Flower } from './Flower'

export interface Forecast {
  id: number
  name: string
  date: string
  blogLink?: string
  bigFlowers: Flower[]
  flowerOfTheMonth: Flower
  public: boolean
}
