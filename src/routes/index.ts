import { NextFunction, Request, Response, Router } from "express";

import RenderInterface from "../interfaces/RenderInterface";
import CodigoError from "../errors/CodigoError";
import config from "../config/Config.json";
import { bodyDefinido, noAutenticado, manejadorErrores } from "../controller/auth";
import UsuarioDB from "../model/UsuarioDB";
import ErrorRoute from "../errors/ErrorRoute";
const rutas = Router();

//Le añado el atributo codigo a la clase Error

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

// rutas.get("/registro", (req: Request, res: Response) => {
//     //Fooo
// });

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
    const usuario = await UsuarioDB.validadUsuario(req.body.usuario, req.body.password);
    if (usuario != null) {
        req.session.usuario = usuario;
        console.log("Entra en el redirect");
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
        return res.render(config.Rutas.layout, datos);
    }
}));

//Este middleware necesitar ir despues de todas las rutas para que en caso de que ninguna coincida mande un error 404
rutas.use(() => {
    throw new ErrorRoute("No se ha encontrado la pagina", 404);
});

//Los middleware para el manejo de errores han de tener obligatoriamente 4 argumentos. El siguente comentario desactiva el warning de esLint
// eslint-disable-next-line @typescript-eslint/no-unused-vars
rutas.use(function (err: CodigoError, _req: Request, res: Response, _next: NextFunction) {
    const codigo: number = err.codigo;

    console.log("Entra en el error: ", err);
    //La interfaz RenderInterface, declara datos como opcional, si se intentase establecer sus valores directamente mostraria un error, 
    //al declarar una variable externa y asiganla a la propiedad se evita el error
    let titulo = "Error";

    const datos: RenderInterface = {
        archivo: config.Rutas.error,
        titulo: "Error",
        datos: {
            titulo: titulo,
            mensaje: err.name + ": " + err.message
        }
    };

    switch (codigo) {
        case 400:
            datos.titulo = "Error 400";
            titulo = "Error 400";
            break;
        case 404:
            datos.titulo = "Error 404";
            titulo = "Pagina no encontrada";
            break;
        case 500:
            datos.titulo = "Error 500";
            titulo = "Error interno del servidor";
            break;

    }
    res.render(config.Rutas.layout, datos);
});


// rutas.post("/registro", bodyDefinido, async ():Promise<void> => {

// })

export default rutas;