import type { EventDecor } from './EventDecor'
import type { Image } from './Image'

export interface PikminEvent {
  id: number
  name: string
  startDate: string
  endDate: string
  blogLink?: string
  images: Image[]
  public: boolean
  eventDecor: EventDecor[]
}
