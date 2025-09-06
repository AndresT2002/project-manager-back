// auditable.entity.ts
import { Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';

/*
  Esta entidad es para auditar las entidades y agregar los campos createdById y updatedById
  Es decir:
  - createdById: ID del usuario que crea la entidad
  - updatedById: ID del usuario que actualiza la entidad
  - createdBy: Usuario que crea la entidad
  - updatedBy: Usuario que actualiza la entidad

  Importante: Tener en cuenta que se van a utilizar dos columnas: createdById y updatedById
  Entonces si se quiere obtener el usuario que creó o actualizó la entidad, se debe obtener los campos createdBy y updatedBy

  Es decir, si se quiere obtener el usuario que creó la entidad, se debe obtener el campo createdBy
  Si se quiere obtener el usuario que actualizó la entidad, se debe obtener el campo updatedBy

  Esto es importante para obtener el usuario que creó o actualizó la entidad

  Se supera utilizar la entidad User directamente, sino creando las relaciones ( muchos-a-uno ) con la entidad User

  También se crearon los campos createdById y updatedById, para poder manejar la creación / actualización / obtención
  del usuario sea usando las columnas creadasBy y updatedBy o las columnas createdById y updatedById

*/

export abstract class AuditableEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  createdById?: string | null;

  @Column({ type: 'uuid', nullable: true })
  updatedById?: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'createdById' })
  createdBy?: User | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updatedById' })
  updatedBy?: User | null;
}
