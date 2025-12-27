import type { Filter } from "./Filter"

export interface EventFilter extends Filter {
  eventType?: string
  currentDate?: string
  afterDate?: string
}
