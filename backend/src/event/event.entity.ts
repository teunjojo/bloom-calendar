import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { formatTimestampWithoutTZ } from '@app/common/utils/date';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'timestamp',
    transformer: {
      to: (value: string) => value,
      from: (value: Date) => formatTimestampWithoutTZ(value),
    },
  })
  startDate: Date;

  @Column({
    type: 'timestamp',
    transformer: {
      to: (value: Date) => value,
      from: (value: Date) => formatTimestampWithoutTZ(value),
    },
  })
  endDate: Date;

  @Column({ nullable: true })
  blogLink: string;

  @Column({ nullable: true })
  imageUrl: string;
}
