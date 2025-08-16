import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user-request.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateUserResponseDto extends OmitType(CreateUserDto, [
  'password',
]) {
  @ApiProperty({
    description: 'The ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  readonly id: string;
}
