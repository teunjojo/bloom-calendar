import { Controller, Get, Param } from '@nestjs/common';
import { EventService as EventService } from './event.service';
import { Event } from './interfaces/event.interface';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}
  @Get()
  getAll(): Event[] {
    return this.eventService.getAll();
  }

  @Get(':id')
  getEvent(@Param('id') id: string): Event {
    return this.eventService.getEvent(id);
  }
}
