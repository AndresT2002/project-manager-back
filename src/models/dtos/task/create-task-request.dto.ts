import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { TaskStatus } from 'src/models/enums';

export class CreateTaskRequestDto {
  @ApiProperty({
    description: 'The title of the task',
    example: 'Task 1',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The description of the task',
    example: 'Task 1 description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The status of the task',
    example: TaskStatus.TODO,
  })
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: TaskStatus;

  @ApiProperty({
    description: 'The project ID of the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({
    description: 'The assignee ID of the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  assigneeId: string;

  @ApiProperty({
    description: 'The due date of the task',
    example: '2024-01-01T10:00:00Z',
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  dueDate: Date;

  @ApiProperty({
    description: 'The start date of the task',
    example: '2024-01-01T09:00:00Z',
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  startDate: Date;
}
