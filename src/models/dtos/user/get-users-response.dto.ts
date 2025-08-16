import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { Role } from 'src/models/enums';
import { PaginationMetaDto } from '../common/pagination.dto';
import { Expose } from 'class-transformer';

export class GetUserResponseDto {
  @ApiProperty({
    description: 'The ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  readonly id: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly fullName: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: 'The role of the user',
    example: Role.MEMBER,
    enum: Role,
  })
  @Expose()
  @IsEnum(Role)
  @IsNotEmpty()
  readonly role: Role;

  @ApiProperty({
    description: 'The ID of the user who created this user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  readonly createdBy: string;

  @ApiProperty({
    description: 'The is active of the user',
    example: true,
  })
  @Expose()
  @IsBoolean()
  @IsNotEmpty()
  readonly isActive: boolean;

  @ApiProperty({
    description: 'When the user was created',
    example: '2024-01-15T10:30:00.000Z',
  })
  @Expose()
  @IsDateString()
  @IsNotEmpty()
  readonly createdAt: string;

  @ApiProperty({
    description: 'When the user was last updated',
    example: '2024-01-15T10:30:00.000Z',
  })
  @Expose()
  @IsDateString()
  @IsNotEmpty()
  readonly updatedAt: string;
}

// Usar el DTO genérico de paginación
export class GetUsersResponseDto {
  @ApiProperty({
    description: 'Array of users for the current page',
    type: [GetUserResponseDto],
  })
  readonly data: GetUserResponseDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetaDto,
  })
  readonly meta: PaginationMetaDto;
}
