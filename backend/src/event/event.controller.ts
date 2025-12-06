import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { EventService as EventService } from './event.service';
import { Event } from './event.entity';
import { EventFilterDto } from './dto/event-filter.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}
  @Get()
  getAll(@Query() filterDto: EventFilterDto): Promise<Event[]> {
    return this.eventService.getAll(filterDto);
  }

  @Get(':id')
  async getEvent(@Param('id') id: number): Promise<Event> {
    const event = await this.eventService.getEvent(id);
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }
}
