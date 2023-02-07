/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { List } from './List';

@Entity({ name: 'note' })
export class Note {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  note: string;

  @Column()
  dtEdited: Date;

  
  @Column({ default: false })
  checked: boolean;
  
  @ManyToOne(() => List, (list) => list.notes)
  notes: List;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
