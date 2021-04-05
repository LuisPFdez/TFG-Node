import { Request, Response, Router } from "express";
import { autenticado, reautenticar } from "../controller/auth";
import { bodyDefinido, manejadorErrores } from "../controller/lib";
import config from "../config/Config.json";
import RenderInterface from "../interfaces/RenderInterface";
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

rutas.get("/editar", autenticado, (req: Request, res: Response): void => {
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

rutas.post("/editar", autenticado, (req: Request, res: Response): void => {
    const datos: RenderInterface = {
        archivo: config.Rutas.editar,
        titulo: "Editar",
        datos: {
            usuario: req.session.usuario
        }

    };

    return res.render(config.Rutas.layout, datos);
});
rutas.post("/modificar_password", autenticado, manejadorErrores(async (req: Request, res: Response): Promise<void> => {
    if (req.body.cancelar != undefined) {
        return res.redirect("/app/inicio");
    }
    const datosO: { password: stNull, passwordC: stNull } = {
        password: null,
        passwordC: null
    };

    datosO.password = validacionFormuarios.validarPassword(req.body.password, 20, 4, 2);
    datosO.passwordC = req.body.password == req.body.passwordC ? null : "Las contraseñas no coinciden";

    if (datosO.password == null && datosO.passwordC == null) {
        console.log("Entra en primer if");
        if (! await UsuarioDB.modificarPassword(req.session.usuario!.codUsuario, req.body.password)) {
            throw new Error("Error al modificar al contraseña, el codigo de usuario no existe");
        }
        console.log("Pasa el if");
        return res.redirect("/app/inicio");

    } else {
        const datos: RenderInterface = {
            archivo: config.Rutas.modificar,
            titulo: "Cambiar Contraseña",
            datos: datosO
        };

        res.render(config.Rutas.layout, datos);
    }

}));

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