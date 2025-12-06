import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { Flower } from '@app/flower/flower.entity';
import { formatTimestampWithoutTZ } from '@app/common/utils/date';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  eventType: string;

  @Column()
  @Column({
    type: 'timestamp',
    transformer: {
      to: (value: string) => value,
      from: (value: Date) => formatTimestampWithoutTZ(value),
    },
  })
  startDate: string;

  @Column({
    type: 'timestamp',
    transformer: {
      to: (value: Date) => value,
      from: (value: Date) => formatTimestampWithoutTZ(value),
    },
  })
  endDate: string;

  @ManyToMany(() => Flower, (flower) => flower.events)
  @JoinTable()
  bigFlowers: Flower[];
}
