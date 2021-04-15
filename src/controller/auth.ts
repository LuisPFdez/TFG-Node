import { NextFunction, Request, Response } from "express";
import { Tipos } from "../model/Usuario";

const acciones: Map<string, Array<string>> = new Map();
// acciones.set();

/**
 * Funcion que comprueba si el usuario esta autenticado o no, en caso de estar autenticado
 * redirige a /app/inicio, en caso contrario pasará al siguiente middleware. Permite saltarse ciertas acciones que solo los usuarios no autenticados
 * deberian de hacer, como iniciar sesión
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
function noAutenticado(req: Request, res: Response, next: NextFunction): void {
    if (req.session.usuario) {
        return res.redirect("/app/inicio");
    } else {
        return next();
    }

}
/**
 * Funcion que comprueba si el usuario esta autenticado o no, en caso de no estar autenticado 
 * redirigira al usuario al login, en caso contrario, pasará al siguiente middleware
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
function autenticado(req: Request, res: Response, next: NextFunction): void {
    if (req.session.usuario) {
        return next();
    } else {
        return res.redirect("/login");
    }
}
/**
 * Funcion para comprobar si se ha reautenticado para a la ruta a la que intenta acceder,
 * en caso de no estar estar reautenticado, redirigira al usuario para que reintroduzca la contraseña, 
 * si esta reautenticado le permitira pasar a la siguiente funcion de la ruta.
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
function reautenticar(req: Request, res: Response, next: NextFunction): void {
    let reautenticado: boolean;

    if (req.session.reautenticacion != undefined && req.originalUrl in req.session.reautenticacion) {
        reautenticado = req.session.reautenticacion[req.originalUrl];
    } else {
        reautenticado = false;
    }

    if (reautenticado) {
        return next();
    } else {
        req.session.urlReautenticar = req.originalUrl;
        return res.redirect("/reautenticar");
    }
}
/**
 * Al finalizar la accion, para la que se necesitaba la reautenticación, reautenticarFin borrara la propiedad 
 * asociada a la url
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
function reautenticarFin(req: Request, res: Response): void {

    if (req.session.reautenticacion != undefined) {
        delete req.session.reautenticacion[req.originalUrl];
    }

    const respuesta = req.siguiente ? req.siguiente : "/app/inicio";

    res.redirect(respuesta);
}

function permisos(req: Request, res: Response, next: NextFunction): void {
    if(req.session.usuario?.tipo == Tipos.ADMIN) {
    next();
} else {
    res.redirect("/inicio");
}
}
export { noAutenticado, autenticado, reautenticar, reautenticarFin };

