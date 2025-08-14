import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import {
  CreateTaskRequestDto,
  UpdateTaskRequestDto,
} from 'src/models/dtos/task';
import { PaginationQueryDto } from 'src/models/dtos/common/pagination.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskRequestDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.taskService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskRequestDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}
