import { IsDateString, IsOptional } from 'class-validator';
import { FilterDto } from '@app/common/dto/filter-dto';

export class EventFilterDto extends FilterDto {
  @IsOptional()
  @IsDateString()
  currentDate?: string;
}
