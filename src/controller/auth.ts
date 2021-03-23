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
        return res.redirect("/inicio");
    } else {
        return next();
    }

}

function autenticado(req: Request, res: Response, next: NextFunction): void {
    if (req.session.usuario) {
        return next();
    } else {
        return res.redirect(401, "/login");
    }
}

function bodyDefinido(req: Request, res: Response, next: NextFunction): void {
    if (req.body == undefined) {
        return next(new ErrorRoute("Error interno en el servidor", 500));
    } else {
        return next();
    }
}

// permisos(req: Request, res: Response, next: NextFunction): void {
//     if (req.session.usuario?.tipo == Tipos.ADMIN) {
//         next();
//     } else {
//         res.redirect("/inicio");
//     }
// }
export {
    noAutenticado, autenticado, bodyDefinido
};

