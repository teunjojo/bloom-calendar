import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Forecast } from './forecast.entity';
import { ForecastFilterDto } from './dto/forecast-filter.dto';
import { EventService } from '@app/event/event.service';
import { Event } from '@app/event/event.entity';

@Injectable()
export class ForecastService extends EventService {
  constructor(
    @InjectRepository(Forecast)
    private forecastRepository: Repository<Forecast>,
  ) {
    // Call parent constructor with Forecast repository as Event repository
    super(forecastRepository as unknown as Repository<Event>);
  }

  protected buildQueryOptions<T extends Event>(
    filter: ForecastFilterDto,
  ): FindManyOptions<T> {
    const options = super.buildQueryOptions(filter);
    options.relations = ['flowerOfTheMonth', 'bigFlowers'];
    return options as FindManyOptions<T>;
  }
}
