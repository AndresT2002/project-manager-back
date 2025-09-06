import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { AuthenticatedUser } from './get-user.decorator';
import { Role } from 'src/models/enums';

interface JwtPayload extends AuthenticatedUser {
  sub: string;
}

/*
    Esta estrategia es para validar el token JWT.
    Se utiliza en el guard de jwt-auth.guard.ts para validar el token.
    Si el token no es válido, se lanza un error 401.
    Si el token es válido, se permite el acceso a la ruta.
*/

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role as Role,
      name: payload.name,
      fullName: payload.fullName,
    };
  }
}
