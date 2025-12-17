import type { Flower } from "./Flower"

export interface Forecast {
  id: string
  name: string
  date: string
  blogLink?: string
  bigFlowers: Flower[]
  flowerOfTheMonth: Flower
}
