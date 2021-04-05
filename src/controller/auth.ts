import { NextFunction, Request, Response } from "express";
// import { Tipos } from "../model/Usuario";

// enum Acciones {
//     EDITAR = "EDITAR",
//     BORRAR = "BORRAR",
//     CREAR = "CREAR",
//     VER  = "VER", 
// }

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

function reautenticar(req: Request, res: Response, next: NextFunction): void {
    if (req.session.reautenticado) {
        req.session.reautenticado = false;
        return next();
    } else {
        console.log(req.header('Referer'));
        req.session.urlReautenticar = req.originalUrl;
        return res.redirect("/reautenticar");
    }
}

// permisos(req: Request, res: Response, next: NextFunction): void {
//     if (req.session.usuario?.tipo == Tipos.ADMIN) {
//         next();
//     } else {
//         res.redirect("/inicio");
//     }
// }
export { noAutenticado, autenticado, reautenticar };

