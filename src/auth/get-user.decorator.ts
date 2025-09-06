import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from 'src/models/enums';

/**
 * Interfaz que representa la información del usuario autenticado
 * tal como viene del JWT payload procesado por la estrategia
 */
export interface AuthenticatedUser {
  /** ID único del usuario (UUID) */
  id: string;

  /** Correo electrónico del usuario */
  email: string;

  /** Nombre del usuario */
  name: string;

  /** Nombre completo del usuario */
  fullName: string;

  /** Rol del usuario en el sistema */
  role: Role;
}

/*
    Este decorador es para obtener el usuario autenticado.
    Se utiliza en los controladores para obtener información del usuario autenticado.
    Si el usuario no está autenticado, se lanza un error 401.
    Si el usuario está autenticado, se permite el acceso a la ruta.
*/

export const GetUser = createParamDecorator(
  (
    data: keyof AuthenticatedUser | undefined,
    ctx: ExecutionContext,
  ):
    | AuthenticatedUser
    | AuthenticatedUser[keyof AuthenticatedUser]
    | undefined => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser | undefined;

    return data ? user?.[data] : user;
  },
);
