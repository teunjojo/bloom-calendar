import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { formatTimestampWithoutTZ } from '@app/common/utils/date';

import { Image } from '@app/image/image.entity';

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

  @OneToMany(() => Image, (image) => image.events)
  images: string[];
}
