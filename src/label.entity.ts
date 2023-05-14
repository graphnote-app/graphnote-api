import { randomUUID } from 'crypto';
import { Entity, Column, PrimaryColumn } from 'typeorm';

export class LabelDTO {
  id: string;
  title: string;
  workspace: string;
  color: string;
  createdAt: string;
  modifiedAt: string;

  constructor(
    id: string,
    title: string,
    workspace: string,
    color: string,
    createdAt: string,
    modifiedAt: string
  ) {
    this.id = id
    this.title = title
    this.workspace = workspace
    this.color = color
    this.createdAt = createdAt
    this.modifiedAt = modifiedAt
  }
}

@Entity()
export class Label {
  @PrimaryColumn()
  id: string;
  
  @Column()
  title: string;

  @Column()
  workspace: string;

  @Column()
  color: string;

  @Column({ type: 'timestamp with time zone' })
  createdAt: string;

  @Column({ type: 'timestamp with time zone' })
  modifiedAt: string;
}
