import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Project } from 'src/models/project.entity';
import { ProjectStatusCountStrategy } from './project-status-count.strategy';
import { AdminProjectStatusCountStrategy } from './admin-project-status-count.strategy';
import { LeaderProjectStatusCountStrategy } from './leader-project-status-count.strategy';
import { MemberProjectStatusCountStrategy } from './member-project-status-count.strategy';
import { AuthenticatedUser } from 'src/auth/get-user.decorator';
import { GetProjectStatusCountsDto } from 'src/models/dtos/project/get-project-status-counts-response.dto';
import { Role } from 'src/models/enums';

/**
 * Contexto que implementa el patrón Strategy para seleccionar la estrategia
 * apropiada según el rol del usuario
 */
@Injectable()
export class ProjectStatusCountContext {
  private strategies: Map<Role, ProjectStatusCountStrategy> = new Map();

  constructor() {
    // Registrar las estrategias para cada rol
    this.strategies.set(Role.ADMIN, new AdminProjectStatusCountStrategy());
    this.strategies.set(Role.LEADER, new LeaderProjectStatusCountStrategy());
    this.strategies.set(Role.MEMBER, new MemberProjectStatusCountStrategy());
  }

  /**
   * Ejecuta la estrategia correspondiente al rol del usuario
   * @param user Usuario autenticado
   * @param projectRepository Repositorio de proyectos
   * @returns Resultado de la estrategia ejecutada
   */
  async executeStrategy(
    user: AuthenticatedUser,
    projectRepository: Repository<Project>,
  ): Promise<GetProjectStatusCountsDto> {
    const strategy = this.strategies.get(user.role);

    if (!strategy) {
      throw new BadRequestException(
        `No se encontró una estrategia para el rol: ${user.role}`,
      );
    }

    return strategy.execute(user, projectRepository);
  }

  /**
   * Método para agregar nuevas estrategias dinámicamente (útil para testing o extensiones)
   * @param role Rol para el que se registra la estrategia
   * @param strategy Estrategia a registrar
   */
  registerStrategy(role: Role, strategy: ProjectStatusCountStrategy): void {
    this.strategies.set(role, strategy);
  }
}
