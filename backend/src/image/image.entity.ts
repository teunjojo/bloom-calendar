import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

import { Event } from '@app/event/event.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  @ManyToOne(() => Event, (event) => event.images)
  events: Event[];
}
