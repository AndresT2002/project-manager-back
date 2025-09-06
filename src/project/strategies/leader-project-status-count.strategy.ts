import { Repository, In } from 'typeorm';
import { Project } from 'src/models/project.entity';
import { ProjectStatusCountStrategy } from './project-status-count.strategy';
import { AuthenticatedUser } from 'src/auth/get-user.decorator';
import { GetProjectStatusCountsResponseDto } from 'src/models/dtos/project/get-project-status-counts-response.dto';
import { ProjectStatus } from 'src/models/enums';
import { plainToInstance } from 'class-transformer';

/**
 * Estrategia para usuarios con rol LEADER
 * Obtiene el conteo de proyectos donde el usuario es el propietario (owner)
 */
export class LeaderProjectStatusCountStrategy
  implements ProjectStatusCountStrategy
{
  async execute(
    user: AuthenticatedUser,
    projectRepository: Repository<Project>,
  ): Promise<GetProjectStatusCountsResponseDto> {
    // Contar proyectos por cada status
    const [openCount, finishedCount, cancelledCount] = await Promise.all([
      projectRepository.count({
        where: {
          ownerId: user.id,
          status: ProjectStatus.OPEN,
        },
      }),
      projectRepository.count({
        where: {
          ownerId: user.id,
          status: ProjectStatus.FINISHED,
        },
      }),
      projectRepository.count({
        where: {
          ownerId: user.id,
          status: ProjectStatus.CANCELLED,
        },
      }),
    ]);

    const result = {
      open: openCount,
      finished: finishedCount,
      cancelled: cancelledCount,
    };
    console.log('🔍 Leader Result:', result);

    const dto = new GetProjectStatusCountsResponseDto();
    dto.open = result.open;
    dto.finished = result.finished;
    dto.cancelled = result.cancelled;

    console.log('🔍 Leader DTO:', dto);
    return dto;
  }
}
