import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Forecast } from './forecast.entity';
import { ForecastController } from './forecast.controller';
import { ForecastService } from './forecast.service';

@Module({
  imports: [TypeOrmModule.forFeature([Forecast])],
  exports: [TypeOrmModule],
  controllers: [ForecastController],
  providers: [ForecastService],
})
export class ForecastModule {}
