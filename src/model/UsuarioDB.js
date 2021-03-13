const Usuario = require("./Usuario");
const ErrorDB = require("../errors/ErrorDB");
// const {conectar} = require("./DB");

const admin = require("firebase-admin")
admin.initializeApp({
    credential: admin.credential.cert(require("../config/Database.json"))
});

var UsuariosDB = (admin.firestore()).collection("Usuarios")

class UsuarioDB {

    //Comprueba si existe algun usuario con el codigo pasado por parametro
    static validarCodNoExiste(codUsuario) {
        //Busca un documento con el codigo de usuario pasado por parametro y ejecuta la funcion get
        //La funcion get devuelve una promesa, esta es retornada junto con then, que devolvera si el documento existe 
        //Y catch que lanzara un error de la clase ErrorDB
        return UsuariosDB.doc(codUsuario).get()
            .then(datos => datos.exists)
            .catch(error => {
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

    static async buscarUsuario(codUsuario) {
        try {
            console.log("Entra en buscar usuario");
            if (! await UsuarioDB.validarCodNoExiste(codUsuario)) {
                return null;
            }

            var datos = await UsuariosDB.doc(codUsuario).get()
                .then(datos => datos.data())
                .catch(err => { throw new ErrorDB(err) });
            return Usuario.crearUsuarioDeObjeto(datos);

        } catch (error) {
            console.log("Error al ejecuatar operacion en la base de datos: ", error);
            return null;
        }
    }

    static async borrarUsuario(codUsuario) {
        try {
            if (! await UsuarioDB.validarCodNoExiste(codUsuario)) {
                return false;
            }
            await UsuariosDB.doc(codUsuario).delete().catch((err) => { throw new ErrorDB(err) });
            return true;
        } catch (error) {
            console.log("Error al ejecuatar operacion en la base de datos: ", error);
            return false;
        }
    }

    static async crearUsuario(codUsuario, password, descripcion, tipo = null) {
        try {
            if (await UsuarioDB.validarCodNoExiste(codUsuario)) {
                return null;
            }
            var usuario = new Usuario(codUsuario, password, descripcion, tipo);
            // Object.create()
            var oUsuario = usuario.crearObjecto();
            var oS = Object.create(usuario);
            console.log("Crear usuario")
            console.log(oUsuario);
            await UsuariosDB.doc(usuario.codUsuario).set(oUsuario)
                .catch((err) => { throw new ErrorDB(err) });
            return usuario;
        } catch (error) {
            console.log("Error al ejecuatar operacion en la base de datos: ", error);
            return null;
        }

    }

}

module.exports = UsuarioDB;