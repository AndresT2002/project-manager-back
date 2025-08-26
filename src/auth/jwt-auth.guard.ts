import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/*
    Este guard es para proteger las rutas que requieren autenticación, con JWT.
    Se utiliza en el controlador de autenticación para verificar si el token es válido.
    Si el token no es válido, se lanza un error 401.
    Si el token es válido, se permite el acceso a la ruta.
    (por esto es que uso el guard de jwt)
*/

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
