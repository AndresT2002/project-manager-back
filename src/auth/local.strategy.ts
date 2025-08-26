import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

/*
    Esta estrategia es para validar el usuario y contraseña.
    Se utiliza en el guard de local-auth.guard.ts para validar el usuario y contraseña.
    Si el usuario y contraseña no son válidos, se lanza un error 401.
    Si el usuario y contraseña son válidos, se permite el acceso a la ruta.
*/

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
