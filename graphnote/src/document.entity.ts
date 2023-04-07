import { randomUUID } from 'crypto';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Document {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'timestamp with time zone' })
  createdAt: string;

  @Column({ type: 'timestamp with time zone' })
  modifiedAt: string;

  @Column()
  title: string;

  @Column()
  workspace: string;

}
