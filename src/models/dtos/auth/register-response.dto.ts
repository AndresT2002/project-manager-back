import { ApiProperty, OmitType } from '@nestjs/swagger';
import { RegisterDto } from './register-request.dto';
import { IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class RegisterResponseDto extends OmitType(RegisterDto, ['password']) {
  @ApiProperty({
    description: 'The ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  readonly id: string;
}
