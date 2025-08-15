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
  GetTasksQueryDto,
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
  create(
    @Body() createTaskDto: CreateTaskRequestDto,
  ): Promise<GetTaskResponseDto> {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las tareas',
    description:
      'Retorna una lista paginada de todas las tareas con filtros opcionales',
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
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['todo', 'in_progress', 'done'],
    description: 'Filtrar por estado de la tarea',
  })
  @ApiQuery({
    name: 'projectId',
    required: false,
    type: String,
    description: 'Filtrar por ID del proyecto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'assigneeId',
    required: false,
    type: String,
    description: 'Filtrar por ID del asignado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'createdBy',
    required: false,
    type: String,
    description: 'Filtrar por ID del creador',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'dueDateAfter',
    required: false,
    type: String,
    description:
      'Filtrar tareas con fecha de vencimiento después de esta fecha',
    example: '2024-01-01T00:00:00Z',
  })
  @ApiQuery({
    name: 'dueDateBefore',
    required: false,
    type: String,
    description: 'Filtrar tareas con fecha de vencimiento antes de esta fecha',
    example: '2024-12-31T23:59:59Z',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Buscar en título y descripción de la tarea',
    example: 'implement feature',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: [
      'id',
      'title',
      'status',
      'dueDate',
      'startDate',
      'createdAt',
      'updatedAt',
    ],
    description: 'Campo por el cual ordenar (por defecto: createdAt)',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Orden de clasificación (por defecto: DESC)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tareas obtenida exitosamente',
    type: GetTasksResponseDto,
  })
  findAll(@Query() query: GetTasksQueryDto): Promise<GetTasksResponseDto> {
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
  findOne(@Param('id') id: string): Promise<GetTaskResponseDto> {
    return this.taskService.findOne({ id });
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
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskRequestDto,
  ): Promise<GetTaskResponseDto> {
    return this.taskService.update(id, updateTaskDto);
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
  remove(@Param('id') id: string): Promise<boolean> {
    return this.taskService.remove(id);
  }
}
