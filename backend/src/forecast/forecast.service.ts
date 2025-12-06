import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, LessThan, MoreThan, Repository } from 'typeorm';

import { Forecast } from './forecast.entity';
import { ForecastFilterDto } from './dto/forecast-filter.dto';
import { buildFindOptions } from '@app/common/utils/query-options';

@Injectable()
export class ForecastService {
  constructor(
    @InjectRepository(Forecast)
    private forecastRepository: Repository<Forecast>,
  ) {}

  getAll(forecastFilterDto: ForecastFilterDto): Promise<Forecast[]> {
    const options: FindManyOptions<Forecast> = {
      ...buildFindOptions<Forecast>(forecastFilterDto),
      relations: ['flowerOfTheMonth', 'bigFlowers'],
    };

    if (forecastFilterDto.currentDate) {
      const currentDate = new Date(forecastFilterDto.currentDate);
      options.where = {
        ...options.where,
        startDate: LessThan(currentDate),
        endDate: MoreThan(currentDate),
      };
    }

    return this.forecastRepository.find(options);
  }
}
