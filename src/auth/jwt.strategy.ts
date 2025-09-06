import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { jwtConstants } from './constants';
import { AuthenticatedUser } from './get-user.decorator';
import { Role } from 'src/models/enums';
import { User } from 'src/models/user.entity';

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
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    // Consultar BD para obtener datos actuales del usuario
    const currentUser = await this.userRepository.findOne({
      where: { id: payload.sub },
      select: ['id', 'email', 'role', 'name', 'fullName'],
    });

    if (!currentUser) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return {
      id: currentUser.id,
      email: currentUser.email,
      role: currentUser.role,
      name: currentUser.name,
      fullName: currentUser.fullName,
    };
  }
}
