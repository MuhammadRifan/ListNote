/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { List } from './List';
import { User } from './User';

@Entity({ name: 'notes' })
export class Note {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  title: string;

  @Column({ default: false })
  pin: boolean;

  @Column({ default: false })
  showTime: boolean;

  @Column({ default: false })
  withCheckbox: boolean;

  @ManyToOne(() => User, (user) => user.note)
  user: User;

  @OneToMany(() => List, (list) => list.note)
  list: List;
}
