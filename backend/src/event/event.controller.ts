import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
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
  async getEvent(@Param('id') id: number): Promise<Event | null> {
    const event = await this.eventService.getEvent(id);
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }
}
