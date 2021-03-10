const UsuarioDB = require("./model/UsuarioDB");

async function comp() {

    var existe = await UsuarioDB.validarCodNoExiste("Admin");

    console.log(existe);
}

comp();


// const https = require("https");
// const admin = require("firebase-admin")

// admin.initializeApp({
//     credential: admin.credential.cert(require("./config/Database.json"))
// });

// const db = admin.firestore();

// var datosO = {
//     CodUsuario : "Pruebas",
//     Password : "maspaso",
//     Tipo : "usuario",
// }

// async function ad() {
//     const citiesRef = await db.collection('Usuarios');
//     // var datos = await citiesRef.doc("Admin").get();
//     // if (datos.exists) {
//     //     var hola = datos.data();
//     //     console.log(typeof(hola));
//     // } else {
//         await citiesRef.doc(datosO.CodUsuario).set(datosO);

//     // }


// }
// ad();


