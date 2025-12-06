import { Entity, ManyToMany, JoinTable, ManyToOne } from 'typeorm';

import { Flower } from '@app/flower/flower.entity';
import { Event } from '@app/event/event.entity';

@Entity()
export class Forecast extends Event {
  @ManyToMany(() => Flower, (flower) => flower.forecasts)
  @JoinTable()
  bigFlowers: Flower[];

  @ManyToOne(() => Flower, (flower) => flower.forecasts)
  flowerOfTheMonth: Flower;
}
