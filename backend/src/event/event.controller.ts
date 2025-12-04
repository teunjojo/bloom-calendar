import { Controller, Get, Param } from '@nestjs/common';
import { EventService as EventService } from './event.service';
import { Event } from './event.entity';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}
  @Get()
  getAll(): Promise<Event[]> {
    return this.eventService.getAll();
  }

  @Get(':id')
  getEvent(@Param('id') id: number): Promise<Event | null> {
    return this.eventService.getEvent(id);
  }
}
