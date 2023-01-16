/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Note } from './Note';
import { User } from './User';

export enum sortType {
  DefaultAsc,
  DefaultDsc,
  DateAsc,
  DateDsc,
  AlphaAsc,
  AlphaDsc,
}

@Entity({ name: 'list' })
export class List {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  
  @Column({ default: false })
  pin: boolean;

  @Column()
  title: string;

  @OneToMany(() => Note, (notes) => notes.notes)
  notes: Note;

  @Column()
  idNote: number;

  @Column()
  dtEdited: Date;

  @Column()
  sortType: sortType;
  
  @Column({ default: false })
  showTime: boolean;
  
  @Column({ default: false })
  withCheckbox: boolean;
  
  @ManyToOne(() => User, (user) => user.lists)
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
