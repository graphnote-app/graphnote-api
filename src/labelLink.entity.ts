import { randomUUID } from 'crypto';
import { Entity, Column, PrimaryColumn } from 'typeorm';

export class LabelLinkDTO {
  id: string;
  label: string;
  document: string;
  workspace: string;
  createdAt: string;
  modifiedAt: string;

  constructor(
    id: string,
    label: string,
    document: string,
    workspace: string,
    createdAt: string,
    modifiedAt: string
  ) {
    this.id = id
    this.label = label
    this.document = document
    this.workspace = workspace
    this.createdAt = createdAt
    this.modifiedAt = modifiedAt
  }
}

@Entity()
export class LabelLink {
  @PrimaryColumn()
  id: string;
  
  @Column()
  label: string;

  @Column()
  workspace: string;

  @Column()
  document: string;

  @Column({ type: 'timestamp with time zone' })
  createdAt: string;

  @Column({ type: 'timestamp with time zone' })
  modifiedAt: string;
}
