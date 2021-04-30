// const SHA2 = require("crypto-js/sha256")
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

export class Usuario implements UsuarioInterface {

    codUsuario: string;
    password: string;
    descripcion: string;
    tipo: string;

    constructor(codUsuario: string, password: string, descripcion: string, tipo: stNull = "USUARIO", encriptar = true) {
        if (tipo == null) tipo = "USUARIO";
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
