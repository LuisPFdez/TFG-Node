import { Request, Response, Router } from "express";
import RenderInterface from "../interfaces/RenderInterface";
import config from "../config/Config.json";
import { bodyDefinido, noAutenticado } from "../controller/auth";
import UsuarioDB from "../model/UsuarioDB";
// import ErrorRoute from "../errors/ErrorRoute";
const rutas = Router();


rutas.get("/", noAutenticado, (req: Request, res: Response): void => {
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

rutas.post("/", bodyDefinido, (req: Request, res: Response): void => {
    console.log("entra", req.body.login);
    if (req.body.login != undefined) {
        return res.redirect("/login");
    } else if (req.body.registro != undefined) {
        return res.redirect("/registro");
    } else {
        return res.redirect('back');
    }
});


rutas.post("/login", bodyDefinido, async (req: Request, res: Response): Promise<void> => {
    const usuario = await UsuarioDB.validadUsuario(req.body.usuario, req.body.password);
    if (usuario != null) {
        req.session.usuario = usuario;
        return res.redirect("app/inicio");
    } else {
        const datos: RenderInterface = {
            titulo: "Iniciar Sesión",
            archivo: config.Rutas.login,
            datos: {
                usuario: req.body.usuario,
                error: "El usuario y contraseña no coinciden"
            }
        };
        res.render(config.Rutas.layout, datos);
    }
});

rutas.get("/registro", (req: Request, res: Response) => {
    res.send("Registro");
});

export default rutas;