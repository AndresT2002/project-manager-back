import { Injectable } from '@nestjs/common';
import {
  CreateTaskRequestDto,
  GetTaskResponseDto,
  GetTasksQueryDto,
  GetTasksResponseDto,
} from 'src/models/dtos/task';
import { UpdateTaskRequestDto } from 'src/models/dtos/task';
import { Task } from 'src/models/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { PaginationQueryDto } from 'src/models/dtos/common/pagination.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly repo: Repository<Task>,
  ) {}
  create(createTaskDto: CreateTaskRequestDto) {
    return 'This action adds a new task';
  }

  async findAll(query: GetTasksQueryDto): Promise<GetTasksResponseDto> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const skip = (page - 1) * pageSize;

    // Construir condiciones de búsqueda
    const whereConditions: any = {};

    // Filtros básicos
    if (query.status) whereConditions.status = query.status;
    if (query.projectId) whereConditions.projectId = query.projectId;
    if (query.assigneeId) whereConditions.assigneeId = query.assigneeId;
    if (query.createdBy) whereConditions.createdBy = query.createdBy;

    // Filtros de fecha
    if (query.dueDateAfter && query.dueDateBefore) {
      whereConditions.dueDate =
        MoreThan(new Date(query.dueDateAfter)) &&
        LessThan(new Date(query.dueDateBefore));
    } else if (query.dueDateAfter) {
      whereConditions.dueDate = MoreThan(new Date(query.dueDateAfter));
    } else if (query.dueDateBefore) {
      whereConditions.dueDate = LessThan(new Date(query.dueDateBefore));
    }

    // Validar campo de ordenamiento
    const allowedSortFields = [
      'id',
      'title',
      'status',
      'dueDate',
      'startDate',
      'createdAt',
      'updatedAt',
    ];
    const sortBy = allowedSortFields.includes(query.sortBy ?? 'createdAt')
      ? (query.sortBy ?? 'createdAt')
      : 'createdAt';
    const sortOrder = query.sortOrder ?? 'DESC';

    // Construir condiciones de búsqueda
    let whereClause = whereConditions;
    if (query.search) {
      whereClause = [
        { ...whereConditions, title: { $ilike: `%${query.search}%` } },
        { ...whereConditions, description: { $ilike: `%${query.search}%` } },
      ];
    }

    // Obtener el total de registros con filtros
    const total = await this.repo.count({
      where: whereClause,
    });

    // Obtener los registros de la página actual
    const tasks = await this.repo.find({
      skip,
      take: pageSize,
      where: whereClause,
      order: {
        [sortBy]: sortOrder,
      },
    });

    const taskDtos = plainToInstance(GetTaskResponseDto, tasks, {
      excludeExtraneousValues: true,
    });

    const totalPages = Math.ceil(total / pageSize);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
      data: taskDtos,
      meta: {
        page,
        pageSize,
        total,
        totalPages,
        hasNext,
        hasPrevious,
        itemCount: tasks.length,
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskRequestDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
