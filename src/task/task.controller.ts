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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { TaskService } from './task.service';
import {
  CreateTaskRequestDto,
  UpdateTaskRequestDto,
  GetTasksResponseDto,
  GetTaskResponseDto,
} from 'src/models/dtos/task';
import { PaginationQueryDto } from 'src/models/dtos/common/pagination.dto';

@ApiTags('tasks')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva tarea',
    description: 'Crea una nueva tarea en el sistema',
  })
  @ApiBody({
    type: CreateTaskRequestDto,
    description: 'Datos de la tarea a crear',
  })
  @ApiResponse({
    status: 201,
    description: 'Tarea creada exitosamente',
    type: GetTaskResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  create(@Body() createTaskDto: CreateTaskRequestDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las tareas',
    description: 'Retorna una lista paginada de todas las tareas',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página (por defecto: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Elementos por página (por defecto: 10)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tareas obtenida exitosamente',
    type: GetTasksResponseDto,
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.taskService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una tarea por ID',
    description: 'Retorna una tarea específica por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la tarea',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Tarea encontrada exitosamente',
    type: GetTaskResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Tarea no encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una tarea',
    description: 'Actualiza una tarea existente por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la tarea a actualizar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateTaskRequestDto,
    description: 'Datos de la tarea a actualizar',
  })
  @ApiResponse({
    status: 200,
    description: 'Tarea actualizada exitosamente',
    type: GetTaskResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Tarea no encontrada',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskRequestDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una tarea',
    description: 'Elimina una tarea existente por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la tarea a eliminar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Tarea eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Tarea no encontrada',
  })
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}
