import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TaskStatus } from './enums';
import { User } from './user.entity';
import { Project } from './project.entity';
@Entity({ name: 'task' })
export class Task extends BaseEntity {
  @Column({ type: 'varchar', length: 300 })
  title: string;

  @Column({ type: 'varchar', length: 300 })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column({ type: 'uuid' })
  projectId: string;

  @Column({ type: 'uuid' })
  assigneeId: string;

  @Column({ type: 'timestamptz' })
  dueDate: Date;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  // Relaciones
  @ManyToOne(() => Project, (project) => project.tasks)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @ManyToOne(() => User, (user) => user.assignedTasks)
  @JoinColumn({ name: 'assigneeId' })
  assignee: User;
}
