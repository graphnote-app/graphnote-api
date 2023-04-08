import { randomUUID } from 'crypto';
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryColumn()
  id: string;

  @Column()
  user: string;

  @Column({ type: 'timestamp with time zone' })
  timestamp: string;

  @Column()
  type: string;

  @Column()
  action: string;

  @Column()
  isSynced: boolean

  @Column()
  contents: string;
}
