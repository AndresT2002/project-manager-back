import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetProjectStatusCountsDto {
  @ApiProperty({
    description: 'The number of open projects',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly open: number;

  @ApiProperty({
    description: 'The number of finished projects',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly finished: number;

  @ApiProperty({
    description: 'The number of cancelled projects',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly cancelled: number;
}
