import { IsDateString, IsOptional, IsString } from 'class-validator';
import { FilterDto } from '@app/common/dto/filter-dto';

export class EventFilterDto extends FilterDto {
  @IsOptional()
  @IsString()
  eventType?: string;

  @IsOptional()
  @IsDateString()
  currentDate?: string;
}
