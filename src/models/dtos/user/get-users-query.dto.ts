import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsBoolean, IsUUID } from 'class-validator';
import { Role } from 'src/models/enums';
import { PaginationQueryDto } from '../common/pagination.dto';
import { Transform, TransformFnParams } from 'class-transformer';

export class GetUsersQueryDto extends PaginationQueryDto {
  @ApiProperty({
    description: 'Filter by user role',
    enum: Role,
    required: false,
  })
  @IsEnum(Role)
  @IsOptional()
  readonly role?: Role;

  @ApiProperty({
    description: 'Filter by active status',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  readonly isActive?: boolean;

  @ApiProperty({
    description: 'Filter by created by user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  readonly createdBy?: string;

  @ApiProperty({
    description: 'Search in name, last name, full name and email',
    example: 'john doe',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }: TransformFnParams): string | undefined =>
    typeof value === 'string' ? value.trim() : undefined,
  )
  readonly search?: string;

  @ApiProperty({
    description: 'Sort by field',
    example: 'fullName',
    enum: [
      'id',
      'name',
      'lastName',
      'fullName',
      'email',
      'role',
      'isActive',
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
    example: 'ASC',
    enum: ['ASC', 'DESC'],
    required: false,
    default: 'DESC',
  })
  @IsOptional()
  readonly sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
