import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Role } from 'src/models/enums';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams): string =>
    typeof value === 'string' ? value.trim() : '',
  )
  readonly name: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams): string =>
    typeof value === 'string' ? value.trim() : '',
  )
  readonly lastName: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams): string =>
    typeof value === 'string' ? value.toLowerCase().trim() : '',
  )
  readonly email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({
    description: 'The role of the user',
    example: Role.ADMIN,
  })
  @IsEnum(Role)
  @IsNotEmpty()
  readonly role: Role;

  @ApiProperty({
    description: 'The created by of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly createdBy: string;
}
