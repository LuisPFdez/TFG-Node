// const Usuario = require("./Usuario");
// const ErrorDB = require("../errors/ErrorDB");
// const {conectar} = require("./DB");
// const admin = require("firebase-admin")

import ErrorDB from "../errors/ErrorDB"
import Usuario from "./Usuario";
import ObjetoUsuarioInterface from "../interfaces/ObjetoUsuarioInterface";
import admin, { ServiceAccount } from 'firebase-admin';
import credenciales from "../config/Database.json";
import GenericoInterface from "../interfaces/GenericoInterface";

admin.initializeApp({
    credential: admin.credential.cert(<ServiceAccount>credenciales)
});

var UsuariosDB = (admin.firestore()).collection("Usuarios")

export default class UsuarioDB {

    //Comprueba si existe algun usuario con el codigo pasado por parametro
    static validarCodNoExiste(codUsuario: string): Promise<boolean> {
        //Busca un documento con el codigo de usuario pasado por parametro y ejecuta la funcion get
        //La funcion get devuelve una promesa, esta es retornada junto con then, que devolvera si el documento existe 
        //Y catch que lanzara un error de la clase ErrorDB
        return UsuariosDB.doc(codUsuario).get()
            .then((datos: GenericoInterface): boolean => datos.exists)
            .catch((error: Error): never => {
                throw new ErrorDB("Error al conectar con la base de datos, error devuelto: " + error)
            });
        /* Codigo de forma mas legible, en este caso la funcion debera de ser async 
            try {
                var datos = await UsuariosDB.doc(codUsuario).get();
                return datos.exists;
            } catch (error) {
                throw new ErrorDB("Error al conectar con la base de datos, error devuelto: " + error)
            }
        */

    };

    static async buscarUsuario(codUsuario: any): Promise<Usuario | null> {
        try {
            console.log("Entra en buscar usuario");
            if (! await UsuarioDB.validarCodNoExiste(codUsuario)) {
                return null;
            }

            var datos: ObjetoUsuarioInterface = await UsuariosDB.doc(codUsuario).get()
                .then((datos: GenericoInterface): ObjetoUsuarioInterface => <ObjetoUsuarioInterface>datos.data())
                .catch((error: Error): never => { throw new ErrorDB(error.message) });
            return Usuario.crearUsuarioDeObjeto(datos);

        } catch (error) {
            console.log("Error al ejecuatar operacion en la base de datos: ", error);
            return null;
        }
    }

    static async borrarUsuario(codUsuario: string): Promise<boolean> {
        try {
            if (! await UsuarioDB.validarCodNoExiste(codUsuario)) {
                return false;
            }
            await UsuariosDB.doc(codUsuario).delete().catch((error: Error): never => { throw new ErrorDB(error.message) });
            return true;
        } catch (error) {
            console.log("Error al ejecuatar operacion en la base de datos: ", error);
            return false;
        }
    }

    static async crearUsuario(codUsuario: string, password: string, descripcion: string, tipo: string | null = null): Promise<Usuario | null> {
        try {
            if (await UsuarioDB.validarCodNoExiste(codUsuario)) {
                return null;
            }
            var usuario = new Usuario(codUsuario, password, descripcion, tipo);
            var oUsuario = usuario.crearObjecto();
            await UsuariosDB.doc(usuario.codUsuario).set(oUsuario)
                .catch((error: Error): never => { throw new ErrorDB(error.message) });
            return usuario;
        } catch (error) {
            console.log("Error al ejecuatar operacion en la base de datos: ", error);
            return null;
        }
    }
}

// module.exports = UsuarioDB;