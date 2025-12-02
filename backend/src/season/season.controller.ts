import { Controller, Get, Param } from '@nestjs/common';
import { SeasonService } from './season.service';
import { Season } from './interfaces/season.interface';

@Controller('season')
export class SeasonController {
  constructor(private readonly seasonService: SeasonService) {}
  @Get()
  getAll(): Season[] {
    return this.seasonService.getAll();
  }

  @Get(':id')
  getSeason(@Param('id') id: string): Season {
    return this.seasonService.getSeason(id);
  }
}
