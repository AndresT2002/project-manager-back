import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID, IsDateString } from 'class-validator';
import { TaskStatus } from 'src/models/enums';
import { PaginationQueryDto } from '../common/pagination.dto';
import { Transform } from 'class-transformer';

export class GetTasksQueryDto extends PaginationQueryDto {
  @ApiProperty({
    description: 'Filter by task status',
    enum: TaskStatus,
    required: false,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  readonly status?: TaskStatus;

  @ApiProperty({
    description: 'Filter by project ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  readonly projectId?: string;

  @ApiProperty({
    description: 'Filter by assignee ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  readonly assigneeId?: string;

  @ApiProperty({
    description: 'Filter by created by user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  readonly createdBy?: string;

  @ApiProperty({
    description: 'Filter tasks due after this date',
    example: '2024-01-01T00:00:00Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  readonly dueDateAfter?: string;

  @ApiProperty({
    description: 'Filter tasks due before this date',
    example: '2024-12-31T23:59:59Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  readonly dueDateBefore?: string;

  @ApiProperty({
    description: 'Search in title and description',
    example: 'implement feature',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  readonly search?: string;

  @ApiProperty({
    description: 'Sort by field',
    example: 'dueDate',
    enum: [
      'id',
      'title',
      'status',
      'dueDate',
      'startDate',
      'createdAt',
      'updatedAt',
    ],
    required: false,
    default: 'createdAt',
  })
  @IsOptional()
  readonly sortBy?: string = 'createdAt';

  @ApiProperty({
    description: 'Sort order',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
    required: false,
    default: 'DESC',
  })
  @IsOptional()
  readonly sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
