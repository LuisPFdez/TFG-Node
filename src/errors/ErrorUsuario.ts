export default class ErrorUsuario extends Error{
    constructor(msg = "Error, algo ha fallado en la clase Usuario"){
        super(msg);
        this.name = "ErrorUsuario";
    }
}