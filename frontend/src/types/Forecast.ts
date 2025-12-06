import type { Flower } from "./Flower"
import type { PikminEvent } from "./PikminEvent"

export interface Forecast extends PikminEvent {
  bigFlowers: Flower[]
  flowerOfTheMonth: Flower
}
