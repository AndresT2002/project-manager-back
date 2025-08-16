import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../common/pagination.dto';
import { Expose, Transform, TransformFnParams } from 'class-transformer';

export class GetProjectsQueryDto extends PaginationQueryDto {
  @ApiProperty({
    description: 'Filter by project owner ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @Expose()
  @IsOptional()
  readonly ownerId?: string;

  @ApiProperty({
    description: 'Filter by project member ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @Expose()
  @IsOptional()
  readonly memberId?: string;

  @ApiProperty({
    description: 'Filter by project task ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  @IsUUID()
  @Expose()
  @IsOptional()
  readonly taskId?: string;

  @ApiProperty({
    description:
      'Search in name, description, start date, end date and owner ID',
    example: 'project 1',
    required: false,
  })
  @Expose()
  @IsOptional()
  @Transform(({ value }: TransformFnParams): string | undefined =>
    typeof value === 'string' ? value.trim() : undefined,
  )
  readonly search?: string;

  @ApiProperty({
    description: 'Sort by field',
    example: 'name',
    enum: ['id', 'name', 'description', 'startDate', 'endDate', 'ownerId'],
    required: false,
    default: 'createdAt',
  })
  @Expose()
  @IsOptional()
  readonly sortBy?: string = 'createdAt';

  @ApiProperty({
    description: 'Sort order',
    example: 'ASC',
    enum: ['ASC', 'DESC'],
    required: false,
    default: 'DESC',
  })
  @Expose()
  @IsOptional()
  readonly sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
