import { randomUUID } from 'crypto';
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'timestamp with time zone' })
  timestamp: string;


  @Column()
  type: string;

  @Column()
  contents: string;
}
