import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";


export const GetUser = createParamDecorator(

    (data : string, ctx : ExecutionContext) => {


        const req = ctx.switchToHttp().getRequest();
        const user = req.user;
        


        if (!user)
            throw new InternalServerErrorException('No se encontró el usuario (req)')

        // Esto de abajo hace que si no se envian ningun parametro en el decorador
        // Regrese todos los campos del req.user, en este caso sería lo mismo que
        // lo que viene en el entity del User, pero si se envia algun parametro,
        // va a buscar regresar unica y especificamente la propiedad que se está buscando
        // dentro de la entidad
        // Un ejemplo sería que si no se envia ningun parametro, va a regresar todas las
        //propiedades

        return (!data) 
        ? user 
        : user[data];
    }
);
