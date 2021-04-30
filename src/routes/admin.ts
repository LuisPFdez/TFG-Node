import { Request, Response, Router } from "express";
import { autenticado, permisos } from "../controller/auth";
import { errorHandler, manejadorErrores } from "../controller/lib";
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

// rutas.get("/usuarios/:usuario", autenticado, manejadorErrores(async (req: Request, res: Response): Promise<void> => {
//     //Foo
// }));

rutas.use(errorHandler);

export default rutas;