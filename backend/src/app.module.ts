import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { typeOrmConfig } from './config/typeorm.config';

import { EventModule } from './event/event.module';
import { FlowerModule } from './flower/flower.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    EventModule,
    FlowerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
