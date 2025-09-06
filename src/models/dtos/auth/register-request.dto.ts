import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { Expose } from 'class-transformer';
export class RegisterDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John',
  })
  @IsString()
  @Expose()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @IsString()
  @Expose()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @Expose()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  @IsString()
  @Expose()
  @IsNotEmpty()
  readonly password: string;
}
