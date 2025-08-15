import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/models/enums';
import { Transform, TransformFnParams } from 'class-transformer';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The name of the user',
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
    description: 'The last name of the user',
    example: 'Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }: TransformFnParams): string | undefined =>
    typeof value === 'string' ? value.trim() : undefined,
  )
  readonly lastName?: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  @Transform(({ value }: TransformFnParams): string | undefined =>
    typeof value === 'string' ? value.toLowerCase().trim() : undefined,
  )
  readonly email?: string;

  @ApiProperty({
    description: 'The role of the user',
    example: Role.ADMIN,
    required: false,
  })
  @IsEnum(Role)
  @IsOptional()
  readonly role?: Role;
}
