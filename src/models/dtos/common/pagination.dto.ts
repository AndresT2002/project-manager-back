import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsBoolean, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para la metadata de la paginación, es decir,
 * el numero de paginas, el numero de elementos por pagina,
 * el numero total de elementos, el numero de paginas,
 * si hay una pagina siguiente, si hay una pagina anterior,
 * el numero de elementos en la pagina actual
 * se usa para responder a las peticiones de la paginación
 */
export class PaginationMetaDto {
  @ApiProperty({
    description: 'Current page number',
    example: 1,
    minimum: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  readonly page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  readonly pageSize: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 100,
  })
  @Type(() => Number)
  @IsNumber()
  readonly total: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  @Type(() => Number)
  @IsNumber()
  readonly totalPages: number;

  @ApiProperty({
    description: 'Whether there is a next page',
    example: true,
  })
  @IsBoolean()
  readonly hasNext: boolean;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false,
  })
  @IsBoolean()
  readonly hasPrevious: boolean;

  @ApiProperty({
    description: 'Number of items in current page',
    example: 10,
  })
  @Type(() => Number)
  @IsNumber()
  readonly itemCount: number;
}

/**
 * DTO para la consulta de la paginación, es decir,
 * el numero de pagina y el numero de elementos por pagina,
 * se usa para consultar las peticiones de la paginación
 */
export class PaginationQueryDto {
  @ApiProperty({
    description: 'Page number (starts from 1)',
    example: 1,
    minimum: 1,
    required: false,
    default: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    required: false,
    default: 10,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  readonly pageSize?: number = 10;
}

/**
 * DTO para la respuesta de la paginación, es decir,
 * el array de elementos y la metadata de la paginación,
 * se usa para responder a las peticiones de la paginación
 */
export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Array of items for the current page',
  })
  readonly data: T[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetaDto,
  })
  readonly meta: PaginationMetaDto;
}
