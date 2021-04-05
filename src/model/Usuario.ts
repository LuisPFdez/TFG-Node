// const SHA2 = require("crypto-js/sha256")
import { SHA256 as SHA2 } from "crypto-js";

import ErrorUsuario from "../errors/ErrorUsuario";
import ObjetoUsuarioInterface from "../interfaces/ObjetoUsuarioInterface";
import UsuarioInterface from "../interfaces/UsuarioInterface";
//Tipos de usuario, estos tipos definiran sus permisos
export enum Tipos {
    ADMIN = "ADMIN",
    SEMI_ADMIN = "SEMI_ADMIN",
    SUPER_USUARIO = "SUPER_USUARIO",
    USUARIO = "USUARIO"
}

export class Usuario implements UsuarioInterface {

    codUsuario: string;
    password: string;
    descripcion: string;
    tipo: string;

    constructor(codUsuario: string, password: string, descripcion: string, tipo: string | null = "Usuario", encriptar = true) {
        if (tipo == null) tipo = Tipos.USUARIO;
        if (tipo in Tipos) {
            this.codUsuario = codUsuario;
            if (encriptar) this.password = Usuario.encriptarPassword(this.codUsuario, password);
            else this.password = password;
            this.descripcion = descripcion;
            this.tipo = tipo;
        } else {
            throw new ErrorUsuario("Error, el tipo de usuario no es valido");
        }
    }

    cambiarPassword(password: string): void {
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

    static encriptarPassword(codUsuario: string, password: string): string {
        return SHA2(codUsuario + password).toString();

    }

    static crearUsuarioDeObjeto(objeto: ObjetoUsuarioInterface, encriptar = false): UsuarioInterface {
        return new Usuario(objeto.codUsuario, objeto.password, objeto.descripcion, objeto.tipo, encriptar);

    }
}
