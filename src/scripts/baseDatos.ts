/**
 * @file Script que permite hacer una carga inicial en la base de datos
 * @author Luis Puente Fernández
 * 
*/

import credenciales from "../config/ConfigDB.json";
import admin, { ServiceAccount } from 'firebase-admin';
import ObjetoUsuarioInterface, { } from "../interfaces/ObjetoUsuarioInterface";
import { Usuario } from "../model/Usuario";
import config from "../config/Config.json";

admin.initializeApp({
    credential: admin.credential.cert(<ServiceAccount>credenciales)
});

const UsuariosDB = (admin.firestore()).collection(config.Coleccion);

//Este array contiene los usuarios que van a ser cargados en la base de datos.
//No es necesario, poner la contraseña encriptada, el script lo hace de forma automatica
//Es necesario que los codigos del usuario no tengan espacios, para evitar problemas con la aplicacion.
const DatosUsuarios: Array<ObjetoUsuarioInterface> = [
    {
        codUsuario: "Admin",
        descripcion: "Administrador",
        password: "paso",
        tipo: "ADMIN"
    },
    {
        codUsuario: "Pruebas",
        descripcion: "Usuario de pruebas",
        password: "paso",
        tipo: "USUARIO"
    },
    {
        codUsuario: "Pruebas2",
        descripcion: "Usuario de pruebas 2",
        password: "paso",
        tipo: "USUARIO"
    }
];

DatosUsuarios.forEach(async (datos): Promise<void> => {
    const usuario: ObjetoUsuarioInterface = datos;

    //Se encripta la contraseña
    usuario.password = Usuario.encriptarPassword(datos.codUsuario, datos.password);


    await UsuariosDB.doc(usuario.codUsuario).set(usuario)
        .catch(error => { console.log(error) });
});

console.log("\x1b[34m", "Datos insertados", "\x1b[0m");