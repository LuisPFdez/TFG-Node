import { NextFunction, Request, Response } from "express";
import ErrorRoute from "../errors/ErrorRoute";
import { Tipos, Usuario } from "../model/Usuario";

//Map de acciones que permite asignar una accion a varios usuarios, la llave seria la accion (a veces pude ser la ruta)
//El valor. es un array que contiene los numeros ascociados a los usuarios, todo usuario que este en el array, tendra los permisos
const acciones: Map<string, Array<number>> = new Map(
    [
        //["/admin/usuarios", [Tipos.ADMIN, Tipos.SEMI_ADMIN, Tipos.SUPER_USUARIO]],
        ["/admin/usuarios", [Tipos.ADMIN]]
    ]
);

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
    //Variable booleana que indica si el usuario se ha reautenticado o no
    let reautenticado: boolean;
    
    //Comprueba si la propiedad reautenticacion de la sesion esta inicializada y si contine la url
    if (req.session.reautenticacion != undefined && req.originalUrl in req.session.reautenticacion) {
        //Almacena en reautenticado el valor asociada a la url, en reautenticacion
        reautenticado = req.session.reautenticacion[req.originalUrl];
    } else {
        reautenticado = false;
    }

    if (reautenticado) {
        return next();
    } else {
        //Almacena la url en la sesion y redirige a reautenticar
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
        //Elimina la ruta de la sesion
        delete req.session.reautenticacion[req.originalUrl];
    }

    //Si siguiente lo almacena en repuesta sino almacena "/app/inicio"
    const respuesta = req.siguiente ? req.siguiente : "/app/inicio";

    return res.redirect(respuesta);
}

/**
 * Funcion que comprueba permisos de un usario en funcion de la ruta.
 * En funcion de los permisos que tenga permitira pasar al siguente middleware, o, lanzará un error
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
function permisos(req: Request, res: Response, next: NextFunction): void {
    //Obtine el numero asociado al usuario a traves de la sesion
    const usuario = Tipos[req.session.usuario!.tipo];

    //Se usa la url como llave y comprueba si el usuario esta en ella
    //Si no hay ninguna llave asociada a la url o el usuario no esta en el array, pasara al else
    if (acciones.get(req.originalUrl)?.includes(usuario)) {
        //Pasa al siguente middleware
        return next();
    } else {
        //Lanza un error
        return next(new ErrorRoute("No tienes los permisos necesarios", 401));
    }
}

/**
 * Funcion similar a permisos, sin embargo, el permiso lo obtiene por parametro.
 * @param usuario usuario del que se van a comprobar los permisos
 * @param ruta permiso que se tiene que comprobar
 * @returns boolean, si el usuario tiene permiso o no
 */
function permisosParam(usuario: Usuario, ruta: string): boolean {
    const tipoUsuario = Tipos[usuario.tipo];

    if (acciones.get(ruta)?.includes(tipoUsuario)) {
        return true;
    } else {
        return false;
    }

}

//Se exportan las funciones
export { noAutenticado, autenticado, reautenticar, reautenticarFin, permisos, permisosParam };

