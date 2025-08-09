import { Column, Entity, OneToMany, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Role } from './enums';
import { Project } from './project.entity';
import { Task } from './task.entity';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 300 })
  name: string;

  @Column({ type: 'varchar', length: 300 })
  lastName: string;

  @Column({ type: 'varchar', length: 300 })
  fullName: string;

  @Column({ type: 'varchar', length: 300 })
  email: string;

  @Column({ type: 'varchar', length: 300 })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.MEMBER,
  })
  role: Role;

  // Relaciones
  @OneToMany(() => Project, (project) => project.owner)
  ownedProjects: Project[];

  @ManyToMany(() => Project, (project) => project.members)
  memberProjects: Project[];

  @OneToMany(() => Task, (task) => task.assignee)
  assignedTasks: Task[];
}
