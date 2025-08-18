import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  name: string;
  fullName: string;
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

  validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      name: payload.name,
      fullName: payload.fullName,
    };
  }
}
