import { Controller, Get } from '@nestjs/common';
import { SeasonService } from './season.service';
import { Season } from './interfaces/season.interface';

@Controller('season')
export class SeasonController {
  constructor(private readonly seasonService: SeasonService) {}
  @Get()
  getAll(): Season[] {
    return this.seasonService.getAll();
  }
}
