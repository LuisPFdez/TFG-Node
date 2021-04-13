import { NextFunction, Request, Response, Router } from "express";
import { autenticado, reautenticar, reautenticarFin } from "../controller/auth";
import { bodyDefinido, manejadorErroresNext } from "../controller/lib";
import config from "../config/Config.json";
import RenderInterface from "../interfaces/RenderInterface";
import UsuarioInterface from "../interfaces/UsuarioInterface";
import validacionFormuarios from "../core/libreriaValidacion";
import { stNull } from "../controller/types";
import UsuarioDB from "../model/UsuarioDB";
const rutas = Router();


rutas.get("/inicio", autenticado, (req: Request, res: Response): void => {

    const datos: RenderInterface = {
        archivo: config.Rutas.inicio,
        titulo: "Inicio",
        datos: {
            usuario: req.session.usuario
        }

    };

    return res.render(config.Rutas.layout, datos);
});

rutas.get("/editar", reautenticar, (req: Request, res: Response): void => {
    const datos: RenderInterface = {
        archivo: config.Rutas.editar,
        titulo: "Editar",
        datos: {
            usuario: req.session.usuario
        }

    };

    return res.render(config.Rutas.layout, datos);
});
rutas.get("/modificar_password", reautenticar, (req: Request, res: Response): void => {
    const datos: RenderInterface = {
        archivo: config.Rutas.modificar,
        titulo: "Cambiar Contraseña",
        datos: {
            usuario: req.session.usuario
        }
    };

    return res.render(config.Rutas.layout, datos);
});
rutas.get("/borrar", autenticado, (req: Request, res: Response): void => {
    const datos: RenderInterface = {
        archivo: config.Rutas.editar,
        titulo: "Editar",
        datos: {
            usuario: req.session.usuario
        }

    };

    return res.render(config.Rutas.layout, datos);
});


rutas.post("/inicio", autenticado, bodyDefinido, (req: Request, res: Response): void => {
    if (req.body.editar != undefined) {
        return res.redirect("/app/editar");
    } else if (req.body.modificar != undefined) {
        return res.redirect("/app/modificar_password");
    } else if (req.body.borrar != undefined) {
        return res.redirect("/app/borrar");
    } else if (req.body.cerrar != undefined) {
        req.session.destroy((): void => {
            return res.redirect("/");
        });
    } else {
        return res.redirect("back");
    }
});

rutas.post("/editar", reautenticar, bodyDefinido, manejadorErroresNext(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    req.siguiente = "/app/inicio";

    if (req.body.cancelar != undefined) {
        return next();
    }

    const usuario = req.session.usuario!;
    usuario.descripcion = req.body.descripcion;

    const datosO: { eDescripcion: stNull, usuario: UsuarioInterface } = {
        eDescripcion: null,
        usuario: usuario
    };

    datosO.eDescripcion = validacionFormuarios.comprobarAlfaNumerico(usuario.descripcion, 25, 5);

    if (datosO.eDescripcion == null) {

        if (! await UsuarioDB.modificarUSuario(usuario.codUsuario, usuario.descripcion)) {
            throw new Error("Error al modificar la descripcion, el codigo de usuario no existe");
        }

        req.session.usuario = usuario;
        return next();
    } else {
        const datos: RenderInterface = {
            archivo: config.Rutas.editar,
            titulo: "Editar",
            datos: datosO
        };

        return res.render(config.Rutas.layout, datos);
    }
}), reautenticarFin);

rutas.post("/modificar_password", manejadorErroresNext(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    req.siguiente = "/app/inicio";

    if (req.body.cancelar != undefined) {
        return next();
    }

    const datosO: { password: stNull, passwordC: stNull } = {
        password: null,
        passwordC: null
    };

    datosO.password = validacionFormuarios.validarPassword(req.body.password, 20, 4, 2);
    datosO.passwordC = req.body.password == req.body.passwordC ? null : "Las contraseñas no coinciden";

    if (datosO.password == null && datosO.passwordC == null) {
        if (! await UsuarioDB.modificarPassword(req.session.usuario!.codUsuario, req.body.password)) {
            throw new Error("Error al modificar al contraseña, el codigo de usuario no existe");
        }

        return next();
    } else {
        const datos: RenderInterface = {
            archivo: config.Rutas.modificar,
            titulo: "Cambiar Contraseña",
            datos: datosO
        };

        res.render(config.Rutas.layout, datos);
    }

}), reautenticarFin);

rutas.post("/borrar", autenticado, (req: Request, res: Response): void => {
    const datos: RenderInterface = {
        archivo: config.Rutas.editar,
        titulo: "Editar",
        datos: {
            usuario: req.session.usuario
        }

    };

    return res.render(config.Rutas.layout, datos);
});


export default rutas;