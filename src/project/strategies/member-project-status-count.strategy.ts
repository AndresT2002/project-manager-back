import { Repository, In } from 'typeorm';
import { Project } from 'src/models/project.entity';
import { ProjectStatusCountStrategy } from './project-status-count.strategy';
import { AuthenticatedUser } from 'src/auth/get-user.decorator';
import { GetProjectStatusCountsDto } from 'src/models/dtos/project/get-project-status-counts-response.dto';
import { plainToInstance } from 'class-transformer';

/**
 * Estrategia para usuarios con rol MEMBER
 * Obtiene el conteo de proyectos donde el usuario es miembro
 */
export class MemberProjectStatusCountStrategy
  implements ProjectStatusCountStrategy
{
  async execute(
    user: AuthenticatedUser,
    projectRepository: Repository<Project>,
  ): Promise<GetProjectStatusCountsDto> {
    const counts = await projectRepository.count({
      where: {
        members: In([user.id]),
      },
    });

    return plainToInstance(GetProjectStatusCountsDto, counts, {
      excludeExtraneousValues: true,
    });
  }
}
