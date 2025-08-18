import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { LoginResponseDto } from 'src/models/dtos/auth';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  /*
    Este método es para validar el usuario y contraseña.
    Se utiliza en el guard de local-auth.guard.ts para validar el usuario y contraseña.
    Si el usuario y contraseña son válidos, se permite el acceso a la ruta.
  */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /*
    Este método es para generar el token de acceso y el token de actualización.
    Se utiliza en el controlador de autenticación para generar el token de acceso y el token de actualización.
    Si el usuario y contraseña son válidos, se permite el acceso a la ruta y por ende se crea el token de acceso y el token de actualización.
  
    */
  async login(user: any): Promise<LoginResponseDto> {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      name: user.name,
      fullName: user.fullName,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: jwtConstants.expiresIn,
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id, type: 'refresh' },
      {
        secret: jwtConstants.refreshSecret,
        expiresIn: jwtConstants.refreshExpiresIn,
      },
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: this.getExpirationTimeInSeconds(jwtConstants.expiresIn),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  /*
    Este método es para actualizar el token de acceso.
    Se utiliza en el controlador de autenticación para actualizar el token de acceso.
    Si el token de actualización es válido, se permite el acceso a la ruta y por ende se crea el token de acceso.
    (esto se usaría en el frontend para actualizar el token de acceso cuando este expira)
  */
  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: jwtConstants.refreshSecret,
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Token inválido');
      }

      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      const newPayload = {
        email: user.email,
        sub: user.id,
        role: user.role,
        name: user.name,
        fullName: user.fullName,
      };

      const accessToken = this.jwtService.sign(newPayload, {
        secret: jwtConstants.secret,
        expiresIn: jwtConstants.expiresIn,
      });

      return { access_token: accessToken };
    } catch (error) {
      throw new UnauthorizedException('Token de actualización inválido');
    }
  }

  async logout(): Promise<{ message: string; success: boolean }> {
    return {
      message:
        'Sesión cerrada exitosamente. Elimina el token del almacenamiento local.',
      success: true,
    };
  }

  private getExpirationTimeInSeconds(expiresIn: string): number {
    const timeUnit = expiresIn.slice(-1);
    const timeValue = parseInt(expiresIn.slice(0, -1));

    switch (timeUnit) {
      case 's':
        return timeValue;
      case 'm':
        return timeValue * 60;
      case 'h':
        return timeValue * 60 * 60;
      case 'd':
        return timeValue * 24 * 60 * 60;
      default:
        return 3600; // 1 hora por defecto
    }
  }
}
