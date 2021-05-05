/**
 * @file Metodos de ruta para la url de admin
 * @author Luis Puente Fernández
 */
import { Request, Response, Router } from "express";
import { autenticado, permisos } from "../controller/auth";
import { bodyDefinido, errorHandler, manejadorErrores } from "../controller/lib";
import config from "../config/Config.json";
import RenderInterface from "../interfaces/RenderInterface";
import UsuarioDB from "../model/UsuarioDB";

const rutas = Router();

rutas.get("/usuarios", autenticado, permisos, manejadorErrores(async (req: Request, res: Response): Promise<void> => {
    const datos: RenderInterface = {
        titulo: "Listado de Usuarios",
        archivo: config.Rutas.usuarios,
        datos: {
            usuarios: await UsuarioDB.listarUsuarios()
        }
    };
    return res.render(config.Rutas.layout, datos);
}));

rutas.get("/usuarios/:usuario", autenticado, manejadorErrores(async (req: Request, res: Response): Promise<void> => {
    const codigo = req.params.usuario;
    const usuario = await UsuarioDB.buscarUsuario(codigo);
    if (usuario == null) {
        const datos: RenderInterface = {
            titulo: "Usuario inexistente",
            archivo: config.Rutas.usuario,
            datos: {
                existe: false,
                codigo: codigo
            }
        };

        return res.render(config.Rutas.layout, datos);
    }

    const datos: RenderInterface = {
        titulo: "Usuario: " + usuario.descripcion,
        archivo: config.Rutas.usuario,
        datos: {
            existe: true,
            usuario: usuario
        }
    };

    return res.render(config.Rutas.layout, datos);

}));

rutas.post("/usuarios", autenticado, bodyDefinido, (req: Request, res: Response): void => {
    if (req.body.volverU != undefined){
        return res.redirect("/app/inicio");
    } else if (req.body.volverUS != undefined){
        return res.redirect("/admin/usuarios");
    }
});

rutas.use(errorHandler);

export default rutas;