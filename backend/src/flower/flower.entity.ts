import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

import { Event } from '@app/event/event.entity';

@Entity()
export class Flower {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Event, (event) => event.bigFlowers)
  events: Event[];
}
