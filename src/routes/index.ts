import { Request, Response, Router } from "express";

import RenderInterface from "../interfaces/RenderInterface";
import config from "../config/Config.json";
import { autenticado, noAutenticado } from "../controller/auth";
import { bodyDefinido, errorHandler, manejadorErrores } from "../controller/lib";
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
            titulo: "Reautenticar",
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

    datosO.error.usuario = validacionFormuarios.validarCodUsuario(req.body.usuario, 20, 3);
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

    if (req.body.cancelar != undefined) {
        return res.redirect("/app/inicio");
    }

    const ruta = req.session.urlReautenticar!;
    const usuario = req.session.usuario;

    const passwordE = Usuario.encriptarPassword(usuario!.codUsuario, req.body.password);
    if (usuario?.password == passwordE) {

        req.session.reautenticacion ? req.session.reautenticacion[ruta] = true : req.session.reautenticacion = { [ruta]: true };

        const redirecion = req.session.urlReautenticar ? req.session.urlReautenticar : "/app/inicio";

        return res.redirect(redirecion);
    } else {

        const datos: RenderInterface = {
            archivo: config.Rutas.reautenticar,
            titulo: "Reautenticar",
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
rutas.use((req: Request): void => {
    throw new ErrorRoute("No se ha encontrado la pagina: " + req.originalUrl, 404);
});


rutas.use(errorHandler);



export default rutas;