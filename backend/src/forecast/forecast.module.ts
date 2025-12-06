import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Forecast } from './forecast.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Forecast])],
  exports: [TypeOrmModule],
  controllers: [],
  providers: [],
})
export class ForecastModule {}
