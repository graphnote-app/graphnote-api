import { randomUUID } from 'crypto';
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity('user_entities')
export class User {
  @PrimaryColumn()
  id: string;

  @Column({unique: true})
  email: string;

  @Column({nullable: true})
  givenName: string | null;

  @Column({nullable: true})
  familyName: string | null;

  @Column({ type: 'timestamp with time zone' })
  createdAt: string;

  @Column({ type: 'timestamp with time zone' })
  modifiedAt: string;
}