import { Repository, In } from 'typeorm';
import { Project } from 'src/models/project.entity';
import { ProjectStatusCountStrategy } from './project-status-count.strategy';
import { AuthenticatedUser } from 'src/auth/get-user.decorator';
import { GetProjectStatusCountsResponseDto } from 'src/models/dtos/project/get-project-status-counts-response.dto';
import { ProjectStatus } from 'src/models/enums';
import { plainToInstance } from 'class-transformer';

/**
 * Estrategia para usuarios con rol ADMIN
 * Obtiene el conteo de TODOS los proyectos por status
 */
export class AdminProjectStatusCountStrategy
  implements ProjectStatusCountStrategy
{
  async execute(
    user: AuthenticatedUser,
    projectRepository: Repository<Project>,
  ): Promise<GetProjectStatusCountsResponseDto> {
    // Opción 2: Query Raw SQL (más eficiente - una sola consulta)
    const rawResult = await projectRepository.query(
      `
      SELECT
        COALESCE(SUM(CASE WHEN status = $1 THEN 1 ELSE 0 END), 0) as open,
        COALESCE(SUM(CASE WHEN status = $2 THEN 1 ELSE 0 END), 0) as finished,
        COALESCE(SUM(CASE WHEN status = $3 THEN 1 ELSE 0 END), 0) as cancelled
      FROM project
    `,
      [ProjectStatus.OPEN, ProjectStatus.FINISHED, ProjectStatus.CANCELLED],
    );

    const result = {
      open: parseInt(rawResult[0].open),
      finished: parseInt(rawResult[0].finished),
      cancelled: parseInt(rawResult[0].cancelled),
    };

    const dto = new GetProjectStatusCountsResponseDto();
    dto.open = result.open;
    dto.finished = result.finished;
    dto.cancelled = result.cancelled;

    return dto;
  }
}
