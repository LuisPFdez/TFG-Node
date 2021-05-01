import { SHA256 as SHA2 } from "crypto-js";

import ErrorUsuario from "../errors/ErrorUsuario";
import ObjetoUsuarioInterface from "../interfaces/ObjetoUsuarioInterface";
import UsuarioInterface from "../interfaces/UsuarioInterface";
import { stNull } from "../controller/types";

//Tipos de usuario, estos tipos definiran sus permisos
export const Tipos: Record<string, number> = {
    ADMIN: 4,
    //SEMI_ADMIN: 3,
    //SUPER_USUARIO: 2,
    USUARIO: 1
};

/**
 * Clase que define el comportamiento de los usuario
 * @implements UsuarioInterface
 */
export class Usuario implements UsuarioInterface {
    
    codUsuario: string;
    password: string;
    descripcion: string;
    tipo: string;

    /**
     * @param codUsuario codigo del usuario
     * @param password contraseña del usuario
     * @param descripcion descripcion del usuario
     * @param tipo tipo del usuario, por defecto USUARIO
     * @param encriptar indica si es necesaro encriptar la contraseña, por defecto true
     */
    constructor(codUsuario: string, password: string, descripcion: string, tipo: stNull = "USUARIO", encriptar = true) {
        //Comprueba si el tipo es null, en caso de serlo, cambia el tipo a "USUARIO"
        if (tipo == null) tipo = "USUARIO";
        
        //Comprueba si el tipo esta en el objeto Tipos
        if (tipo in Tipos) {
            this.codUsuario = codUsuario;
            //Comprueba si es necesario encriptar la contraseña
            if (encriptar) this.password = Usuario.encriptarPassword(this.codUsuario, password);
            else this.password = password;
            this.descripcion = descripcion;
            this.tipo = tipo;
        } else {
            //Si el tipo no pertenece al objeto Tipos lanza una excepcion
            throw new ErrorUsuario("Error, el tipo de usuario no es valido");
        }
    }

    /**
     * Permite cambiar la contraseña, encriptandola
     * @param password contraseña sin encriptar
     */
    cambiarPassword(password: string): void {
        this.password = Usuario.encriptarPassword(this.codUsuario, password);
    }

    /**
     * Crea un objecto de la de la clase 
     * @returns ObjetoUsuarioInterface
     */
    crearObjecto(): ObjetoUsuarioInterface {
        return {
            codUsuario: this.codUsuario,
            password: this.password,
            descripcion: this.descripcion,
            tipo: this.tipo
        };
    }

    /**
     * Metodo estatico que permite encriptar la contraseña
     * @param codUsuario el codigo del usuario
     * @param password contraseña sin encriptar
     * @returns string, la contraseña encriptada
     */
    static encriptarPassword(codUsuario: string, password: string): string {
        return SHA2(codUsuario + password).toString();

    }

    /**
     * Instancia un nuevo objeto de la clase Usuario, apartir de un objeto
     * @param objeto el objecto apartir del que se instanciara la clase
     * @param encriptar si es necesario encriptar la contraseña, por defecto false
     * @returns la instancia de la clase
     */
    static crearUsuarioDeObjeto(objeto: ObjetoUsuarioInterface, encriptar = false): UsuarioInterface {
        return new Usuario(objeto.codUsuario, objeto.password, objeto.descripcion, objeto.tipo, encriptar);

    }
}
