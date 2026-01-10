import type { Decor } from './Decor'
import type { Image } from './Image'

export interface PikminEvent {
  id: number
  name: string
  startDate: string
  endDate: string
  blogLink?: string
  images: Image[]
  public: boolean
  newDecor: Decor[]
  returningDecor: Decor[]
}
