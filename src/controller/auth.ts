import { NextFunction, Request, Response } from "express";
import ErrorRoute from "../errors/ErrorRoute";
// import { Tipos } from "../model/Usuario";

// enum Acciones {
//     EDITAR = "EDITAR",
//     BORRAR = "BORRAR",
//     CREAR = "CREAR",
//     VER  = "VER", 
// }


function noAutenticado(req: Request, res: Response, next: NextFunction): void {
    if (req.session.usuario) {
        return res.redirect("/app/inicio");
    } else {
        return next();
    }

}

function autenticado(req: Request, res: Response, next: NextFunction): void {
    if (req.session.usuario) {
        return next();
    } else {
        return res.redirect("/login");
    }
}

function bodyDefinido(req: Request, res: Response, next: NextFunction): void {
    if (req.body == undefined) {
        return next(new ErrorRoute("Error interno en el servidor", 500));
    } else {
        return next();
    }
}
/**
 * Aunque exista un middleware para el manejo de errores, si una funcion o metodo externo lanza una excepcion, el middleware sera incapaz de capturarla.
 * Esta funcion evita tener que llenar todas las rutas de bloques try catch o de catch para promesas. 
 * @param func una funcion que tendra por parametros req (de tipo Request) y res (de tipo Response) y devolverá void
 * @returns una funcion ( devuelve void) que capturará todos los errores de la funcion y los pasará al middleware
 */
function manejadorErrores(func: (req: Request, res: Response) => void): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(func(req, res)).catch(next);
    };
}
/**
 * Aunque exista un middleware para el manejo de errores, si una funcion o metodo externo lanza una excepcion, el middleware sera incapaz de capturarla.
 * Esta funcion evita tener que llenar todas las rutas de bloques try catch o de catch para promesas. 
 * @param func una funcion que tendra por parametros req (de tipo Request) y res (de tipo Response) y devolverá void
 * @returns una funcion ( devuelve void) que capturará todos los errores de la funcion y los pasará al middleware
 */
function manejadorErroresNext(func: (req: Request, res: Response, next:NextFunction) => void): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(func(req, res, next)).catch(next);
    };
}


// permisos(req: Request, res: Response, next: NextFunction): void {
//     if (req.session.usuario?.tipo == Tipos.ADMIN) {
//         next();
//     } else {
//         res.redirect("/inicio");
//     }
// }
export { noAutenticado, autenticado, bodyDefinido, manejadorErrores, manejadorErroresNext };

