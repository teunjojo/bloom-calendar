import { Injectable } from '@nestjs/common';
import { Event } from './interfaces/event.interface';

@Injectable()
export class EventService {
  getAll(): Event[] {
    return [
      {
        id: '1',
        name: 'December',
        startDate: new Date('2025-12-01'),
        endDate: new Date('2026-01-01'),
      },
      {
        id: '2',
        name: 'January',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-02-01'),
      },
    ];
  }

  getEvent(id: string): Event {
    return {
      id: id,
      name: 'December',
      startDate: new Date('2025-12-01'),
      endDate: new Date('2026-01-01'),
    };
  }
}
