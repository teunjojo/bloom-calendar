import { Injectable } from '@nestjs/common';
import { Season } from './interfaces/season.interface';

@Injectable()
export class SeasonService {
  getAll(): Season[] {
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

  getSeason(id: string): Season {
    return {
      id: id,
      name: 'December',
      startDate: new Date('2025-12-01'),
      endDate: new Date('2026-01-01'),
    };
  }
}
