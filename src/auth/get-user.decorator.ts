import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/*
    Este decorador es para obtener el usuario autenticado.
    Se utiliza en el controlador de autenticación para obtener el usuario autenticado.
    Si el usuario no está autenticado, se lanza un error 401.
    Si el usuario está autenticado, se permite el acceso a la ruta.
*/

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): unknown => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
