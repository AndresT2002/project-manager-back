import { ApiProperty } from '@nestjs/swagger';
import { UpdateProjectDto } from './update-project-request.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateProjectResponseDto extends UpdateProjectDto {
  @ApiProperty({
    description: 'The ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly id: string;

  @ApiProperty({
    description: 'The created by of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly createdBy: string;
}
