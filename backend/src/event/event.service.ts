import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { Event } from './event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  getAll(eventType?: string): Promise<Event[]> {
    const options: FindManyOptions<Event> = {
      select: ['id', 'name'],
    };

    if (eventType) {
      options.where = { eventType };
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
