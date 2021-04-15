import { NextFunction, Request, Response, Router } from "express";
import { autenticado, reautenticar, reautenticarFin } from "../controller/auth";
import { bodyDefinido, manejadorErrores, manejadorErroresNext } from "../controller/lib";
import config from "../config/Config.json";
import RenderInterface from "../interfaces/RenderInterface";
import UsuarioInterface from "../interfaces/UsuarioInterface";
import validacionFormuarios from "../core/libreriaValidacion";
import { stNull } from "../controller/types";
import UsuarioDB from "../model/UsuarioDB";
import { Usuario } from "../model/Usuario";

const rutas = Router();

rutas.get("/usuarios", manejadorErrores(async (req: Request, res: Response): Promise<void> => {
    const datos: RenderInterface = {
        titulo: "Listado de Usuarios",
        archivo: config.Rutas.usuarios,
        datos: {
            usuarios: await UsuarioDB.listarUsuarios()
        }
    };
    return res.render(config.Rutas.layout, datos);
}));


export default rutas;