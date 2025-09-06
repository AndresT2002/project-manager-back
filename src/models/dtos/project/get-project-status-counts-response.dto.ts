import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetProjectStatusCountsResponseDto {
  @ApiProperty({
    description: 'The number of open projects',
    example: 10,
  })
  open: number;

  @ApiProperty({
    description: 'The number of finished projects',
    example: 10,
  })
  finished: number;

  @ApiProperty({
    description: 'The number of cancelled projects',
    example: 10,
  })
  cancelled: number;
}
