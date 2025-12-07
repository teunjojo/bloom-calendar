import type { Image } from "./Image"

export interface PikminEvent {
  id: number
  name: string
  eventType: string
  startDate: string
  endDate: string
  blogLink?: string
  images: Image[]
}
