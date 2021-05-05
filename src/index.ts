/**
 * @file archivo principal. 
 * @author Luis Puente Fernández
 */
import express, { Express } from 'express';
import cookie_parser from "cookie-parser";
import session from "express-session";
import { readFileSync } from "fs";
import https from "https";
import path from "path";

import { Usuario } from "./model/Usuario";
import index from "./routes/index";
import appRuta from "./routes/app";
import adminRuta from "./routes/admin";
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

declare module 'express' {
    //Extiende la interfaz Request
    interface Request {
        //La propiedad siguiente permitira indicar la ruta a la que redirecionar, en
        //la función reautenticarFin
        siguiente?: string;
    }
}

const app: Express = express();

//Credenciales para HTTPS
const credenciales = {
    key: readFileSync(path.join(__dirname, "./config/" + config.N_Cert + ".key")),
    cert: readFileSync(path.join(__dirname, "./config/" + config.N_Cert + ".crt"))
};

//Configura el motor de renderizado a ejs
app.set("view engine", "ejs");
//Establece la carpeta de las vista
app.set("views", path.join(__dirname, "views"));

//Configura la sesion
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
//Middleware para el uso de cookies
app.use(cookie_parser());

//Carpeta publica para recursos como JavaScrip, imagenes o css
app.use(express.static(path.join(__dirname, "public")));
//Middleware para descodificar el cuerpo de la peticion
app.use(express.urlencoded({ extended: true }));
//Convierte el cuerpo de la peticion en un JSON
app.use(express.json());

//Carga de rutas
app.use("/app", appRuta);
app.use("/admin", adminRuta);
//La ruta index ha de ir la ultima debido a que tiene el middleware para paginas no encontradas.
app.use(index);

//Usa el modulo https, le pasa como parametros las credenciales y la app express
https.createServer(credenciales, app).listen(config.Puerto);

//Codigo para ejecutar el servidor sin http
//app.listen(config.Puerto);