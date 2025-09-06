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
    // Contar TODOS los proyectos por cada status (para ADMIN)
    const [openCount, finishedCount, cancelledCount] = await Promise.all([
      projectRepository.count({
        where: {
          status: ProjectStatus.OPEN,
        },
      }),
      projectRepository.count({
        where: {
          status: ProjectStatus.FINISHED,
        },
      }),
      projectRepository.count({
        where: {
          status: ProjectStatus.CANCELLED,
        },
      }),
    ]);

    const result = {
      open: openCount,
      finished: finishedCount,
      cancelled: cancelledCount,
    };

    console.log('🔍 Admin Result:', result);

    const dto = new GetProjectStatusCountsResponseDto();
    dto.open = result.open;
    dto.finished = result.finished;
    dto.cancelled = result.cancelled;

    console.log('🔍 Admin DTO:', dto);
    return dto;
  }
}
