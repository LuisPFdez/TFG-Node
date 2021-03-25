// import UsuarioDB from "./model/UsuarioDB";
import express, { Express, NextFunction, Request, Response } from 'express';
import { Usuario } from "./model/Usuario";
import cookie_parser from "cookie-parser";
import session from "express-session";
import { readFileSync } from "fs";
import https from "https";
import path from "path";
import index from "./routes/index";
import appRuta from "./routes/app";
import config from "./config/Config.json";

declare module 'express-session' {
    interface SessionData {
        usuario?: Usuario;
    }
}
//Le añado el atributo codigo a la clase Error

declare class Error {
    codigo: number;
}

const app: Express = express();

const credenciales = {
    key: readFileSync(path.join(__dirname, "./config/" + config.N_Cert + ".key")),
    cert: readFileSync(path.join(__dirname, "./config/" + config.N_Cert + ".crt"))
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req: Request, _res: Response, next: NextFunction): void => {
    console.log(req.method, req.url);
    next();
});

app.use(session({
    secret: 'keyboard cat',

}));
app.use(cookie_parser());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(index);
app.use("/app", appRuta);


//Los middleware para el manejo de errores han de tener obligatoriamente 4 argumentos. El siguente comentario desactiva el warning de esLint
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(function (err: Error, _req: Request, res: Response, _next: NextFunction) {
    const codigo: number = err.codigo == undefined ? 500 : err.codigo;
    console.log("Entra en el error: ", err);
    switch (codigo) {
        case 500:
            res.status(codigo).send("codigo 500");
            break;
        case 400:
            res.status(codigo).send("codigo 400");
            break;
        default:
            res.status(500).send("Error desconocido");
            break;
    }
});


https.createServer(credenciales, app).listen(config.Puerto);