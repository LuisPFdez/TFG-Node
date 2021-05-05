/**
 * @file Contiene middlewares y funciones necesarias para el
 * funcionamiento de la aplicacion
 * @author Luis Puente Fernández
 */
import { NextFunction, Request, Response } from "express";
import ErrorRoute from "../errors/ErrorRoute";
import CodigoError from "../errors/CodigoError";
import RenderInterface from "../interfaces/RenderInterface";
import config from "../config/Config.json";

/**
 * El error handler recogerá todos los errores lanzados desde las rutas. Permitiendo mostrar un mensaje en
 * funcion del codigo de error que se lanze
 * @param err CodigoError, aunque en caso de ser un error no contemplado se le asigna un error 500
 * @param _req Request
 * @param res Response
 * @param _next NextFunction
 * @returns void
 * Los middleware para el manejo de errores han de tener obligatoriamente 4 argumentos. El siguente comentario desactiva el warning de esLint
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorHandler(err: CodigoError, _req: Request, res: Response, _next: NextFunction): void {
    //En caso de que algun error no sea controlado y al lanzarlo no tenga el atributo codigo, como si lo tienen los descendientes de CodigoError,
    //establecerá el error en 500, en caso contrario el error sera el que se lance con el codigo
    const codigo: number = err.codigo == undefined ? 500 : err.codigo;

    //La interfaz RenderInterface, declara datos como opcional, si se intentase establecer sus valores directamente mostraria un error y eslint no recomienda utilizar el operador de asercion nula, 
    //al declarar un objeto externo y asiganla a la propiedad, pasa la referencia, vinculando los valores del objeto a la propiedad.
    const datosO = {
        titulo: "Error",
        mensaje: err.name + ": " + err.message
    };

    const datos: RenderInterface = {
        archivo: config.Rutas.error,
        titulo: "Error",
        datos: datosO
    };

    /**
     * En funcion del codigo cambiara los titulos
     */
    switch (codigo) {
        case 401:
            datos.titulo = "Error 401";
            datosO.titulo = "No tienes los permisos necesarios";
            break;
        case 404:
            datos.titulo = "Error 404";
            datosO.titulo = "Pagina no encontrada";
            break;
        case 500:
            datos.titulo = "Error 500";
            datosO.titulo = "Error interno del servidor";
            break;

    }
    
    return res.render(config.Rutas.layout, datos);
}


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

export { errorHandler, bodyDefinido, manejadorErrores, manejadorErroresNext };