export class PikminEvent{
  id: number
  name: string
  eventType: string
  startDate: string
  endDate: string

  constructor(id: number, name: string, eventType: string, startDate: string, endDate: string) {
    this.id = id
    this.name = name
    this.eventType = eventType
    this.startDate = startDate
    this.endDate = endDate
  }
}
