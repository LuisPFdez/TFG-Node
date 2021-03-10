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
                console.log("Entra here");
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

    static async crearUsuario(codUsuario, password, descripcion) {
        if (await UsuarioDB.validarCodNoExiste(codUsuario)) {
            return null;
        }
        // var usuario = new Usuario(codUsuario, password, descripcion);

    }

}

module.exports = UsuarioDB;