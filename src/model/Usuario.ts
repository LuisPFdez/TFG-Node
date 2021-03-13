// const SHA2 = require("crypto-js/sha256")
import { SHA256 as SHA2 } from "crypto-js";
import ErrorUsuario from "../errors/ErrorUsuario";
import ObjetoUsuarioInterface from "../interfaces/ObjetoUsuarioInterface";

export enum Tipos {
    Admin = "Admin",
    Usuario = "Usuario"
}

interface UsuarioInterface {
    codUsuario: string;
    password: string;
    descripcion: string;
    tipo: string;

    cambiarPassword(password: string): void;
    crearObjecto(): ObjetoUsuarioInterface;

}

export default class Usuario implements UsuarioInterface {
    codUsuario: string;
    password: string;
    descripcion: string;
    tipo: string;
    constructor(codUsuario: string, password: string, descripcion: string, tipo: string | null = "Usuario", encriptar = true) {
        if (tipo == null) tipo = "Usuario";
        if (tipo in Tipos) {
            this.codUsuario = codUsuario;
            if (encriptar) this.password = Usuario.encriptarPassword(this.codUsuario, password);
            else this.password = password
            this.descripcion = descripcion;
            this.tipo = tipo;
        } else {
            throw new ErrorUsuario("Error, el tipo de usuario no es valido");
        }
        Tipos
    }
    

    cambiarPassword(password: string) {
        this.password = Usuario.encriptarPassword(this.codUsuario, password);
    }

    crearObjecto(): ObjetoUsuarioInterface {
        return {
            codUsuario: this.codUsuario,
            password: this.password,
            descripcion: this.descripcion,
            tipo: this.tipo
        };
    }

    static encriptarPassword(codUsuario: string, password: string) {
        return SHA2(codUsuario + password).toString();

    }
    
    static crearUsuarioDeObjeto(objeto: ObjetoUsuarioInterface, encriptar: boolean = false): UsuarioInterface {
        return new Usuario(objeto.codUsuario, objeto.password, objeto.descripcion, objeto.tipo, encriptar);
        
    }
}
