import { randomUUID } from 'crypto';
import { Entity, Column, PrimaryColumn } from 'typeorm';

export class WorkspaceDTO {
  id: string;
  title: string;
  user: string;
  labels: string[];
  documents: string[];
  createdAt: string;
  modifiedAt: string;

  constructor(
    id: string,
    title: string,
    user: string,
    labels: string[],
    documents: string[],
    createdAt: string,
    modifiedAt: string
  ) {
    this.id = id
    this.title = title
    this.user = user
    this.labels = labels
    this.documents = documents
    this.createdAt = createdAt
    this.modifiedAt = modifiedAt
  }
}

@Entity()
export class Workspace {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  user: string;

  @Column("text", { array: true })
  labels: string[];

  @Column("text", { array: true })
  documents: string[];

  @Column({ type: 'timestamp with time zone' })
  createdAt: string;

  @Column({ type: 'timestamp with time zone' })
  modifiedAt: string;
}
