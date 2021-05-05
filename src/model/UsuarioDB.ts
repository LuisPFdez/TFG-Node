/**
 * @file Contiene la clase UsuarioDB, que permite trabajar con la base de datos 
 * @author Luis Puente Fernández
 */
import { DocumentData, QuerySnapshot } from "@google-cloud/firestore";
import admin, { ServiceAccount } from 'firebase-admin';

import ErrorDB from "../errors/ErrorDB";
import { Usuario, Tipos } from "./Usuario";
import ObjetoUsuarioInterface from "../interfaces/ObjetoUsuarioInterface";
import credenciales from "../config/ConfigDB.json";
import config from "../config/Config.json";
import { stNull, usNull } from "../controller/types";
import UsuarioInterface from "../interfaces/UsuarioInterface";
admin.initializeApp({
    credential: admin.credential.cert(<ServiceAccount>credenciales)
});

const UsuariosDB = (admin.firestore()).collection(config.Coleccion);

/**
 * Clase que permite trabajar con la base de datos, con metodos estaticos que permiten 
 * realizar ciertas acciones sobre esta
 */
export default class UsuarioDB {

    /**
     * Comprueba si existe algun usuario con el codigo pasado por parametro
     * @param codUsuario codigo a validar
     * @returns si el codigo existe o no, es una promesa de tipo boolean
     */
    static validarCodExiste(codUsuario: string): Promise<boolean> {
        //Busca un documento con el codigo de usuario pasado por parametro y ejecuta la funcion get
        //La funcion get devuelve una promesa, esta es retornada junto con then, que devolvera si el documento existe 
        //Y catch que lanzara un error de la clase ErrorDB
        return UsuariosDB.doc(codUsuario).get()
            .then((datos: DocumentData): boolean => datos.exists)
            .catch((error: Error): never => {
                throw new ErrorDB("Error al conectar con la base de datos, error devuelto: " + error.message);
            });

    }

    /**
     * Comprueba el codigo de usuario y la contraseña, estan asociados, y si es asi devuelve el objeto usuario
     * @param codUsuario codigo del usuario
     * @param password contraseña sin encriptar
     * @returns el objeto usuario o null
     */
    static async validadUsuario(codUsuario: string, password: string): Promise<usNull> {
        //Comprueba si el codigo de usuario existe, si no existe retorna null
        if (! await UsuarioDB.validarCodExiste(codUsuario)) {
            return null;
        }

        //Encripta la contraseña
        const passwordE: string = Usuario.encriptarPassword(codUsuario, password);

        //Promesa que comprueba si la contraseña coincide con el usuario.
        //El catch lanza un ErrorDB, con el mensaje del error
        return UsuariosDB.doc(codUsuario).get()
            .then((datos: DocumentData): usNull => {
                if (datos.exists && datos.data().password == passwordE) {
                    //Convierte los datos en un tipo Usuario y los devuelve
                    return <Usuario>datos.data();
                } else {
                    //Si la contraseña no esta asociada retorna null
                    return null;
                }
            }).catch((error: Error): never => { throw new ErrorDB(error.message) });

    }

    /**
     * Busca un usuario por su codigo
     * @param codUsuario codigo del usuario
     * @returns null o el objeto Usuario
     */
    static async buscarUsuario(codUsuario: string): Promise<usNull> {
        //Comprueba si el codigo de usuario existe, si no existe retorna null
        if (! await UsuarioDB.validarCodExiste(codUsuario)) {
            return null;
        }
        
        //Obtiene los datos del documento asociado con el codigo del usuario, y los convierte a ObjetoUsuarioInterface
        //en caso de error lanza un ErrorDB
        const datos: ObjetoUsuarioInterface = await UsuariosDB.doc(codUsuario).get()
            .then((datos: DocumentData): ObjetoUsuarioInterface => <ObjetoUsuarioInterface>datos.data())
            .catch((error: Error): never => { throw new ErrorDB(error.message) });
        return Usuario.crearUsuarioDeObjeto(datos);


    }

    /**
     * Borra un usuario por su codigo
     * @param codUsuario codigo del usario
     * @returns si se ha borrado o no
     */
    static async borrarUsuario(codUsuario: string): Promise<boolean> {

        //Comprueba si el codigo existe, si no devuelve false
        if (! await UsuarioDB.validarCodExiste(codUsuario)) {
            return false;
        }

        //Elimina el documento asociado con el codigo del usuario, en caso de error lanza un ErrorDB
        await UsuariosDB.doc(codUsuario).delete().catch((error: Error): never => { throw new ErrorDB(error.message) });
        return true;

    }

    /**
     * Crea un usuario
     * @param codUsuario codigo del usuario
     * @param password contraseña del usuario
     * @param descripcion descripcion del usuario
     * @param tipo tipo del usuario, null por defecto
     * @returns el Usuario creado o null
     */
    static async crearUsuario(codUsuario: string, password: string, descripcion: string, tipo: stNull = null): Promise<usNull> {
        //Comprueba si el codigo del usuario existe. Si existe retorna null
        if (await UsuarioDB.validarCodExiste(codUsuario)) {
            return null;
        }
        //Instancia un objeto de la clase usuario
        const usuario = new Usuario(codUsuario, password, descripcion, tipo);
        //Convierte la instancia en un objeto (FireStore no permite clases para los campos han de ser objetos)
        const oUsuario = usuario.crearObjecto();
        //Inserta el usuario, en caso de error lanza ErrorDB
        await UsuariosDB.doc(usuario.codUsuario).set(oUsuario)
            .catch((error: Error): never => { throw new ErrorDB(error.message) });
        return usuario;

    }

    /**
     * Modifica la descripcion y o el tipo del usuario
     * @param codUsuario codigo del usuario
     * @param descripcion descripcion del usuario
     * @param tipo tipo del usuario
     * @returns se ha modifica o no
     */
    static async modificarUSuario(codUsuario: string, descripcion: string, tipo: stNull = null): Promise<boolean> {

        //Si el codigo no existe retorna false
        if (! await UsuarioDB.validarCodExiste(codUsuario)) {
            return false;
        }

        //Objeto que tendra por propiedades la descripcion y el tipo (opcional)
        const usuario: { descripcion: string, tipo?: string } = {
            descripcion: descripcion
        };

        //Comprueba si el tipo no es null y si esta en Tipos
        if (tipo != null && tipo in Tipos) usuario.tipo = tipo; //Si entra en el if, establece el valor de tipo, igual al parametro tipo

        //Actualiza el usuario
        return UsuariosDB.doc(codUsuario).update(usuario)
            .then((): boolean => true)
            .catch((error: Error): never => { throw new ErrorDB(error.message) });


    }

    /**
     * Modifica la contraseña del usuario
     * @param codUsuario codigo del usuario
     * @param password contraseña del usuario
     * @returns si ha sido modificado
     */
    static async modificarPassword(codUsuario: string, password: string,): Promise<boolean> {
        //Si el codigo no existe devuelve false
        if (! await UsuarioDB.validarCodExiste(codUsuario)) {
            return false;
        }

        //Encripta la contraseña
        const passwordE: string = Usuario.encriptarPassword(codUsuario, password);
        //Actualiza la contraseña
        return UsuariosDB.doc(codUsuario).update({ password: passwordE })
            .then((): boolean => true)
            .catch((error: Error): never => { throw new ErrorDB(error.message) });

    }

    /**
     * Obtiene todos los usuarios de la base de datos
     * @returns un Array de usuarios
     */
    static async listarUsuarios(): Promise<Array<UsuarioInterface>> {
        //Obtiene todos los datos de la base de datos y los mapea para generar un Array con los usuarios
        return UsuariosDB.get()
            .then((datos: QuerySnapshot): Array<UsuarioInterface> => {
                return datos.docs.map((datos: DocumentData): UsuarioInterface => <UsuarioInterface>datos.data());
            }).catch((error: Error): never => { throw new ErrorDB(error.message) });
    }
}