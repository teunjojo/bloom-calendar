import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { Event } from './event.entity';
import { EventFilterDto } from './dto/event-filter.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  getAll(eventFilterDto: EventFilterDto): Promise<Event[]> {
    const options: FindManyOptions<Event> = {
      select: ['id', 'name'],
    };

    if (eventFilterDto.eventType) {
      options.where = { eventType: eventFilterDto.eventType };
    }

    return this.eventRepository.find(options);
  }

  getEvent(id: number): Promise<Event | null> {
    return this.eventRepository.findOne({
      relations: ['bigFlowers'],
      where: { id },
    });
  }
}
