import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsDateString,
  IsBoolean,
  IsDate,
} from 'class-validator';
import { PaginationMetaDto } from '../common/pagination.dto';
import { Expose, Transform, TransformFnParams } from 'class-transformer';

export class GetProjectResponseDto {
  @ApiProperty({
    description: 'The ID of the project',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  readonly id: string;

  @ApiProperty({
    description: 'The name of the project',
    example: 'Project 1',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    description: 'The description of the project',
    example: 'Project 1 description',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams): string =>
    typeof value === 'string' ? value.trim() : '',
  )
  readonly description: string;

  @ApiProperty({
    description: 'The start date of the project',
    example: '2024-01-01T10:00:00Z',
  })
  @Expose()
  @IsDate()
  @IsNotEmpty()
  readonly startDate: Date;

  @ApiProperty({
    description: 'The end date of the project',
    example: '2024-01-01T10:00:00Z',
  })
  @Expose()
  @IsDate()
  @IsNotEmpty()
  readonly endDate: Date;

  @ApiProperty({
    description: 'The owner ID of the project',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  readonly ownerId: string;

  @ApiProperty({
    description: 'The ID of the user who created this project',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  readonly createdBy: string;

  @ApiProperty({
    description: 'The is active of the project',
    example: true,
  })
  @Expose()
  @IsBoolean()
  @IsNotEmpty()
  readonly isActive: boolean;

  @ApiProperty({
    description: 'When the project was created',
    example: '2024-01-15T10:30:00.000Z',
  })
  @Expose()
  @IsDateString()
  @IsNotEmpty()
  readonly createdAt: string;

  @ApiProperty({
    description: 'When the project was last updated',
    example: '2024-01-15T10:30:00.000Z',
  })
  @Expose()
  @IsDateString()
  @IsNotEmpty()
  readonly updatedAt: string;
}

// Usar el DTO genérico de paginación
export class GetProjectsResponseDto {
  @ApiProperty({
    description: 'Array of projects for the current page',
    type: [GetProjectResponseDto],
  })
  readonly data: GetProjectResponseDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetaDto,
  })
  readonly meta: PaginationMetaDto;
}
