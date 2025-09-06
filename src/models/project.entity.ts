import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { AuditableEntity } from './audit-base.entity';
import { User } from './user.entity';
import { Task } from './task.entity';
import { ProjectStatus } from './enums';

@Entity({ name: 'project' })
export class Project extends AuditableEntity {
  @Column({ type: 'varchar', length: 300 })
  name: string;

  @Column({ type: 'varchar', length: 300 })
  description: string;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @Column({ type: 'uuid' })
  ownerId: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.OPEN,
  })
  status: ProjectStatus;

  // Relaciones
  @ManyToOne(() => User, (user) => user.ownedProjects)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @ManyToMany(() => User, (user) => user.memberProjects)
  @JoinTable({
    name: 'project_members',
    joinColumn: { name: 'projectId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  members: User[];

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}
