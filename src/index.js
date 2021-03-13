const UsuarioDB = require("./model/UsuarioDB");

async function comp() {

    var existe = await UsuarioDB.crearUsuario("Admin", "paso", "Administrador");
    console.log(existe);
    var hola = await UsuarioDB.buscarUsuario("Admin");
    console.log(hola);
    
}
console.log("Inicio aplicacion")
comp();


