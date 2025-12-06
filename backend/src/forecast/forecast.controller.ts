import { Controller, Get, Query } from '@nestjs/common';
import { ForecastService } from './forecast.service';
import { ForecastFilterDto } from './dto/forecast-filter.dto';
import { Forecast } from './forecast.entity';

@Controller('forecast')
export class ForecastController {
  constructor(private readonly forecastService: ForecastService) {}
  @Get()
  getAll(@Query() filterDto: ForecastFilterDto): Promise<Forecast[]> {
    const forecast = this.forecastService.getAll<Forecast>(filterDto);
    return forecast;
  }
}
