import { ApiProperty } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project-request.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateProjectResponseDto extends CreateProjectDto {
  @ApiProperty({
    description: 'The ID of the project',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  readonly id: string;
}
