const SHA2 = require("crypto-js/sha256")
const ErrorUsuario = require("../errors/ErrorUsuario")
class Usuario {
    static tipos = ["Admin", "Usuario"]
    constructor(codUsuario, password, descripcion, tipo = "Usuario", encriptar = true) {
        if (tipo == null) tipo = "Usuario";
        if (Usuario.tipos.includes(tipo)) {
            this.codUsuario = codUsuario;
            if (encriptar) this.password = this.encriptarPassword(password);
            else this.password = password
            this.descripcion = descripcion;
            this.tipo = tipo;
        } else {
            throw new ErrorUsuario("Error, el tipo de usuario no es valido");
        }
    }
    encriptarPassword(password) {
        return SHA2(this.codUsuario + password).toString();

    }

    cambiarPassword(password) {
        this.password = SHA2(this.codUsuario + password).toString();
    }

    static crearUsuarioDeObjeto(objeto, encriptar = false) {
        return new Usuario(objeto.codUsuario, objeto.password, objeto.descripcion, objeto.tipo, encriptar);
    }
}

module.exports = Usuario;