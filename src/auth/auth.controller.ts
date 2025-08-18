import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from './get-user.decorator';
import {
  LoginRequestDto,
  LoginResponseDto,
  LogoutResponseDto,
} from 'src/models/dtos/auth';
import { User } from 'src/models/user.entity';

interface RequestWithUser extends Request {
  user: Omit<User, 'password'>;
}

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /*
    Este método es para iniciar sesión.
    Se utiliza en el controlador de autenticación para iniciar sesión.
    Si el usuario y contraseña son válidos ( por eso uso el guard de local), se permite el acceso a la ruta y por ende se crea el token de acceso y el token de actualización.
  */
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
  })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Request() req: RequestWithUser): LoginResponseDto {
    return this.authService.login(req.user);
  }

  /*
    Este método es para cerrar sesión.
    Se utiliza en el controlador de autenticación para cerrar sesión.
    Si el token es válido, se permite el acceso a la ruta y por ende se cierra la sesión.
  */
  @ApiOperation({
    summary: 'Cerrar sesión',
    description:
      'Cierra la sesión del usuario. El token debe ser eliminado del almacenamiento local del cliente.',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout exitoso',
    type: LogoutResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(): LogoutResponseDto {
    return this.authService.logout();
  }

  /*
    Este método es para actualizar el token de acceso.
    Se utiliza en el controlador de autenticación para actualizar el token de acceso.
    Si el token de actualización es válido, se permite el acceso a la ruta y por ende se crea el token de acceso.
  */
  @ApiOperation({ summary: 'Actualizar token de acceso' })
  @ApiResponse({
    status: 200,
    description: 'Token actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Nuevo token de acceso',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido',
  })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body('refresh_token') refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token no proporcionado');
    }

    return this.authService.refreshToken(refreshToken);
  }

  /*
    Este método es para obtener la información del usuario autenticado.
    Se utiliza en el controlador de autenticación para obtener la información del usuario autenticado.
    Si el token es válido, se permite el acceso a la ruta y por ende se obtiene la información del usuario autenticado.
  */
  @ApiOperation({ summary: 'Obtener información del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Información del usuario',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        name: { type: 'string' },
        fullName: { type: 'string' },
        role: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('me')
  @HttpCode(HttpStatus.OK)
  getProfile(@GetUser() user: Omit<User, 'password'>): Omit<User, 'password'> {
    return user;
  }
}
