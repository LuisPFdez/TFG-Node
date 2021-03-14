import UsuarioDB from "./model/UsuarioDB";

async function com() {
    try {
        var pruebas = await UsuarioDB.validarCodNoExiste("Admin");
        console.log(pruebas);
    } catch (error) {
        console.log("Error")
    }
}

com();

// try {
//     var prueba: Usuario = new Usuario("Admin", "paso", "prueba", "Admin");
//     console.log(prueba);
// } catch (error) {
//     console.log("error");
// }


// import express, {  NextFunction, Request, Response } from 'express';
// // import {} from "coo"
// import Usuario from "./model/Usuario";
// import Usuari from "cookie-parser"
// const app = express();

// app.use(function(req, res, next:NextFunction){
//     res.cookie("pruebas", "ramon");
//     next();
// });

// app.use(Usuari());

// app.get("/", function(req, res, next):void{
//     var pruebas:string = req.cookies.pruebas;
//     res.send("Hola: ".concat(pruebas));
// });

// app.listen(3000);