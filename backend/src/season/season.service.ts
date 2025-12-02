import { Injectable } from '@nestjs/common';
import { Season } from './interfaces/season.interface';

@Injectable()
export class SeasonService {
  getAll(): Season[] {
    return [
      {
        name: 'December',
        startDate: new Date('2025-12-01'),
        endDate: new Date('2026-01-01'),
      },
    ];
  }
}
