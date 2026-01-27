import type { Decor } from './Decor'

export interface EventDecor {
  id: number,
  eventId: number,
  decorId: number,
  decor: Decor,
  status: 'NEW' | 'RETURNING',
  overview: string,
}
