import CodigoError from "./CodigoError";

export default class ErrorUsuario extends CodigoError {
    constructor(msg: string, codigo?: number) {
        super(msg, codigo);
        this.name = "ErrorUsuario";
    }
}