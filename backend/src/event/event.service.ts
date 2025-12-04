import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Event } from './event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  getAll(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  getEvent(id: number): Promise<Event | null> {
    return this.eventRepository.findOneBy({ id });
  }
}
