import { NextFunction, Request, Response, Router } from "express";

import RenderInterface from "../interfaces/RenderInterface";
import CodigoError from "../errors/CodigoError";
import config from "../config/Config.json";
import { autenticado, noAutenticado } from "../controller/auth";
import { bodyDefinido, manejadorErrores } from "../controller/lib";
import UsuarioDB from "../model/UsuarioDB";
import ErrorRoute from "../errors/ErrorRoute";
import validacionFormuarios from "../core/libreriaValidacion";
import { stNull } from "../controller/types";
import { Usuario } from "../model/Usuario";

const rutas = Router();


//Peticiones get
rutas.get("/", (req: Request, res: Response): void => {
    const datos: RenderInterface = {
        titulo: "Inicio de aplicacion",
        archivo: config.Rutas.index,
    };
    return res.render("layout", datos);
});

rutas.get("/login", noAutenticado, (req: Request, res: Response): void => {
    const datos: RenderInterface = {
        titulo: "Iniciar Sesión",
        archivo: config.Rutas.login
    };
    return res.render(config.Rutas.layout, datos);
});

rutas.get("/registro", (_req: Request, res: Response): void => {
    const datos: RenderInterface = {
        archivo: config.Rutas.registro,
        titulo: "Registrar Usuario"
    };
    return res.render(config.Rutas.layout, datos);
});

rutas.get("/reautenticar", autenticado, (req: Request, res: Response): void => {

    if (req.session.urlReautenticar) {
        const datos: RenderInterface = {
            archivo: config.Rutas.reautenticar,
            titulo: "Reatenticar",
            datos: {
                usuario: req.session.usuario
            }
        };
        res.render(config.Rutas.layout, datos);
    } else {
        res.redirect("/app/inicio");
    }
});



//Peticiones post
rutas.post("/", bodyDefinido, (req: Request, res: Response): void => {
    if (req.body.login != undefined) {
        return res.redirect("/login");
    } else if (req.body.registro != undefined) {
        return res.redirect("/registro");
    } else {
        return res.redirect('back');
    }
});

rutas.post("/login", bodyDefinido, manejadorErrores(async (req: Request, res: Response): Promise<void> => {
    if (req.body.volver != undefined) {
        return res.redirect("/");
    }
    const datosO: { usuario: stNull, error: stNull } = {
        usuario: null,
        error: null
    };
    const datos: RenderInterface = {
        titulo: "Iniciar Sesión",
        archivo: config.Rutas.login,
        datos: datosO
    };

    if (!req.body.usuario) {
        datosO.error = "Introduce un usuario";
        return res.render(config.Rutas.layout, datos);
    }

    const usuario = await UsuarioDB.validadUsuario(req.body.usuario, req.body.password);
    if (usuario != null) {
        req.session.usuario = usuario;
        return res.redirect("app/inicio");
    } else {
        datosO.error = "El usuario y la contraseña no coinciden";
        datosO.usuario = req.body.usuario;
        return res.render(config.Rutas.layout, datos);
    }
}));

rutas.post("/registro", bodyDefinido, manejadorErrores(async (req: Request, res: Response): Promise<void> => {
    if (req.body.cancelar != undefined) {
        return res.redirect("/");
    }
    console.log("Continua ");
    const datosO: { usuario: stNull, descripcion: stNull, error: Record<string, stNull> } = {
        usuario: null,
        descripcion: null,
        error: {
            usuario: null,
            descripcion: null,
            password: null,
            passwordC: null
        }
    };

    const datos: RenderInterface = {
        archivo: config.Rutas.registro,
        titulo: "Registrar Usuario",
        datos: datosO
    };

    let entradaOk = true;

    datosO.usuario = req.body.usuario;
    datosO.descripcion = req.body.descripcion;

    datosO.error.usuario = validacionFormuarios.comprobarAlfabetico(req.body.usuario, 20, 3);
    datosO.error.descripcion = validacionFormuarios.comprobarAlfaNumerico(req.body.descripcion, 25, 5);
    datosO.error.password = validacionFormuarios.validarPassword(req.body.password, 20, 4, 2);
    datosO.error.passwordC = req.body.password == req.body.passwordC ? null : "Las contraseñas no coinciden";


    for (const errorF in datosO.error) {
        if (datosO.error[errorF] != null) {
            entradaOk = false;
        }
    }

    if (entradaOk) {
        const usuario = await UsuarioDB.crearUsuario(req.body.usuario, req.body.password, req.body.descripcion);
        if (usuario == null) {
            datosO.error.usuario = "El codigo de usuario ya existe";
            return res.render(config.Rutas.layout, datos);
        }
        req.session.usuario = usuario;
        return res.redirect("/app/inicio");
    } else {
        return res.render(config.Rutas.layout, datos);
    }
}));

rutas.post("/reautenticar", autenticado, bodyDefinido, (req: Request, res: Response): void => {
    if (req.body.cancelar) {
        res.redirect(req.originalUrl);
    }

    const usuario = req.session.usuario;

    const passwordE = Usuario.encriptarPassword(usuario!.codUsuario, req.body.password);
    if (usuario?.password == passwordE) {
        req.session.reautenticado = true;
        const redirecion = req.session.urlReautenticar ? req.session.urlReautenticar : "/app/inicio";
        return res.redirect(redirecion);
    } else {
        const datos: RenderInterface = {
            archivo: config.Rutas.reautenticar,
            titulo: "Reatenticar",
            datos: {
                usuario: req.session.usuario?.descripcion,
                ePassword: "Contraseña erronea"
            }
        };
        res.render(config.Rutas.layout, datos);
    }
});

//Middlewares

//Este middleware necesitar ir despues de todas las rutas para que en caso de que ninguna coincida mande un error 404
rutas.use((): void => {
    throw new ErrorRoute("No se ha encontrado la pagina", 404);
});

//Los middleware para el manejo de errores han de tener obligatoriamente 4 argumentos. El siguente comentario desactiva el warning de esLint
// eslint-disable-next-line @typescript-eslint/no-unused-vars
rutas.use(function (err: CodigoError, _req: Request, res: Response, _next: NextFunction): void {
    //En caso de que algun error no sea controlado y al lanzarlo no tenga el atributo codigo, como si lo tienen los descendientes de CodigoError,
    //establecerá el error en 500, en caso contrario el error sera el que se lance con el codigo
    const codigo: number = err.codigo == undefined ? 500 : err.codigo;

    console.log("Entra en el error: ", err, "Codigo error", err.codigo);
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

    switch (codigo) {
        case 400:
            datos.titulo = "Error 400";
            datosO.titulo = "Error 400";
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
});



export default rutas;