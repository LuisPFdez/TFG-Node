import { Request, Response, Router } from "express";
import RenderInterface from "../interfaces/RenderInterface";
import config from "../config/Config.json";
import { bodyDefinido, noAutenticado } from "../controller/auth";
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
        archivo: config.Rutas.login,
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


rutas.post("/login", bodyDefinido, (req: Request, res: Response): void => {
    // res.render(config.Rutas.login);
    if (req.body.login != undefined) {
        return res.render(config.Rutas.inicio);
    } else if (req.body.volver != undefined) {
        return res.redirect("/");
    } else {
        return res.redirect("back");
    }
});

export default rutas;