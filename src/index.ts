// import UsuarioDB from "./model/UsuarioDB";
import express, { Express, NextFunction, Request, Response } from 'express';
import cookie_parser from "cookie-parser";
import session from "express-session";
import { readFileSync } from "fs";
import https from "https";
import path from "path";

import { Usuario } from "./model/Usuario";
import index from "./routes/index";
import appRuta from "./routes/app";
import config from "./config/Config.json";

declare module 'express-session' {
    interface SessionData {
        usuario?: Usuario;
    }
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

app.use("/app", appRuta);
//La ruta index ha de ir la ultima debido a que tiene el middleware para paginas no encontradas.
app.use(index);



https.createServer(credenciales, app).listen(config.Puerto);