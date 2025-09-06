import { Repository } from 'typeorm';
import { Project } from 'src/models/project.entity';
import { AuthenticatedUser } from 'src/auth/get-user.decorator';
import { GetProjectStatusCountsResponseDto } from 'src/models/dtos/project/get-project-status-counts-response.dto';

/**
 * Interfaz Strategy para definir el contrato de las estrategias de conteo de proyectos por status
 */
export interface ProjectStatusCountStrategy {
  /**
   * Ejecuta la lógica específica para contar proyectos según el rol del usuario
   * @param user Usuario autenticado
   * @param projectRepository Repositorio de proyectos
   * @returns Conteo de proyectos por status
   */
  execute(
    user: AuthenticatedUser,
    projectRepository: Repository<Project>,
  ): Promise<GetProjectStatusCountsResponseDto>;
}
