import { Repository, In } from 'typeorm';
import { Project } from 'src/models/project.entity';
import { ProjectStatusCountStrategy } from './project-status-count.strategy';
import { AuthenticatedUser } from 'src/auth/get-user.decorator';
import { GetProjectStatusCountsDto } from 'src/models/dtos/project/get-project-status-counts-response.dto';
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
  ): Promise<GetProjectStatusCountsDto> {
    const counts = await projectRepository.count({
      where: {
        ownerId: user.id,
        status: In([
          ProjectStatus.OPEN,
          ProjectStatus.FINISHED,
          ProjectStatus.CANCELLED,
        ]),
      },
    });

    return plainToInstance(GetProjectStatusCountsDto, counts, {
      excludeExtraneousValues: true,
    });
  }
}
