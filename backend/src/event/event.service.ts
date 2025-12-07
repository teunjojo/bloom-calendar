import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOptionsWhere,
  LessThan,
  MoreThan,
  Repository,
} from 'typeorm';

import { Event } from './event.entity';
import { EventFilterDto } from './dto/event-filter.dto';
import { buildFindOptions } from '@app/common/utils/query-options';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  getAll<T extends Event = Event>(
    eventFilterDto: EventFilterDto,
  ): Promise<T[]> {
    const options = this.buildQueryOptions<T>(eventFilterDto);
    return this.eventRepository.find(options as any) as Promise<T[]>;
  }

  protected buildQueryOptions<T extends Event>(
    filter: EventFilterDto,
  ): FindManyOptions<T> {
    const baseOptions = {
      ...buildFindOptions<T>(filter),
      relations: ['images'],
    };
    let where: FindOptionsWhere<T> = {} as FindOptionsWhere<T>;

    if (filter.currentDate) {
      const currentDate = new Date(filter.currentDate);
      where = {
        ...where,
        startDate: LessThan(currentDate),
        endDate: MoreThan(currentDate),
      } as FindOptionsWhere<T>;
    }

    return {
      ...baseOptions,
      ...(Object.keys(where).length > 0 && { where }),
    } as FindManyOptions<T>;
  }

  getEvent(id: number): Promise<Event | null> {
    return this.eventRepository.findOne({
      where: { id },
      relations: ['images'],
    });
  }
}
