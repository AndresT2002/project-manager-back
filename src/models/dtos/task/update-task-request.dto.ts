import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { TaskStatus } from 'src/models/enums';

export class UpdateTaskRequestDto {
  @ApiProperty({
    description: 'The title of the task',
    example: 'Task 1',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'The description of the task',
    example: 'Task 1 description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The status of the task',
    example: TaskStatus.TODO,
    required: false,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({
    description: 'The project ID of the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  projectId?: string;

  @ApiProperty({
    description: 'The assignee ID of the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  assigneeId?: string;

  @ApiProperty({
    description: 'The due date of the task',
    example: '2024-01-01T10:00:00Z',
    required: false,
  })
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsDate()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({
    description: 'The start date of the task',
    example: '2024-01-01T09:00:00Z',
    required: false,
  })
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsDate()
  @IsOptional()
  startDate?: Date;
}
