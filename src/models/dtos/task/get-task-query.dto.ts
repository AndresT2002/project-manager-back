import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetTaskQueryDto {
  @IsNotEmpty()
  @IsUUID()
  readonly id: string;
}
