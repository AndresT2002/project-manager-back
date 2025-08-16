import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Expose, Transform, TransformFnParams } from 'class-transformer';

export class CreateProjectDto {
  @ApiProperty({
    description: 'The name of the project',
    example: 'Project 1',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams): string =>
    typeof value === 'string' ? value.trim() : '',
  )
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
  @Transform(
    ({ value }: TransformFnParams): Date =>
      value instanceof Date ? value : new Date(String(value)),
  )
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
}
