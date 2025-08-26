import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
  @ApiProperty({
    description: 'Mensaje de confirmación de logout',
    example: 'Sesión cerrada exitosamente',
  })
  message: string;

  @ApiProperty({
    description: 'Indica si el logout fue exitoso',
    example: true,
  })
  success: boolean;
}
