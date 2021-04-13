import { NextFunction, Request, Response } from "express";
import ErrorRoute from "../errors/ErrorRoute";

/**
 * Middleware para comprobar si el body este definido, evitando tener que comprobarlo en la ruta
 * en caso de no estar definido lanza un error 500, en caso contrario pasará al siguiente middleware
 * @param req Request
 * @param res Response
 * @param next NextFuntion
 * @returns void
 */
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
 * Similar a manejadorErrores, pero permite pasar por parametro la funcion next
 * @param func una funcion que tendra por parametros req (de tipo Request), res (de tipo Response) y next (de tipo NextFunction)  y devolverá void
 * @returns una funcion ( devuelve void) que capturará todos los errores de la funcion y los pasará al middleware
 */
function manejadorErroresNext(func: (req: Request, res: Response, next: NextFunction) => void): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(func(req, res, next)).catch(next);
    };
}

export { bodyDefinido, manejadorErrores, manejadorErroresNext };