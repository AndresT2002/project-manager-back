import { Injectable, NotFoundException } from '@nestjs/common';
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
import { GetTaskQueryDto } from 'src/models/dtos/task/get-task-query.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly repo: Repository<Task>,
  ) {}
  async create(createTaskDto: CreateTaskRequestDto) {
    // Todo: Pendiente agregar el createdBy, que es el id del usuario que crea la tarea, que se obtiene del token de autenticación

    // 1. Convertir el DTO a una entidad
    const task = this.repo.create(createTaskDto);

    // 2. Guardar la entidad en la base de datos
    const savedTask = await this.repo.save(task);

    // 3. Retornar el DTO convertido
    return plainToInstance(GetTaskResponseDto, savedTask, {
      excludeExtraneousValues: true,
    });
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

  async findOne(query: GetTaskQueryDto): Promise<GetTaskResponseDto> {
    const task = await this.repo.findOne({
      where: { id: query.id },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return plainToInstance(GetTaskResponseDto, task, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskRequestDto) {
    // 1. Validar que el task exista
    const task = await this.repo.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // 2. Mergea propiedades de forma segura
    Object.assign(task, updateTaskDto);

    // 3. Guardar el task actualizado
    const updatedTask = await this.repo.save(task);

    // 4. Retornar el task actualizado
    return plainToInstance(GetTaskResponseDto, updatedTask, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string): Promise<boolean> {
    //Al usar el delete, se retorna un objeto con el número de filas afectadas
    //Si el número de filas afectadas es 0, significa que el task no existe, por lo que nos ahorramos una consulta a la base de datos y lanza un error

    const result = await this.repo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }

    return true;
  }
}
