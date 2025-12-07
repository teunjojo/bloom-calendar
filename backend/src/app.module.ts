import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { typeOrmConfig } from './config/typeorm.config';

import { EventModule } from './event/event.module';
import { FlowerModule } from './flower/flower.module';
import { ForecastModule } from './forecast/forecast.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: typeOrmConfig,
    }),
    EventModule,
    FlowerModule,
    ForecastModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
