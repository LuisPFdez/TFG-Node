import { DocumentData } from "@google-cloud/firestore";
import admin, { ServiceAccount } from 'firebase-admin';

import ErrorDB from "../errors/ErrorDB";
import { Usuario, Tipos } from "./Usuario";
import ObjetoUsuarioInterface from "../interfaces/ObjetoUsuarioInterface";
import credenciales from "../config/ConfigDB.json";
import {stNull, usNull} from "../controller/types";
admin.initializeApp({
    credential: admin.credential.cert(<ServiceAccount>credenciales)
});

const UsuariosDB = (admin.firestore()).collection("Usuarios");


export default class UsuarioDB {

    //Comprueba si existe algun usuario con el codigo pasado por parametro
    static validarCodExiste(codUsuario: string): Promise<boolean> {
        //Busca un documento con el codigo de usuario pasado por parametro y ejecuta la funcion get
        //La funcion get devuelve una promesa, esta es retornada junto con then, que devolvera si el documento existe 
        //Y catch que lanzara un error de la clase ErrorDB
        return UsuariosDB.doc(codUsuario).get()
            .then((datos: DocumentData): boolean => datos.exists)
            .catch((error: Error): never => {
                throw new ErrorDB("Error al conectar con la base de datos, error devuelto: " + error.message);
            });
        /* Codigo de forma mas legible, en este caso la funcion debera de ser async 
            try {
                var datos = await UsuariosDB.doc(codUsuario).get();
                return datos.exists;
            } catch (error) {
                throw new ErrorDB("Error al conectar con la base de datos, error devuelto: " + error)
            }
        */

    }

    static async validadUsuario(codUsuario: string, password: string): Promise<usNull> {

        if (! await UsuarioDB.validarCodExiste(codUsuario)) {
            return null;
        }

        const passwordE: string = Usuario.encriptarPassword(codUsuario, password);

        return UsuariosDB.doc(codUsuario).get()
            .then((datos: DocumentData): usNull => {
                if (datos.exists && datos.data().password == passwordE) {
                    return <Usuario>datos.data();
                } else {
                    return null;
                }
            }).catch((error: Error): never => { throw new ErrorDB(error.message) });

    }

    static async buscarUsuario(codUsuario: string): Promise<usNull> {

        console.log("Entra en buscar usuario");
        if (! await UsuarioDB.validarCodExiste(codUsuario)) {
            return null;
        }

        const datos: ObjetoUsuarioInterface = await UsuariosDB.doc(codUsuario).get()
            .then((datos: DocumentData): ObjetoUsuarioInterface => <ObjetoUsuarioInterface>datos.data())
            .catch((error: Error): never => { throw new ErrorDB(error.message) });
        return Usuario.crearUsuarioDeObjeto(datos);


    }

    static async borrarUsuario(codUsuario: string): Promise<boolean> {

        if (! await UsuarioDB.validarCodExiste(codUsuario)) {
            return false;
        }
        await UsuariosDB.doc(codUsuario).delete().catch((error: Error): never => { throw new ErrorDB(error.message) });
        return true;

    }

    static async crearUsuario(codUsuario: string, password: string, descripcion: string, tipo:stNull = null): Promise<usNull> {

        if (await UsuarioDB.validarCodExiste(codUsuario)) {
            return null;
        }
        const usuario = new Usuario(codUsuario, password, descripcion, tipo);
        const oUsuario = usuario.crearObjecto();
        await UsuariosDB.doc(usuario.codUsuario).set(oUsuario)
            .catch((error: Error): never => { throw new ErrorDB(error.message) });
        return usuario;

    }

    static async modificarUSuario(codUsuario: string, descripcion: string, tipo:stNull= null): Promise<boolean> {

        if (! await UsuarioDB.validarCodExiste(codUsuario)) {
            return false;
        }

        const usuario: { descripcion: string, tipo?: string } = {
            descripcion: descripcion
        };

        if (tipo != null && tipo in Tipos) usuario.tipo = tipo;

        return UsuariosDB.doc(codUsuario).update(usuario)
            .then((): boolean => true)
            .catch((error: Error): never => { throw new ErrorDB(error.message) });


    }

    static async modificarPassword(codUsuario: string, password: string,): Promise<boolean> {

        if (! await UsuarioDB.validarCodExiste(codUsuario)) {
            return false;
        }
        const passwordE: string = Usuario.encriptarPassword(codUsuario, password);
        return UsuariosDB.doc(codUsuario).update({ password: passwordE })
            .then((): boolean => true)
            .catch((error: Error): never => { throw new ErrorDB(error.message) });

    }
}