import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TaskStatus } from './enums';
@Entity({ name: 'task' })
export class Task extends BaseEntity {
  @Column({ type: 'varchar', length: 300 })
  title: string;

  @Column({ type: 'varchar', length: 300 })
  description: string;

  @Column({ type: 'varchar', length: 300 })
  status: TaskStatus;

  @Column({ type: 'varchar', length: 300 })
  projectId: string;

  @Column({ type: 'varchar', length: 300 })
  assigneeId: string;

  @Column({ type: 'timestamptz' })
  dueDate: Date;

  @Column({ type: 'timestamptz' })
  startDate: Date;
}
