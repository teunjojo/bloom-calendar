import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';

import { Event } from '@app/event/event.entity';
import { Forecast } from '@app/forecast/forecast.entity';

@Entity()
export class Flower {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  name: string;

  @OneToMany(() => Forecast, (forecast) => forecast.flowerOfTheMonth)
  @ManyToMany(() => Forecast, (forecast) => forecast.bigFlowers)
  forecasts: Forecast[];
}
