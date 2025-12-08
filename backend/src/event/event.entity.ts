import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { formatTimestampWithoutTZ } from '@app/common/utils/date';

import { Image } from '@app/image/image.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ nullable: true })
  blogLink: string;

  @OneToMany(() => Image, (image) => image.events)
  images: string[];
}
