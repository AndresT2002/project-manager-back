import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class UpdateProjectDto {
  @ApiProperty({
    description: 'The name of the project',
    example: 'John',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }: TransformFnParams): string | undefined =>
    typeof value === 'string' ? value.trim() : undefined,
  )
  readonly name?: string;

  @ApiProperty({
    description: 'The description of the project',
    example: 'Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }: TransformFnParams): string | undefined =>
    typeof value === 'string' ? value.trim() : undefined,
  )
  readonly description?: string;

  @ApiProperty({
    description: 'The start date of the project',
    example: '2024-01-01T10:00:00Z',
    required: false,
  })
  @IsDate()
  @IsOptional()
  @Transform(({ value }: TransformFnParams): Date | undefined =>
    value
      ? value instanceof Date
        ? value
        : new Date(String(value))
      : undefined,
  )
  readonly startDate?: Date;

  @ApiProperty({
    description: 'The end date of the project',
    example: '2024-01-01T10:00:00Z',
    required: false,
  })
  @IsDate()
  @IsOptional()
  @Transform(({ value }: TransformFnParams): Date | undefined =>
    value
      ? value instanceof Date
        ? value
        : new Date(String(value))
      : undefined,
  )
  readonly endDate?: Date;

  @ApiProperty({
    description: 'The owner ID of the project',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  readonly ownerId?: string;
}
