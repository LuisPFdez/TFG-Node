import CodigoError from "./CodigoError";

export default class ErrorDB extends CodigoError {
    constructor(msg: string, codigo?: number) {
        super(msg, codigo);
        this.name = "ErrorDB";
    }
}