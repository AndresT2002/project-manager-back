import { Injectable } from '@nestjs/common';
import {
  CreateTaskRequestDto,
  GetTaskResponseDto,
  GetTasksResponseDto,
} from 'src/models/dtos/task';
import { UpdateTaskRequestDto } from 'src/models/dtos/task';
import { Task } from 'src/models/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findAll(query: PaginationQueryDto): Promise<GetTasksResponseDto> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const skip = (page - 1) * pageSize;

    // Obtener el total de registros
    const total = await this.repo.count();

    // Obtener los registros de la página actual
    const tasks = await this.repo.find({
      skip,
      take: pageSize,
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
