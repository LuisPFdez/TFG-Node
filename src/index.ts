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

//Indica que en el modulo express-session se ampliará la interface de SessionData (conocido como Declaration Merging)
declare module 'express-session' {
    //SessionData, permite añadir propiedades a la Sesión
    interface SessionData {
        //El usuario almacena los datos del usuario que ha iniciado Sesion.
        usuario?: Usuario;
        //La intencion es que fuera un Map, con un string como clave y un booleano como valor
        //Sin embargo la session solo acepta objetos serializables a JSON
        reautenticacion?: Record<string, boolean>;
        //Cuando sea necesario hacer una reautenticación, la ruta, se almacenará en la Sesión 
        urlReautenticar?: string;
    }
}

declare module 'express'{
    //Extiende la interfaz Request
    interface Request{
        //La propiedad siguiente permitira indicar la ruta a la que redirecionar, en
        //la función reautenticarFin
        siguiente?:string;
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
    console.log(req.method, req.originalUrl);
    next();
});

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(cookie_parser());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/app", appRuta);
//La ruta index ha de ir la ultima debido a que tiene el middleware para paginas no encontradas.
app.use(index);



https.createServer(credenciales, app).listen(config.Puerto);