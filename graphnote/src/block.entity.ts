import { randomUUID } from 'crypto';
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

export class BlockDTO {
  id: string;
  document: string;
  type: string;
  content: string;
  prev: string;
  next: string;
  createdAt: string;
  modifiedAt: string;

  constructor(
    id: string,
    document: string,
    type: string,
    content: string,
    prev: string,
    next: string,
    createdAt: string,
    modifiedAt: string
  ) {
    this.id = id
    this.document = document
    this.type = type
    this.content = content
    this.prev = prev
    this.next = next
    this.createdAt = createdAt
    this.modifiedAt = modifiedAt
  }
}

@Entity('block_entities')
export class Block {
  @PrimaryColumn()
  id: string;

  @Column()
  document: string;

  @Column()
  type: string;

  @Column()
  content: string;

  @Column({nullable: true})
  prev: string;

  @Column({nullable: true})
  next: string;

  @Column({ type: 'timestamp with time zone' })
  createdAt: string;

  @Column({ type: 'timestamp with time zone' })
  modifiedAt: string;
}