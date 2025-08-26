import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from 'src/models/dtos/project/create-project-request.dto';
import { UpdateProjectDto } from 'src/models/dtos/project/update-project-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Like, Repository } from 'typeorm';
import { Project } from 'src/models/project.entity';
import { plainToInstance } from 'class-transformer';
import { CreateProjectResponseDto } from 'src/models/dtos/project/create-project-response.dto';
import {
  GetProjectResponseDto,
  GetProjectsResponseDto,
} from 'src/models/dtos/project/get-projects-response.dto';
import { UpdateProjectResponseDto } from 'src/models/dtos/project/update-project-response.dto';
import { GetProjectsQueryDto } from 'src/models/dtos/project/get-projects-query.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    // 1. Se debe hacer el create del proyecto
    const project = this.projectRepository.create(createProjectDto);
    // 2. Se debe hacer el save del proyecto
    const savedProject = await this.projectRepository.save(project);
    // 3. Se debe hacer el return del proyecto
    return plainToInstance(CreateProjectResponseDto, savedProject, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(query: GetProjectsQueryDto): Promise<GetProjectsResponseDto> {
    const {
      page,
      pageSize,
      ownerId,
      memberId,
      taskId,
      search,
      sortBy,
      sortOrder,
    } = query;
    const skip = ((page ?? 1) - 1) * (pageSize ?? 10);
    const take = pageSize ?? 10;
    const order = { [sortBy ?? 'createdAt']: sortOrder ?? 'DESC' };

    // Construir las condiciones where
    const whereConditions: FindOptionsWhere<Project> = {};
    if (ownerId) {
      whereConditions.ownerId = ownerId;
    }
    if (memberId) {
      whereConditions.members = In([memberId]);
    }
    if (taskId) {
      whereConditions.tasks = In([taskId]);
    }
    if (search) {
      whereConditions.name = Like(`%${search}%`);
    }

    // Construir las opciones de consulta
    const findOptions: any = {
      skip,
      take,
      order,
    };

    // Solo agregar where si hay condiciones
    if (Object.keys(whereConditions).length > 0) {
      findOptions.where = whereConditions;
    }

    const [projects, total] =
      await this.projectRepository.findAndCount(findOptions);

    const projectDtos = plainToInstance(GetProjectResponseDto, projects, {
      excludeExtraneousValues: true,
    });

    return {
      data: projectDtos,
      meta: {
        page: page ?? 1,
        pageSize: pageSize ?? 10,
        total,
        totalPages: Math.ceil(total / (pageSize ?? 10)),
        hasNext: (page ?? 1) < Math.ceil(total / (pageSize ?? 10)),
        hasPrevious: (page ?? 1) > 1,
        itemCount: projects.length,
      },
    };
  }

  async findOne(id: string) {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return plainToInstance(GetProjectResponseDto, project, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    Object.assign(project, updateProjectDto);
    const updatedProject = await this.projectRepository.save(project);
    return plainToInstance(UpdateProjectResponseDto, updatedProject, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string) {
    const result = await this.projectRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Project not found');
    }
    return true;
  }
}
