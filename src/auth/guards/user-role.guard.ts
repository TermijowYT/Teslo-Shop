import { Reflector } from '@nestjs/core';
import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/role-protected.decorator';


@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor (
    private readonly reflector: Reflector
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {


    // Esto lo que hace es que trae la metadata que está en el auth controller, del get
    // private2, para poder traer esa información acá, para hacer eso posible hay que traerlo
    // con el reflector asi como en el ejemplo
    const validRoles: string[] = this.reflector.get( META_ROLES, context.getHandler());
    
    if (!validRoles) return true;
    if (validRoles.length === 0) return true;


    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user)
      throw new BadRequestException('No se encontró el usuario')

    console.log({userRoles: user.roles})

    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true; 
      }
    }

    throw new ForbiddenException(
      `El usuario ${user.fullName} necesita un rol valido: [${ validRoles }]`
    )
  }


}
