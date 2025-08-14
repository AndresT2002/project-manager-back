import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { TaskStatus } from 'src/models/enums';
import { PaginatedResponseDto } from '../common/pagination.dto';

export class GetTaskResponseDto {
  @ApiProperty({
    description: 'The ID of the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  readonly id: string;

  @ApiProperty({
    description: 'The title of the task',
    example: 'Task 1',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    description: 'The description of the task',
    example: 'Task 1 description',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({
    description: 'The status of the task',
    example: TaskStatus.TODO,
    enum: TaskStatus,
  })
  @Expose()
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  readonly status: TaskStatus;

  @ApiProperty({
    description: 'The project ID of the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  readonly projectId: string;

  @ApiProperty({
    description: 'The assignee ID of the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  readonly assigneeId: string;

  @ApiProperty({
    description: 'The due date of the task',
    example: '2024-01-01T10:00:00Z',
  })
  @Expose()
  @Transform(({ value }) =>
    value instanceof Date ? value.toISOString() : value,
  )
  @IsDateString()
  @IsNotEmpty()
  readonly dueDate: string;

  @ApiProperty({
    description: 'The start date of the task',
    example: '2024-01-01T09:00:00Z',
  })
  @Expose()
  @Transform(({ value }) =>
    value instanceof Date ? value.toISOString() : value,
  )
  @IsDateString()
  @IsNotEmpty()
  readonly startDate: string;

  @ApiProperty({
    description: 'The ID of the user who created this task',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  readonly createdBy: string;

  @ApiProperty({
    description: 'Whether the task is active',
    example: true,
  })
  @Expose()
  @IsBoolean()
  @IsNotEmpty()
  readonly isActive: boolean;

  @ApiProperty({
    description: 'When the task was created',
    example: '2024-01-15T10:30:00.000Z',
  })
  @Expose()
  @Transform(({ value }) =>
    value instanceof Date ? value.toISOString() : value,
  )
  @IsDateString()
  @IsNotEmpty()
  readonly createdAt: string;

  @ApiProperty({
    description: 'When the task was last updated',
    example: '2024-01-15T10:30:00.000Z',
  })
  @Expose()
  @Transform(({ value }) =>
    value instanceof Date ? value.toISOString() : value,
  )
  @IsDateString()
  @IsNotEmpty()
  readonly updatedAt: string;
}

// Usar el DTO genérico de paginación
export type GetTasksResponseDto = PaginatedResponseDto<GetTaskResponseDto>;
