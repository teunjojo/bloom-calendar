import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Flower } from './flower.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Flower])],
  exports: [TypeOrmModule],
  controllers: [],
  providers: [],
})
export class FlowerModule {}
